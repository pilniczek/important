#!/usr/bin/env node
/**
 * Bootstrap a machine's global Claude Code configuration.
 *
 * Apply-only and idempotent: every step either creates what is missing or reports
 * that it is already in place. Nothing is deleted and no existing value is
 * overwritten, so a second run is a no-op.
 *
 * Scope is deliberately limited to Claude Code itself - everything under
 * ~/.claude plus the AGENTS.md wiring. Editor, git and toolchain setup are
 * manual steps; see content/claude-code-environment.md for that checklist.
 *
 * Usage:
 *   node scripts/claude-env.mjs
 *   node scripts/claude-env.mjs --win-user=<name>   (WSL, if auto-detection fails)
 *   node scripts/claude-env.mjs --skip-skills
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HOME = os.homedir()
const CLAUDE_DIR = path.join(HOME, ".claude")
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const MANIFEST = path.join(SCRIPT_DIR, "claude-env.skills.json")

const args = process.argv.slice(2)
const flag = (name) =>
  args
    .find((a) => a.startsWith(`--${name}=`))
    ?.split("=")
    .slice(1)
    .join("=")
const has = (name) => args.includes(`--${name}`)

/** The Claude Code settings keys this script owns. Paths are filled in per platform. */
const SETTINGS_KEYS = { outputStyle: "caveman", theme: "light-ansi", tui: "fullscreen" }

/** Relative to the Windows user profile, on both OSes. */
const STATUSLINE_REL = ["Documents", "Claude", "Projects", "claude-statusline", "statusline.js"]

const CLAUDE_MD = `Global agent preferences live in AGENTS.md (single source of truth). Do not edit this pointer; edit AGENTS.md.

@../AGENTS.md
`

const OUTPUT_STYLE = `---
name: caveman
description: Ultra-compressed output. Full technical accuracy, no filler.
keep-coding-instructions: true
---

Respond terse like smart caveman. All technical substance stay. Only fluff die.

## Persistence

ACTIVE EVERY RESPONSE. No revert after many turns. Off only: "stop caveman" / "normal mode".

## Rules

Drop: articles, filler, pleasantries, hedging. Fragments OK. Short synonyms. No tool-call
narration, no decorative tables or emoji. Technical terms exact. Code blocks unchanged.
Errors quoted exact.

Never drop not / never / no / only / except. Numbers and units exact.

## Language

Reply in the language the user writes. Compress the style, not the language. Keep technical
terms, code, API names, CLI commands and exact error strings verbatim.

## No self-reference

Never name or announce the style.

## Auto-Clarity

Drop the compression for security warnings, irreversible-action confirmations, multi-step
sequences where fragment order could be misread, and anywhere compression itself creates
ambiguity. Resume afterwards.

## Boundaries

Anything persisted outside the chat - code, comments, commit messages, docs, PR text, memory
files, messages to third parties - is written in normal prose.

## Levels

Intensity levels (lite / full / ultra / wenyan-*) and their examples live in
~/.claude/skills/caveman/SKILL.md, read on demand. Default is full.
`

const log = {
  done: (m) => console.log(`  created  ${m}`),
  keep: (m) => console.log(`  already  ${m}`),
  warn: (m) => console.log(`  SKIPPED  ${m}`),
  step: (m) => console.log(`\n${m}`),
}

const isWindows = process.platform === "win32"
const isWsl =
  process.platform === "linux" &&
  fs.existsSync("/proc/version") &&
  /microsoft/i.test(fs.readFileSync("/proc/version", "utf8"))

/**
 * The canonical AGENTS.md lives on the Windows side so both OSes can share one file.
 * On WSL we need the Windows user name to reach it; try the flag, then look for the
 * single /mnt/c/Users/<name> that already has an AGENTS.md.
 */
function findWindowsProfile() {
  const explicit = flag("win-user")
  if (explicit) return `/mnt/c/Users/${explicit}`
  if (!fs.existsSync("/mnt/c/Users")) return null
  const candidates = fs
    .readdirSync("/mnt/c/Users", { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => `/mnt/c/Users/${e.name}`)
    .filter((dir) => fs.existsSync(path.join(dir, "AGENTS.md")))
  return candidates.length === 1 ? candidates[0] : null
}

function writeIfMissing(file, contents) {
  if (fs.existsSync(file)) return log.keep(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents, "utf8")
  log.done(file)
}

/** AGENTS.md: a real file on Windows, a symlink to it from WSL, a plain file elsewhere. */
function wireAgentsMd() {
  log.step("AGENTS.md wiring")
  const target = path.join(HOME, "AGENTS.md")

  if (isWindows || !isWsl) {
    if (fs.existsSync(target)) return log.keep(target)
    log.warn(`${target} absent - create it by hand, it is the canonical preferences file`)
    return
  }

  const profile = findWindowsProfile()
  if (!profile) {
    log.warn("cannot locate the Windows profile holding AGENTS.md - pass --win-user=<name>")
    return
  }
  const source = path.join(profile, "AGENTS.md")
  if (!fs.existsSync(source))
    return log.warn(`${source} absent - create it on the Windows side first`)

  let current = null
  try {
    current = fs.readlinkSync(target)
  } catch {
    /* not a symlink, or absent */
  }
  if (current === source) return log.keep(`${target} -> ${source}`)
  if (fs.existsSync(target)) {
    return log.warn(`${target} exists and is not the expected symlink - resolve by hand`)
  }
  fs.symlinkSync(source, target)
  log.done(`${target} -> ${source}`)
}

function wirePointerAndStyle() {
  log.step("Claude Code files")
  writeIfMissing(path.join(CLAUDE_DIR, "CLAUDE.md"), CLAUDE_MD)
  writeIfMissing(path.join(CLAUDE_DIR, "output-styles", "caveman.md"), OUTPUT_STYLE)
}

/**
 * Adds only the keys that are absent. An existing settings.json is re-serialised with
 * two-space indentation, which is what Claude Code itself writes - but a long-lived file
 * carries hundreds of accumulated permissions.allow entries, so review the diff.
 */
function wireSettings() {
  log.step("settings.json keys")
  const file = path.join(CLAUDE_DIR, "settings.json")
  const settings = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {}

  const wanted = { ...SETTINGS_KEYS }
  const statusline = statuslineCommand()
  if (statusline) wanted.statusLine = { type: "command", command: statusline }
  else log.warn("statusline.js not found - statusLine key left alone")

  let changed = false
  for (const [key, value] of Object.entries(wanted)) {
    if (settings[key] !== undefined) {
      log.keep(`${key} = ${JSON.stringify(settings[key])}`)
      continue
    }
    settings[key] = value
    changed = true
    log.done(`${key} = ${JSON.stringify(value)}`)
  }
  if (!changed) return
  fs.mkdirSync(CLAUDE_DIR, { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`, "utf8")
}

function statuslineCommand() {
  if (isWindows) {
    const script = path.join(HOME, ...STATUSLINE_REL)
    return fs.existsSync(script) ? `node ${script}` : null
  }
  const profile = findWindowsProfile()
  if (!profile) return null
  const script = path.posix.join(profile, ...STATUSLINE_REL)
  return fs.existsSync(script) ? `node ${script}` : null
}

/** Installs the pinned global skills. Needs the skills CLI, which has its own engine floor. */
function installSkills() {
  log.step("global skills")
  if (has("skip-skills")) return log.warn("--skip-skills")
  if (!fs.existsSync(MANIFEST)) return log.warn(`${MANIFEST} absent`)

  const [major, minor] = process.versions.node.split(".").map(Number)
  if (major < 22 || (major === 22 && minor < 20)) {
    return log.warn(
      `skills CLI needs node >= 22.20.0, this is ${process.versions.node} - install the skills by hand or upgrade node`,
    )
  }

  const { global: skills } = JSON.parse(fs.readFileSync(MANIFEST, "utf8"))
  const installed = new Set(
    fs.existsSync(path.join(CLAUDE_DIR, "skills"))
      ? fs
          .readdirSync(path.join(CLAUDE_DIR, "skills"), { withFileTypes: true })
          .filter((e) => e.isDirectory())
          .map((e) => e.name)
      : [],
  )

  for (const { skill, repo } of skills) {
    if (installed.has(skill)) {
      log.keep(skill)
      continue
    }
    try {
      execFileSync(
        "npx",
        ["-y", "skills", "add", repo, "--skill", skill, "-g", "-a", "claude-code", "-y"],
        {
          stdio: "inherit",
        },
      )
      log.done(`${skill} (${repo})`)
    } catch {
      log.warn(`${skill} (${repo}) - install failed, run the command by hand to see why`)
    }
  }
}

console.log(
  `Claude Code environment bootstrap - ${isWindows ? "Windows" : isWsl ? "WSL" : "Linux"}`,
)
wireAgentsMd()
wirePointerAndStyle()
wireSettings()
installSkills()
console.log(
  "\nDone. Permission rules are deliberately not written by this script; see content/claude-code-permissions.md.",
)
