---
title: "VSCode: Run tools when workspace opened"
tags:
  - IDE
  - AI
  - Claude
  - GIT
type: How To
section: Main
releaseDate: 2026-09-10
---

Open any workspace folder in VSCode and two things fire automatically - a repo freshen and the Git Graph view - wired up once in global settings rather than per-project `.vscode/` files. A Claude session is _not_ one of them: it opens on demand from a keybinding, because a session started for you in every window is a session you did not ask for.

## What you get

- **Any git repo** - a `git sync` terminal runs in the background and the Git Graph view auto-opens in the editor area.
- **A folder that is not a git repo** - nothing fires. Both rules are gated on `.git/HEAD`.
- **VSCode opened with no folder** - nothing fires.
- **`ctrl+alt+c`** - a Claude session as an editor tab, when you want one.

## Required extensions

- `gabrielgrinberg.auto-run-command` - runs a VSCode command on folder open.
- `fabiospampinato.vscode-terminals` (Terminals Manager) - defines reusable terminals in settings and exposes the `terminals.runTerminals` command.
- `mhutchie.git-graph` - provides the `git-graph.view` command opened by the first rule.

Install all three inside WSL Remote (open the extension page while connected to WSL → click "Install in WSL: &lt;distro&gt;").

## User `settings.json`

Open via `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)".

```jsonc
{
  "workbench.startupEditor": "none", // skip Welcome tab so Git Graph is the startup view
  "window.restoreWindows": "all",
  "terminal.integrated.defaultLocation": "editor", // terminals open as tabs, not in the panel
  "auto-run-command.rules": [
    {
      "condition": "hasFile: .git/HEAD", // only in a git repo; needs files.exclude -> "**/.git": false
      "command": "git-graph.view",
    },
    {
      "condition": "hasFile: .git/HEAD",
      "command": "terminals.runTerminals",
    },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "git sync",
      "cwd": "${workspaceFolder}",
      "commands": ["git sync"],
      "autorun": true,
      "focus": false,
    },
  ],
}
```

## Remote-WSL `settings.json`

With a WSL Remote project open, `Ctrl+,` → click the **Remote &#91;WSL: &lt;distro&gt;&#93;** tab → open the JSON (the `{}` icon top-right).

The `terminals.*` block is the same as above; the `auto-run-command.rules` array is duplicated here so the rules fire when the window is a WSL one:

```jsonc
{
  "auto-run-command.rules": [
    { "condition": "hasFile: .git/HEAD", "command": "git-graph.view" },
    { "condition": "hasFile: .git/HEAD", "command": "terminals.runTerminals" },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "git sync",
      "cwd": "${workspaceFolder}",
      "commands": ["git sync"],
      "autorun": true,
      "focus": false,
    },
  ],
}
```

## Launching Claude on demand

`keybindings.json` (`Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts (JSON)"):

```jsonc
{
  "key": "ctrl+alt+c",
  "command": "runCommands",
  "args": {
    "commands": [
      "workbench.action.createTerminalEditor",
      {
        "command": "workbench.action.terminal.sendSequence",
        "args": { "text": "claude\r" },
      },
    ],
  },
}
```

`runCommands` is built in - it runs a list of commands in order, so one chord can open a terminal and type into it. `workbench.action.createTerminalEditor` is the command behind "Terminal: Create New Terminal in Editor Area", so the session is a full-height tab regardless of the default location. `sendSequence` needs the trailing `\r` to submit the line. No path is needed: on a WSL window the integrated terminal is already a WSL shell with `claude` on `PATH` (see [[claude-code-environment|Claude Code environment]]).

## How it works

Terminals Manager _almost_ does this alone - it has an `autorun` flag - but that autorun only reads terminals defined in a per-workspace `.vscode/terminals.json`, **not** globally-defined ones in user settings. The workaround is `auto-run-command`: on folder open it dispatches the `terminals.runTerminals` command, which — unlike the `autorun` flag — does honour the global config. A second rule in the same `auto-run-command.rules` array opens the Git Graph view. So the full chain is:

1. You open a workspace folder → `auto-run-command` fires its rules: `git-graph.view` and `terminals.runTerminals`, both gated by `hasFile: .git/HEAD`.
2. VSCode routes the dispatched command to the WSL scope, where Terminals Manager is installed.
3. Terminals Manager reads the merged config and runs every defined terminal.
4. The terminal entry types `git sync` into an integrated terminal at `cwd: ${workspaceFolder}`, so the freshen acts on the right repo.

**`.git/HEAD` fires once per checkout.** A linked worktree's `.git` is a file rather than a directory, so the condition matches only in a primary checkout - a worktree window gets neither rule.

**Terminals in the editor area.** `terminal.integrated.defaultLocation: "editor"` is a global default, and the [VSCode terminal docs](https://code.visualstudio.com/docs/terminal/basics) describe it as changing "the default `view` or `editor` area terminal location". With it set, the `git sync` terminal is a tab too - `focus: false` keeps it from stealing the Git Graph view on startup.

**Git Graph on startup.** For the `git-graph.view` rule to match, the `.git` folder must be visible to the glob - set `"**/.git": false` in `files.exclude` (see [[vscode-settings|VSCode Settings]]). `workbench.startupEditor: "none"` + `window.restoreWindows: "all"` then keep the Welcome tab from covering the auto-opened view.

**`git sync`.** A clean-tree-only branch update: switch to the default branch, pull, prune, then clean up merged branches, skipped when there's work in progress. It refuses to run in a linked worktree and exits 1 - but the `.git/HEAD` gate means those windows never start it, see [[git-sync#Main checkout only|Main checkout only]]. The logic lives in the alias - defined in `.gitconfig` (see [[configuration-example|Configuration Example]] and [[git-sync|Sync the default branch]]).

**One command per entry.** Terminals Manager _types_ the commands into the integrated terminal a fixed ~200 ms after it opens, and a second line typed while the first is still running gets swallowed - a WSL `bash -i` is still sourcing `~/.bashrc` at 200 ms. A single-command entry sidesteps the timing entirely; if you need two, join them onto one line with `;` so the shell buffers and runs both once it is ready.

---

Related: [[claude-code-environment|Claude Code environment]] · [[git-sync|Sync the default branch]] · [[vscode-settings|VSCode Settings]] · [[configuration-example|Configuration Example]]
