// One-time codemod: split the `Archived` / `Utilities` lifecycle markers out of
// the `type:` list into a dedicated required `section:` field.
//
//   type: [Tool, Archived]   →   type: [Tool]      + section: archived
//   type: [How To, Utilities] →  type: [How To]    + section: utilities
//   (no marker)               →  (unchanged type)  + section: main
//
// Edits the YAML textually (no full reserialize) to preserve formatting/comments,
// inserting `section:` immediately after the `type:` block. Idempotent: files that
// already carry a `section:` line are only stripped of stray markers, not duplicated.
//
// Per repo rule this does NOT touch git — review and commit the result yourself.

import { readFile, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { globby } from "globby"

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url))
const CONTENT_DIR = join(REPO_ROOT, "content")

const MARKERS = ["archived", "utilities"]
const isMarker = (v) => MARKERS.includes(String(v).trim().toLowerCase())
const markerSection = (v) => String(v).trim().toLowerCase()

const FM_DELIM = "---"

/** Split a file into [frontmatterLines, restText]. Returns null if no leading `---` block. */
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
  return { fm: lines.slice(1, end), rest: lines.slice(end) /* keeps closing --- */ }
}

/** Mutates `fm` in place: strips marker entries from `type:`, returns the detected section. */
function rewriteFrontmatter(fm) {
  let section = "main"

  const typeIdx = fm.findIndex((l) => /^type\s*:/.test(l))
  if (typeIdx === -1) {
    // No type field — append section before the (caller-owned) closing delimiter.
    if (!fm.some((l) => /^section\s*:/.test(l))) fm.push("section: main")
    return "main"
  }

  const inlineMatch = fm[typeIdx].match(/^type\s*:\s*\[(.*)\]\s*$/)
  let insertAt
  if (inlineMatch) {
    // Inline array form: `type: [A, B]`
    const items = inlineMatch[1]
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
    for (const it of items) if (isMarker(it)) section = markerSection(it)
    const kept = items.filter((it) => !isMarker(it))
    fm[typeIdx] = `type: [${kept.join(", ")}]`
    insertAt = typeIdx + 1
  } else if (/^type\s*:\s*\S/.test(fm[typeIdx])) {
    // Inline scalar form: `type: Tool`
    const val = fm[typeIdx].replace(/^type\s*:\s*/, "").trim()
    if (isMarker(val)) {
      section = markerSection(val)
      fm.splice(typeIdx, 1) // a bare marker leaves no real type
      insertAt = typeIdx
    } else {
      insertAt = typeIdx + 1
    }
  } else {
    // Block list form:
    //   type:
    //     - Tool
    //     - Archived
    let i = typeIdx + 1
    const toDelete = []
    for (; i < fm.length; i++) {
      const m = fm[i].match(/^\s*-\s*(.*\S)\s*$/)
      if (!m) break // first non-list-item line ends the block
      if (isMarker(m[1])) {
        section = markerSection(m[1])
        toDelete.push(i)
      }
    }
    insertAt = i // line after the block
    for (let d = toDelete.length - 1; d >= 0; d--) {
      fm.splice(toDelete[d], 1)
      if (toDelete[d] < insertAt) insertAt--
    }
  }

  if (!fm.some((l) => /^section\s*:/.test(l))) {
    fm.splice(insertAt, 0, `section: ${section}`)
  }
  return section
}

const files = await globby("**/*.md", { cwd: CONTENT_DIR, absolute: true })
const counts = { main: 0, archived: 0, utilities: 0 }
let skipped = 0

for (const path of files) {
  const text = await readFile(path, "utf8")
  const split = splitFrontmatter(text)
  if (!split) {
    skipped++
    continue
  }
  const { fm, rest } = split
  const section = rewriteFrontmatter(fm)
  counts[section]++
  const next = [FM_DELIM, ...fm, ...rest].join("\n")
  if (next !== text) await writeFile(path, next, "utf8")
}

const total = counts.main + counts.archived + counts.utilities
process.stdout.write(
  `Migrated ${total} articles — main: ${counts.main}, archived: ${counts.archived}, utilities: ${counts.utilities}` +
    (skipped ? ` (skipped ${skipped} without frontmatter)` : "") +
    `\n`,
)
if (total !== 218) {
  process.stdout.write(`WARNING: expected 218 articles, processed ${total}\n`)
}
