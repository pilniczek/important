import { readFile, writeFile, stat, unlink, access } from "node:fs/promises"
import { join, basename, extname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import { globby } from "globby"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const assetsDir = join(repoRoot, "content", "assets")
const contentDir = join(repoRoot, "content")

const QUALITY = 82
const MIN_SIZE_BYTES = 30 * 1024

const dryRun = process.argv.includes("--dry-run")

function fmtBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

async function convertOne(srcPath) {
  const ext = extname(srcPath).toLowerCase()
  const base = basename(srcPath, extname(srcPath))
  const dstPath = join(assetsDir, `${base}.webp`)
  const srcStat = await stat(srcPath)

  if (await fileExists(dstPath)) {
    return { status: "skip-exists", srcPath, dstPath, srcSize: srcStat.size }
  }
  if (srcStat.size < MIN_SIZE_BYTES) {
    return { status: "skip-small", srcPath, dstPath, srcSize: srcStat.size }
  }

  if (dryRun) {
    return { status: "would-convert", srcPath, dstPath, srcSize: srcStat.size, dstSize: null }
  }

  try {
    const input = ext === ".gif" ? sharp(srcPath, { animated: true }) : sharp(srcPath)
    await input.webp({ quality: QUALITY }).toFile(dstPath)
  } catch (err) {
    return { status: "convert-failed", srcPath, dstPath, srcSize: srcStat.size, error: err.message }
  }

  const dstStat = await stat(dstPath)
  if (dstStat.size >= srcStat.size) {
    await unlink(dstPath)
    return { status: "bigger-kept-original", srcPath, dstPath, srcSize: srcStat.size, dstSize: dstStat.size }
  }

  return { status: "converted", srcPath, dstPath, srcSize: srcStat.size, dstSize: dstStat.size }
}

function makeRewriter(renameMap) {
  const re = /!\[\[([^\]|]+?)(\|[^\]]*)?\]\]/g
  return (text) => {
    let touched = 0
    const out = text.replace(re, (match, target, alias) => {
      const trimmed = target.trim()
      const replacement = renameMap.get(trimmed)
      if (!replacement) return match
      touched++
      return `![[${replacement}${alias ?? ""}]]`
    })
    return { out, touched }
  }
}

async function rewriteReferences(renameMap) {
  const mdFiles = await globby("**/*.md", { cwd: contentDir, absolute: true })
  const rewrite = makeRewriter(renameMap)
  const refCounts = new Map()

  for (const mdPath of mdFiles) {
    const text = await readFile(mdPath, "utf8")
    const { out, touched } = rewrite(text)
    if (touched > 0) {
      if (!dryRun) await writeFile(mdPath, out)
      refCounts.set(mdPath, touched)
    }
  }
  return refCounts
}

async function main() {
  const sources = await globby("*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}", { cwd: assetsDir, absolute: true })
  console.log(`Found ${sources.length} candidate image(s) in content/assets/`)
  console.log(`Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE"}`)
  console.log()

  const results = []
  for (const src of sources) {
    results.push(await convertOne(src))
  }

  const renameMap = new Map()
  for (const r of results) {
    if (r.status === "converted" || r.status === "would-convert") {
      renameMap.set(basename(r.srcPath), basename(r.dstPath))
    }
  }

  const refCountsPerFile = await rewriteReferences(renameMap)

  let totalSrc = 0
  let totalDst = 0
  let convertedCount = 0
  let deletedCount = 0
  const skippedExists = []
  const skippedSmall = []
  const failures = []
  const biggerKept = []

  for (const r of results) {
    if (r.status === "converted" || r.status === "would-convert") {
      convertedCount++
      totalSrc += r.srcSize
      if (r.dstSize != null) totalDst += r.dstSize
      if (r.status === "converted") {
        await unlink(r.srcPath)
        deletedCount++
      }
    } else if (r.status === "skip-exists") {
      skippedExists.push(r)
    } else if (r.status === "skip-small") {
      skippedSmall.push(r)
    } else if (r.status === "bigger-kept-original") {
      biggerKept.push(r)
    } else if (r.status === "convert-failed") {
      failures.push(r)
    }
  }

  console.log(`Converted: ${convertedCount}  (originals deleted: ${deletedCount})`)
  console.log(`Skipped (webp already existed): ${skippedExists.length}`)
  console.log(`Skipped (< ${fmtBytes(MIN_SIZE_BYTES)}): ${skippedSmall.length}`)
  console.log(`WebP came out larger, original kept: ${biggerKept.length}`)
  console.log(`Conversion failures: ${failures.length}`)
  console.log()
  console.log(`Markdown files updated: ${refCountsPerFile.size}`)
  let totalRefs = 0
  for (const n of refCountsPerFile.values()) totalRefs += n
  console.log(`Total wiki-image references rewritten: ${totalRefs}`)
  console.log()

  if (failures.length) {
    console.log("--- failures ---")
    for (const f of failures) console.log(`  ${basename(f.srcPath)}: ${f.error}`)
    console.log()
  }
  if (biggerKept.length) {
    console.log("--- WebP was bigger, kept original ---")
    for (const b of biggerKept) {
      console.log(`  ${basename(b.srcPath)}: src=${fmtBytes(b.srcSize)} dst=${fmtBytes(b.dstSize)}`)
    }
    console.log()
  }

  console.log(`Total bytes (originals of converted): ${fmtBytes(totalSrc)}`)
  if (!dryRun) console.log(`Total bytes (new webp):              ${fmtBytes(totalDst)}`)
  if (!dryRun) console.log(`Saved:                               ${fmtBytes(totalSrc - totalDst)}  (${((1 - totalDst / Math.max(totalSrc, 1)) * 100).toFixed(1)}%)`)
  if (dryRun) console.log(`Re-run without --dry-run to apply.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
