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
 * Everything path-free is shared across Windows and WSL by keeping the real file on
 * the Windows side and symlinking to it from WSL: AGENTS.md, the skill directories
 * (~/.claude/skills plus the CLI's ~/.agents store and lock), and the statusline and
 * caveman clones. settings.json is the exception - its contents are path-bearing, so it
 * stays per-OS, which is why the statusLine command and the hook commands are written
 * per platform.
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
const SETTINGS_KEYS = { theme: "light-ansi", tui: "fullscreen" }

/** Relative to the user's own home on either OS, because the directory itself is shared. */
const STATUSLINE_REL = [".claude", "statusline", "statusline.js"]

const CLAUDE_MD = `Global agent preferences live in AGENTS.md (single source of truth). Do not edit this pointer; edit AGENTS.md.

@../AGENTS.md
`

/** Upstream's hook scripts, inside the shared caveman clone. */
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

/**
 * Directories shared across both OSes, relative to a user profile. Skills are shared as a
 * unit - the directory Claude Code reads plus the CLI's own store and lock - so an install
 * from either OS updates one state and `skills list` agrees on both sides. `create` marks
 * the ones this script may bring into being; the statusline is a clone, not a store.
 */
const SHARED_DIRS = [
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

/**
 * Points a WSL path at its Windows counterpart. Anything already sitting at the target
 * that is not the expected symlink is reported rather than replaced, so a real file or
 * directory is never clobbered.
 */
function symlinkIfMissing(target, source) {
  let current = null
  try {
    current = fs.readlinkSync(target)
  } catch {
    /* not a symlink, or absent */
  }
  if (current === source) return log.keep(`${target} -> ${source}`)
  if (current) return log.warn(`${target} -> ${current}, expected ${source} - resolve by hand`)
  if (fs.existsSync(target))
    return log.warn(`${target} exists and is not a symlink - resolve by hand`)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.symlinkSync(source, target)
  log.done(`${target} -> ${source}`)
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

  symlinkIfMissing(target, source)
}

function wirePointer() {
  log.step("Claude Code files")
  writeIfMissing(path.join(CLAUDE_DIR, "CLAUDE.md"), CLAUDE_MD)
}

/**
 * The always-on caveman voice comes from upstream's two hooks, which read the caveman
 * SKILL.md at runtime - so there is no style file to write and no rules to keep in sync.
 * Only the wiring is ours, and it is per-OS because the command carries a path.
 */
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

/**
 * Directories are shared the same way single files are: the real ones live on the Windows
 * side and WSL symlinks to them. This has to run before wireSettings, which looks for the
 * statusline through the link, and before installSkills, or an install would populate the
 * wrong side.
 */
function wireSharedDirs() {
  log.step("shared directories")
  if (isWindows || !isWsl) return log.keep("real directories on this OS")

  const profile = findWindowsProfile()
  if (!profile) {
    log.warn(
      "cannot locate the Windows profile holding the shared directories - pass --win-user=<name>",
    )
    return
  }
  for (const { rel, create, hint } of SHARED_DIRS) {
    const source = path.posix.join(profile, ...rel)
    if (!fs.existsSync(source)) {
      if (!create) {
        log.warn(`${source} absent - ${hint}`)
        continue
      }
      fs.mkdirSync(source, { recursive: true })
    }
    symlinkIfMissing(path.join(HOME, ...rel), source)
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
    // The command goes through a shell because Windows resolves npx to npx.cmd, which
    // execFileSync cannot spawn directly. Only slugs reach the shell.
    if (!/^[\w.\-/]+$/.test(skill) || !/^[\w.\-/]+$/.test(repo)) {
      log.warn(`${skill} (${repo}) - unexpected characters in the manifest entry, not installed`)
      continue
    }
    try {
      execFileSync(`npx -y skills add ${repo} --skill ${skill} -g -a claude-code -y`, {
        stdio: "inherit",
        shell: true,
      })
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
wirePointer()
wireSharedDirs()
wireSettings()
wireCavemanHooks()
installSkills()
console.log(
  "\nDone. Permission rules are deliberately not written by this script; see content/claude-code-permissions.md.",
)
