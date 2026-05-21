import { stat, unlink, rename, access } from "node:fs/promises"
import { spawn } from "node:child_process"
import { join, basename, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { globby } from "globby"

const repoRoot = fileURLToPath(new URL("..", import.meta.url))
const assetsDir = join(repoRoot, "content", "assets")

const CRF = 26
const PRESET = "medium"
const MAX_WIDTH = 1920
const AUDIO_BITRATE = "64k"

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

function run(cmd, args, { inheritStderr = false } = {}) {
  return new Promise((resolve, reject) => {
    const stderrMode = inheritStderr ? "inherit" : "pipe"
    const p = spawn(cmd, args, { stdio: ["ignore", "pipe", stderrMode] })
    let stdout = ""
    let stderr = ""
    p.stdout.on("data", (d) => (stdout += d))
    if (!inheritStderr) p.stderr.on("data", (d) => (stderr += d))
    p.on("close", (code) =>
      code === 0
        ? resolve({ stdout, stderr })
        : reject(new Error(`${cmd} exited ${code}${stderr ? `: ${stderr.trim()}` : ""}`))
    )
  })
}

async function probe(path) {
  const { stdout } = await run("ffprobe", [
    "-v", "error",
    "-show_entries", "stream=codec_type,codec_name,width,height",
    "-of", "json",
    path,
  ])
  const { streams } = JSON.parse(stdout)
  return {
    video: streams.find((s) => s.codec_type === "video") ?? null,
    audio: streams.find((s) => s.codec_type === "audio") ?? null,
  }
}

function buildArgs(srcPath, tmpPath, { hasAudio, needsScale }) {
  const args = [
    "-y", "-hide_banner", "-loglevel", "warning", "-stats",
    "-i", srcPath,
    "-c:v", "libx264",
    "-preset", PRESET,
    "-crf", String(CRF),
    "-pix_fmt", "yuv420p",
  ]
  if (needsScale) args.push("-vf", `scale='min(${MAX_WIDTH},iw)':-2:flags=lanczos`)
  if (hasAudio) args.push("-c:a", "aac", "-b:a", AUDIO_BITRATE, "-ac", "1")
  else args.push("-an")
  args.push("-movflags", "+faststart", tmpPath)
  return args
}

async function reencode(srcPath) {
  const { video, audio } = await probe(srcPath)
  if (!video) return { status: "no-video", srcPath }

  const srcSize = (await stat(srcPath)).size
  const tmpPath = join(dirname(srcPath), `.${basename(srcPath)}.tmp.mp4`)
  const needsScale = video.width > MAX_WIDTH
  const hasAudio = Boolean(audio)
  const args = buildArgs(srcPath, tmpPath, { hasAudio, needsScale })

  if (dryRun) {
    return {
      status: "would-encode",
      srcPath, srcSize,
      info: { width: video.width, height: video.height, hasAudio, needsScale },
      cmd: ["ffmpeg", ...args.map((a) => (/\s/.test(a) ? `"${a}"` : a))].join(" "),
    }
  }

  console.log(`\n→ ${basename(srcPath)}  (src ${fmtBytes(srcSize)}, ${video.width}x${video.height}${hasAudio ? ", +audio" : ""}${needsScale ? ", will scale to ≤1080p" : ""})`)
  try {
    await run("ffmpeg", args, { inheritStderr: true })
  } catch (err) {
    if (await fileExists(tmpPath)) await unlink(tmpPath)
    return { status: "encode-failed", srcPath, srcSize, error: err.message }
  }

  const dstSize = (await stat(tmpPath)).size
  if (dstSize >= srcSize) {
    await unlink(tmpPath)
    return { status: "bigger-kept-original", srcPath, srcSize, dstSize }
  }

  await unlink(srcPath)
  await rename(tmpPath, srcPath)
  return { status: "encoded", srcPath, srcSize, dstSize }
}

async function main() {
  const sources = await globby("*.mp4", { cwd: assetsDir, absolute: true, caseSensitiveMatch: false })
  sources.sort((a, b) => a.localeCompare(b))

  console.log(`Found ${sources.length} mp4(s) in content/assets/`)
  console.log(`Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE"}`)
  console.log(`Settings: libx264 preset=${PRESET} CRF=${CRF}, max width=${MAX_WIDTH}px, audio→aac ${AUDIO_BITRATE} mono`)

  const results = []
  for (const src of sources) {
    results.push(await reencode(src))
  }

  console.log("\n=== Summary ===")
  let totalSrc = 0
  let totalDst = 0
  let okCount = 0
  let keptCount = 0
  let failCount = 0

  for (const r of results) {
    const name = basename(r.srcPath)
    if (r.status === "encoded") {
      okCount++
      totalSrc += r.srcSize
      totalDst += r.dstSize
      const pct = ((1 - r.dstSize / r.srcSize) * 100).toFixed(1)
      console.log(`  OK    ${name}  ${fmtBytes(r.srcSize)} → ${fmtBytes(r.dstSize)}  (${pct}% smaller)`)
    } else if (r.status === "bigger-kept-original") {
      keptCount++
      console.log(`  KEEP  ${name}  re-encode was bigger (${fmtBytes(r.dstSize)} ≥ ${fmtBytes(r.srcSize)}), original kept`)
    } else if (r.status === "encode-failed") {
      failCount++
      console.log(`  FAIL  ${name}  ${r.error}`)
    } else if (r.status === "would-encode") {
      console.log(`  WOULD ${name}  (${fmtBytes(r.srcSize)}, ${r.info.width}x${r.info.height}${r.info.hasAudio ? ", +audio" : ""}${r.info.needsScale ? ", scale→1080p" : ""})`)
      console.log(`        ${r.cmd}`)
    }
  }

  console.log()
  if (!dryRun) {
    console.log(`Encoded: ${okCount}   Kept original: ${keptCount}   Failed: ${failCount}`)
    if (okCount > 0) {
      console.log(`Total bytes (originals of encoded): ${fmtBytes(totalSrc)}`)
      console.log(`Total bytes (new mp4s):             ${fmtBytes(totalDst)}`)
      console.log(`Saved:                              ${fmtBytes(totalSrc - totalDst)}  (${((1 - totalDst / totalSrc) * 100).toFixed(1)}%)`)
    }
  } else {
    console.log("Re-run without --dry-run to apply.")
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
