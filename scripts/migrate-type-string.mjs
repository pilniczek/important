// One-time codemod (follow-up to migrate-section.mjs):
//   1. Capitalize the `section:` value  →  Main | Archived | Utilities
//   2. Collapse the `type:` block list into a single scalar string
//        type:            →   type: How To
//          - How To
//
// Edits the YAML textually to preserve surrounding formatting/comments.
// Idempotent: already-scalar `type` and already-capitalized `section` are left as-is.
// Per repo rule this does NOT touch git — review and commit the result yourself.

import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { globby } from "globby"

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url))
const CONTENT_DIR = join(REPO_ROOT, "content")
const FM_DELIM = "---"

const SECTIONS = ["Main", "Archived", "Utilities"]
const capitalizeSection = (v) =>
  SECTIONS.find((s) => s.toLowerCase() === String(v).trim().toLowerCase()) ?? v

function splitFrontmatter(text) {
  const lines = text.split("\n")
  if (lines[0]?.trim() !== FM_DELIM) return null
  let end = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === FM_DELIM) {
      end = i
      break
    }
  }
  if (end === -1) return null
  return { fm: lines.slice(1, end), rest: lines.slice(end) }
}

/** Mutates `fm` in place. Returns true if anything changed. */
function rewriteFrontmatter(fm) {
  let changed = false

  // 1. section value → capitalized
  const secIdx = fm.findIndex((l) => /^section\s*:/.test(l))
  if (secIdx !== -1) {
    const m = fm[secIdx].match(/^section\s*:\s*(.+?)\s*$/)
    if (m) {
      const next = `section: ${capitalizeSection(m[1])}`
      if (next !== fm[secIdx]) {
        fm[secIdx] = next
        changed = true
      }
    }
  }

  // 2. type block list → scalar
  const typeIdx = fm.findIndex((l) => /^type\s*:/.test(l))
  if (typeIdx !== -1 && /^type\s*:\s*$/.test(fm[typeIdx])) {
    const items = []
    let i = typeIdx + 1
    for (; i < fm.length; i++) {
      const m = fm[i].match(/^\s*-\s*(.*\S)\s*$/)
      if (!m) break
      items.push(m[1].trim())
    }
    if (items.length >= 1) {
      fm.splice(typeIdx, i - typeIdx, `type: ${items[0]}`)
      changed = true
    }
  }

  return changed
}

const files = await globby("**/*.md", { cwd: CONTENT_DIR, absolute: true })
let rewritten = 0
for (const path of files) {
  const text = await readFile(path, "utf8")
  const split = splitFrontmatter(text)
  if (!split) continue
  const { fm, rest } = split
  if (rewriteFrontmatter(fm)) {
    await writeFile(path, [FM_DELIM, ...fm, ...rest].join("\n"), "utf8")
    rewritten++
  }
}
process.stdout.write(`Rewrote ${rewritten} of ${files.length} files\n`)
