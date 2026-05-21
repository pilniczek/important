import { readFile, writeFile, stat, unlink, access } from "node:fs/promises"
import { join, basename, extname } from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"
import { globby } from "globby"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const assetsDir = join(repoRoot, "content", "assets")
const contentDir = join(repoRoot, "content")

const QUALITY = 82
const MIN_SIZE_BYTES = 0

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

async function unlinkWithRetry(path) {
  const delays = [100, 300, 800, 2000]
  for (let i = 0; i <= delays.length; i++) {
    try {
      await unlink(path)
      return true
    } catch (err) {
      if (err.code !== "EPERM" && err.code !== "EBUSY") throw err
      if (i === delays.length) {
        console.warn(`  ⚠ could not delete ${basename(path)} (${err.code}) — leaving in place`)
        return false
      }
      await new Promise((r) => setTimeout(r, delays[i]))
    }
  }
  return false
}

async function resolveDstPath(base, createdInThisRun) {
  const primary = join(assetsDir, `${base}.webp`)
  if (!(await fileExists(primary))) return { dstPath: primary, collided: false }
  if (!createdInThisRun.has(primary)) return { dstPath: primary, collided: false, preExisting: true }
  let n = 2
  while (true) {
    const candidate = join(assetsDir, `${base}-${n}.webp`)
    if (!(await fileExists(candidate)) && !createdInThisRun.has(candidate)) {
      return { dstPath: candidate, collided: true }
    }
    n++
  }
}

async function convertOne(srcPath, createdInThisRun) {
  const ext = extname(srcPath).toLowerCase()
  const base = basename(srcPath, extname(srcPath))
  const srcStat = await stat(srcPath)

  const { dstPath, preExisting } = await resolveDstPath(base, createdInThisRun)
  if (preExisting) {
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
    await unlinkWithRetry(dstPath)
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

async function convertAll(sources) {
  const createdInThisRun = new Set()
  const results = []
  for (const src of sources) {
    const r = await convertOne(src, createdInThisRun)
    if (r.status === "converted" || r.status === "would-convert") {
      createdInThisRun.add(r.dstPath)
    }
    results.push(r)
  }
  return results
}

function buildRenameMap(results) {
  const renameMap = new Map()
  for (const r of results) {
    if (r.status === "converted" || r.status === "would-convert") {
      renameMap.set(basename(r.srcPath), basename(r.dstPath))
    }
  }
  return renameMap
}

const SKIP_BUCKETS = {
  "skip-exists": "skippedExists",
  "skip-small": "skippedSmall",
  "bigger-kept-original": "biggerKept",
  "convert-failed": "failures",
}

async function processConverted(r, totals) {
  totals.convertedCount++
  totals.totalSrc += r.srcSize
  if (r.dstSize != null) totals.totalDst += r.dstSize
  if (r.status === "converted" && (await unlinkWithRetry(r.srcPath))) {
    totals.deletedCount++
  }
}

async function tallyAndCleanup(results) {
  const totals = { totalSrc: 0, totalDst: 0, convertedCount: 0, deletedCount: 0 }
  const buckets = { skippedExists: [], skippedSmall: [], failures: [], biggerKept: [] }
  for (const r of results) {
    if (r.status === "converted" || r.status === "would-convert") {
      await processConverted(r, totals)
    } else {
      const bucket = SKIP_BUCKETS[r.status]
      if (bucket) buckets[bucket].push(r)
    }
  }
  return { totals, buckets }
}

function sumRefs(refCountsPerFile) {
  let total = 0
  for (const n of refCountsPerFile.values()) total += n
  return total
}

function printReport({ totals, buckets, refCountsPerFile }) {
  console.log(`Converted: ${totals.convertedCount}  (originals deleted: ${totals.deletedCount})`)
  console.log(`Skipped (webp already existed): ${buckets.skippedExists.length}`)
  if (MIN_SIZE_BYTES > 0) {
    console.log(`Skipped (< ${fmtBytes(MIN_SIZE_BYTES)}): ${buckets.skippedSmall.length}`)
  }
  console.log(`WebP came out larger, original kept: ${buckets.biggerKept.length}`)
  console.log(`Conversion failures: ${buckets.failures.length}`)
  console.log()
  console.log(`Markdown files updated: ${refCountsPerFile.size}`)
  console.log(`Total wiki-image references rewritten: ${sumRefs(refCountsPerFile)}`)
  console.log()

  if (buckets.failures.length) {
    console.log("--- failures ---")
    for (const f of buckets.failures) console.log(`  ${basename(f.srcPath)}: ${f.error}`)
    console.log()
  }
  if (buckets.biggerKept.length) {
    console.log("--- WebP was bigger, kept original ---")
    for (const b of buckets.biggerKept) {
      console.log(`  ${basename(b.srcPath)}: src=${fmtBytes(b.srcSize)} dst=${fmtBytes(b.dstSize)}`)
    }
    console.log()
  }

  if (dryRun) {
    console.log(`Total bytes (originals of would-convert): ${fmtBytes(totals.totalSrc)}`)
    console.log("Re-run without --dry-run to apply.")
  } else if (totals.totalSrc === 0) {
    console.log("Nothing converted this run.")
  } else {
    console.log(`Total bytes (originals of converted): ${fmtBytes(totals.totalSrc)}`)
    console.log(`Total bytes (new webp):              ${fmtBytes(totals.totalDst)}`)
    const pct = ((1 - totals.totalDst / totals.totalSrc) * 100).toFixed(1)
    console.log(`Saved:                               ${fmtBytes(totals.totalSrc - totals.totalDst)}  (${pct}%)`)
  }
}

async function main() {
  const sources = await globby("*.{png,PNG,jpg,JPG,jpeg,JPEG,gif,GIF}", { cwd: assetsDir, absolute: true })
  console.log(`Found ${sources.length} candidate image(s) in content/assets/`)
  console.log(`Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE"}`)
  console.log()

  const results = await convertAll(sources)
  const renameMap = buildRenameMap(results)
  const refCountsPerFile = await rewriteReferences(renameMap)
  const { totals, buckets } = await tallyAndCleanup(results)
  printReport({ totals, buckets, refCountsPerFile })
}

try {
  await main()
} catch (err) {
  console.error(err)
  process.exit(1)
}
