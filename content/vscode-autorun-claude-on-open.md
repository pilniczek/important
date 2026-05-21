---
title: "VSCode: Run tools when workspace opened"
tags:
  - IDE
  - AI
  - Claude
  - GIT
type: How To
section: Main
releaseDate: 2026-06-12
---

Open any workspace folder in VSCode and a few tools fire automatically — your terminal with `claude` running, a repo freshen, and the Git Graph view — wired up once in global settings rather than per-project `.vscode/` files. It works for both native Windows and WSL Remote projects.

## What you get

- **Windows project**: Windows Terminal opens at the workspace folder and runs `cmd /k claude`. The `git sync` then runs in the integrated terminal.
- **WSL Remote project**: Windows Terminal opens a WSL session at the workspace folder, runs `claude`, then runs `git sync`.
- **Git repo (either platform)** - the Git Graph view auto-opens in the editor area.
- **VSCode opened with no folder** - nothing fires.

## Required extensions

- `gabrielgrinberg.auto-run-command` - runs a VSCode command on folder open.
- `fabiospampinato.vscode-terminals` (Terminals Manager) - defines reusable terminals in settings and exposes the `terminals.runTerminals` command.
- `mhutchie.git-graph` - provides the `git-graph.view` command opened by the first rule.

Install all three in **each** scope you use: locally on Windows **and** inside WSL Remote (open the extension page while connected to WSL → click "Install in WSL: &lt;distro&gt;").

## Windows user `settings.json`

Open via `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)".

```jsonc
{
  "workbench.startupEditor": "none", // skip Welcome tab so Git Graph is the startup view
  "window.restoreWindows": "all",
  "auto-run-command.rules": [
    {
      "condition": "hasFile: .git/HEAD", // only in a git repo; needs files.exclude -> "**/.git": false
      "command": "git-graph.view",
    },
    {
      "condition": "hasFile: **/*",
      "command": "terminals.runTerminals",
    },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "cmd",
      "cwd": "${workspaceFolder}",
      "commands": [
        "start \"\" wt.exe -d \"${workspaceFolder}\" cmd /k claude",
        "git sync",
      ],
      "autorun": true,
      "focus": true,
    },
  ],
}
```

## Remote-WSL `settings.json`

With a WSL Remote project open, `Ctrl+,` → click the **Remote &#91;WSL: &lt;distro&gt;&#93;** tab → open the JSON (the `{}` icon top-right).

Replace `<your-windows-user>` with your Windows username:

```jsonc
{
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "Claude",
      "cwd": "${workspaceFolder}",
      "commands": [
        "/mnt/c/Users/<your-windows-user>/AppData/Local/Microsoft/WindowsApps/wt.exe new-tab wsl.exe --cd ${workspaceFolder} -- bash -ic \"claude\\; exec bash\" ; git sync"
      ],
      "autorun": true,
      "focus": true
    }
  ]
}
```

## How it works

Terminals Manager *almost* does this alone - it has an `autorun` flag - but that autorun only reads terminals defined in a per-workspace `.vscode/terminals.json`, **not** globally-defined ones in user settings. The workaround is `auto-run-command`: on folder open it dispatches the `terminals.runTerminals` command, which — unlike the `autorun` flag — does honour the global config. A second rule in the same `auto-run-command.rules` array opens the Git Graph view. So the full chain is:

1. You open a workspace folder → `auto-run-command` fires its rules: `git-graph.view` (gated by `hasFile: .git/HEAD`, so only inside a git repo) and `terminals.runTerminals` (gated by `hasFile: **/*`, so nothing fires without a folder).
2. VSCode routes the dispatched command to wherever Terminals Manager is installed - the local scope for Windows projects, the WSL scope for WSL projects. The `auto-run-command` rule itself lives **only** in the Windows user settings and fires from the host; it is not duplicated in the WSL settings.
3. Terminals Manager reads the merged config and runs every defined terminal.
4. The terminal entry runs its shell command in an integrated terminal - `start "" wt.exe …` (Windows) or `wt.exe new-tab wsl.exe …` (WSL) - then `git sync`.
5. Windows Terminal spawns detached, so the launching integrated terminal is free to close.

**The Windows command line.** `start "" wt.exe -d "${workspaceFolder}" cmd /k claude` detaches a Windows Terminal at the workspace folder running `claude` (`cmd /k` keeps the shell open after `claude` exits). `start ""` detaches the process so the launching shell returns immediately; the empty `""` is the window-title argument `start` requires. `cwd: ${workspaceFolder}` points the integrated terminal at the workspace folder so the following `git sync` acts on the right repo.

**The WSL command line.** The path to `wt.exe` is absolute, via the `/mnt/c/...` mount - WSL's auto-appended Windows PATH isn't reliable for non-interactive shells. `wsl.exe --cd ${workspaceFolder}` uses the Linux path directly; no `wslpath` translation needed. `\\;` is JSON-escaped `\;` - `wt.exe` reserves `;` as a command-chain delimiter (it would open a second tab), so the semicolon between `claude` and `exec bash` must be escaped to pass through as a literal. `bash -ic "claude; exec bash"` runs claude under interactive bash (`-i` sources `~/.bashrc` so `claude` is on PATH), then `exec bash` replaces the shell so you stay interactive after.

**Git Graph on startup.** For the `git-graph.view` rule to match, the `.git` folder must be visible to the glob - set `"**/.git": false` in `files.exclude` (see [[vscode-settings|VSCode Settings]]). `workbench.startupEditor: "none"` + `window.restoreWindows: "all"` then keep the Welcome tab from covering the auto-opened view.

**`git sync`.** A clean-tree-only branch update: switch to the default branch, pull, prune, then clean up merged branches, skipped when there's work in progress. The logic lives in the alias - defined in `.gitconfig` (see [[configuration-example|Configuration Example]] and [[git-sync|Sync the default branch]]). On Windows it is a second entry in the `commands` array; on WSL it is joined onto the launch line as a trailing `; git sync` instead.

**Why one command on WSL, two on Windows.** Terminals Manager *types* the commands into the integrated terminal a fixed ~200 ms after it opens. `cmd` is ready by then, so two separate `commands` lines both land. But WSL `bash -i` is still sourcing `~/.bashrc` at 200 ms, and a second line (`git sync`) typed ~1.5 s later - *while the launch is still running* - gets swallowed. Collapsing both onto one line makes bash buffer and run the whole thing once it's ready, so `git sync` reliably fires.
