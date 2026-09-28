#!/usr/bin/env node
/**
 * Bootstrap a machine's global Claude Code configuration.
 *
 * Apply-only and idempotent: every step either creates what is missing or reports
 * that it is already in place. Nothing is deleted and no existing value is
 * overwritten, so a second run is a no-op.
 *
 * Scope is deliberately limited to Claude Code itself - everything under ~/.claude,
 * plus the AGENTS.md wiring and the skills CLI's ~/.agents store. Editor, git and
 * toolchain setup are manual steps; see content/claude-code-environment.md.
 *
 * Usage:
 *   node scripts/claude-env.mjs
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
const has = (name) => args.includes(`--${name}`)

const SETTINGS_KEYS = { theme: "light-ansi", tui: "fullscreen" }

const STATUSLINE_REL = [".claude", "statusline", "statusline.js"]

const CLAUDE_MD = `Global agent preferences live in AGENTS.md (single source of truth). Do not edit this pointer; edit AGENTS.md.

@../AGENTS.md
`

const CAVEMAN_HOOKS_REL = [".claude", "caveman", "src", "hooks"]
const CAVEMAN_HOOKS = [
  {
    event: "SessionStart",
    script: "caveman-activate.js",
    statusMessage: "Loading caveman mode...",
  },
  {
    event: "UserPromptSubmit",
    script: "caveman-mode-tracker.js",
    statusMessage: "Tracking caveman mode...",
  },
]

const DIRS = [
  { rel: [".claude", "skills"], create: true },
  { rel: [".agents"], create: true },
  {
    rel: [".claude", "statusline"],
    create: false,
    hint: "clone pilniczek/claude-statusline there",
  },
  {
    rel: [".claude", "caveman"],
    create: false,
    hint: "clone JuliusBrussee/caveman there",
  },
]

const log = {
  done: (m) => console.log(`  created  ${m}`),
  keep: (m) => console.log(`  already  ${m}`),
  warn: (m) => console.log(`  SKIPPED  ${m}`),
  step: (m) => console.log(`\n${m}`),
}

function writeIfMissing(file, contents) {
  if (fs.existsSync(file)) return log.keep(file)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, contents, "utf8")
  log.done(file)
}

function checkAgentsMd() {
  log.step("AGENTS.md")
  const file = path.join(HOME, "AGENTS.md")
  if (fs.existsSync(file)) return log.keep(file)
  log.warn(`${file} absent - create it by hand, it is the canonical preferences file`)
}

function wirePointer() {
  log.step("Claude Code files")
  writeIfMissing(path.join(CLAUDE_DIR, "CLAUDE.md"), CLAUDE_MD)
}

function wireCavemanHooks() {
  log.step("caveman hooks")
  const hooksDir = path.join(HOME, ...CAVEMAN_HOOKS_REL)
  if (!fs.existsSync(hooksDir))
    return log.warn(`${hooksDir} absent - clone JuliusBrussee/caveman into ~/.claude/caveman`)

  const file = path.join(CLAUDE_DIR, "settings.json")
  const settings = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {}
  settings.hooks ??= {}

  let changed = false
  for (const { event, script, statusMessage } of CAVEMAN_HOOKS) {
    const entries = (settings.hooks[event] ??= [])
    if (entries.some((g) => g.hooks?.some((h) => h.command?.includes(script)))) {
      log.keep(`${event} -> ${script}`)
      continue
    }
    entries.push({
      hooks: [
        {
          type: "command",
          command: `"node" "${path.join(hooksDir, script)}"`,
          timeout: 5,
          statusMessage,
        },
      ],
    })
    changed = true
    log.done(`${event} -> ${script}`)
  }
  if (changed) fs.writeFileSync(file, `${JSON.stringify(settings, null, 2)}\n`, "utf8")
}

function ensureDirs() {
  log.step("directories")
  for (const { rel, create, hint } of DIRS) {
    const dir = path.join(HOME, ...rel)
    if (fs.existsSync(dir)) {
      log.keep(dir)
      continue
    }
    if (!create) {
      log.warn(`${dir} absent - ${hint}`)
      continue
    }
    fs.mkdirSync(dir, { recursive: true })
    log.done(dir)
  }
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
  const script = path.join(HOME, ...STATUSLINE_REL)
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
          // A skill installed by an older CLI is a symlink into ~/.agents/skills rather than
          // a directory - counting only directories would reinstall what is already there.
          .filter((e) => e.isDirectory() || e.isSymbolicLink())
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

console.log("Claude Code environment bootstrap")
checkAgentsMd()
wirePointer()
ensureDirs()
wireSettings()
wireCavemanHooks()
installSkills()
console.log(
  "\nDone. Permission rules are deliberately not written by this script; see content/claude-code-permissions.md.",
)
