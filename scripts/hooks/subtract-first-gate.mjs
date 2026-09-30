#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"

const CODE_EXTENSIONS = new Set([
  ".js",
  ".cjs",
  ".mjs",
  ".jsx",
  ".ts",
  ".cts",
  ".mts",
  ".tsx",
  ".py",
  ".sh",
  ".ps1",
  ".cs",
  ".java",
  ".kt",
  ".go",
  ".rs",
  ".vue",
  ".svelte",
])
const IGNORED_SEGMENTS = [
  "/node_modules/",
  "/.yalc/",
  "/generated/",
  "/.claude/",
  "/dist/",
  "/out/",
  "/.vite/",
]
const DECLARATION =
  /\b(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|class\s+([A-Za-z_$][\w$]*)|interface\s+([A-Za-z_$][\w$]*)|type\s+([A-Za-z_$][\w$]*)\s*[=<]|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)\s*(?::[^=]+)?=>|[A-Za-z_$][\w$]*\s*=>|function\b)|def\s+([A-Za-z_]\w*))/g
const JSON_KEY = /"([^"]+)"\s*:/g

function isCodePath(filePath) {
  if (!filePath) return false
  const normalized = filePath.replace(/\\/g, "/")
  if (IGNORED_SEGMENTS.some((segment) => normalized.includes(segment))) return false
  return (
    path.basename(normalized) === "package.json" || CODE_EXTENSIONS.has(path.extname(normalized))
  )
}

function namesIn(text, pattern) {
  const names = new Set()
  for (const match of (text || "").matchAll(pattern)) {
    const name = match.slice(1).find(Boolean)
    if (name) names.add(name)
  }
  return names
}

function addedNames(before, after, pattern) {
  const existing = namesIn(before, pattern)
  return [...namesIn(after, pattern)].filter((name) => !existing.has(name))
}

function editPairs(toolName, input) {
  if (toolName === "MultiEdit")
    return (input.edits || []).map((edit) => [edit.old_string, edit.new_string])
  if (toolName === "Edit") return [[input.old_string, input.new_string]]
  if (toolName === "NotebookEdit") return [["", input.new_source]]
  return []
}

function describeAddition(toolName, input) {
  const filePath = input.file_path || input.notebook_path
  if (!isCodePath(filePath)) return null
  const pattern = path.basename(filePath) === "package.json" ? JSON_KEY : DECLARATION

  if (toolName === "Write") {
    if (!fs.existsSync(filePath)) return `new file ${filePath}`
    const names = addedNames(fs.readFileSync(filePath, "utf8"), input.content, pattern)
    return names.length ? `${names.join(", ")} in ${filePath}` : null
  }

  const names = editPairs(toolName, input).flatMap(([before, after]) =>
    addedNames(before, after, pattern),
  )
  return names.length ? `${[...new Set(names)].join(", ")} in ${filePath}` : null
}

function redirectTargets(command) {
  const redirects = [...command.matchAll(/(?<![0-9&>])>>?\s*(["']?)([^\s|&;<>"']+)\1/g)].map(
    (match) => match[2],
  )
  const tees = [...command.matchAll(/\btee\s+((?:-\S+\s+)*)(["']?)([^\s|&;<>"']+)\2/g)].map(
    (match) => match[3],
  )
  return [...redirects, ...tees]
}

function installedPackages(command) {
  const installs = command.matchAll(
    /\b(?:npm\s+(?:i|install|add)|yarn\s+add|pnpm\s+(?:i|install|add)|bun\s+add|yalc\s+add|pip3?\s+install)\b([^|&;]*)/g,
  )
  return [...installs].flatMap((match) =>
    match[1]
      .trim()
      .split(/\s+/)
      .filter((token) => token && !token.startsWith("-")),
  )
}

function describeBashAddition(command, cwd) {
  if (!command) return null
  const newFiles = redirectTargets(command)
    .map((target) => path.resolve(cwd || process.cwd(), target))
    .filter((target) => isCodePath(target) && !fs.existsSync(target))
  const packages = installedPackages(command)
  const parts = [
    ...newFiles.map((file) => `new file ${file}`),
    ...(packages.length ? [`dependency ${packages.join(", ")}`] : []),
  ]
  return parts.length ? parts.join("; ") : null
}

function isUserPrompt(entry) {
  if (entry.type !== "user" || entry.isMeta) return false
  const content = entry.message?.content
  if (typeof content === "string") return true
  return Array.isArray(content) && content.some((part) => part.type === "text")
}

function ranSubtractFirst(entry) {
  const content = entry.type === "assistant" && entry.message?.content
  return (
    Array.isArray(content) &&
    content.some(
      (part) =>
        part.type === "tool_use" &&
        part.name === "Skill" &&
        /(^|:)subtract-first$/.test(part.input?.skill),
    )
  )
}

function ranSinceLastPrompt(transcriptPath) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return false
  const lines = fs.readFileSync(transcriptPath, "utf8").split("\n")
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (!lines[index]) continue
    let entry
    try {
      entry = JSON.parse(lines[index])
    } catch {
      continue
    }
    if (ranSubtractFirst(entry)) return true
    if (isUserPrompt(entry)) return false
  }
  return false
}

function ownTranscript(payload) {
  if (!payload.agent_id || !payload.transcript_path) return payload.transcript_path
  const sessionDir = path.join(
    path.dirname(payload.transcript_path),
    path.basename(payload.transcript_path, ".jsonl"),
  )
  return path.join(sessionDir, "subagents", `agent-${payload.agent_id}.jsonl`)
}

function main() {
  const payload = JSON.parse(fs.readFileSync(0, "utf8"))
  const input = payload.tool_input || {}
  const addition =
    payload.tool_name === "Bash"
      ? describeBashAddition(input.command, payload.cwd)
      : describeAddition(payload.tool_name, input)
  if (!addition || ranSinceLastPrompt(ownTranscript(payload))) return
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        additionalContext: `This edit adds ${addition}. Invoke the subtract-first skill and post its four lines before writing new named code; skip only if the skill's own "skip entirely" rule applies.`,
      },
    }),
  )
}

try {
  main()
} catch {
  process.exit(0)
}
