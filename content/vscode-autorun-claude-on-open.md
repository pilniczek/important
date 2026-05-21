---
title: "VSCode: Autorun Claude on workspace open"
tags:
  - IDE
  - AI
  - Claude
type: How To
section: Main
releaseDate: 2026-05-22
---

Open any workspace in VSCode → Windows Terminal pops up at the project path with `claude` already running. Works for native Windows projects AND WSL Remote projects, configured once globally (no per-project `.vscode/` files).

## What you get

- **Windows project**: WT opens at the workspace folder, runs `cmd /k claude`. cmd stays open after `claude` exits.
- **WSL Remote project**: WT opens with a WSL session at the workspace folder, runs `claude`, drops into interactive bash after.
- **VSCode opens with no folder**: nothing fires.

## Required extensions

- `gabrielgrinberg.auto-run-command` — runs a VSCode command on folder open.
- `fabiospampinato.vscode-terminals` — defines reusable terminals globally in settings; exposes the `terminals.runTerminals` command.

Both must be installed in **each** scope: locally on Windows AND inside WSL Remote (open the extension page while connected to WSL → click "Install in WSL: \<distro\>").

## Why two extensions

Terminals Manager *almost* does this alone — it has an `autorun` flag. But its autorun only reads terminals defined in a per-workspace `.vscode/terminals.json` file, **not** globally-defined ones in user settings. Workaround: use `auto-run-command` to dispatch `terminals.runTerminals` on folder open. That command reads the merged config (global + per-workspace) and runs every defined terminal.

Related: the same `auto-run-command` extension is also used in [[vscode-auto-open-git-graph-on-startup|Auto-open Git Graph on startup]].

## Windows user `settings.json`

Open via `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)".

```jsonc
{
  "auto-run-command.rules": [
    {
      "condition": "hasFile: **/*",
      "command": "terminals.runTerminals"
    }
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "Open Windows Terminal at workspace",
      "command": "start \"\" wt.exe -d \"${workspaceFolder}\" cmd /k claude",
      "autorun": true,
      "focus": false
    }
  ]
}
```

Key bits:

- `hasFile: **/*` gates the rule so nothing fires when VSCode opens without a folder (no workspace files means no glob match).
- `start ""` detaches the WT process so the launching shell exits immediately. The empty `""` is the window-title arg that `start` requires.
- `cmd /k claude` runs `claude` and keeps cmd open afterwards.

## Remote-WSL `settings.json`

With a WSL Remote project open, `Ctrl+,` → click the **Remote [WSL: \<distro\>]** tab → open the JSON (the `{}` icon top-right).

Replace `<your-windows-user>` with your Windows username:

```jsonc
{
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "Open Windows Terminal (WSL)",
      "command": "/mnt/c/Users/<your-windows-user>/AppData/Local/Microsoft/WindowsApps/wt.exe new-tab wsl.exe --cd ${workspaceFolder} -- bash -ic \"claude\\; exec bash\"",
      "autorun": true,
      "focus": false
    }
  ]
}
```

The `auto-run-command` rule is **not duplicated** here — it lives in user settings and fires from the Windows host. VSCode routes the dispatched `terminals.runTerminals` command to the WSL-installed Terminals Manager.

Key bits:

- Absolute path to `wt.exe` via `/mnt/c/...` mount — WSL's auto-appended Windows PATH isn't reliable for non-interactive shells.
- `wsl.exe --cd ${workspaceFolder}` uses the Linux path directly; no `wslpath` translation needed.
- `\\;` is JSON-escaped `\;` — `wt.exe` reserves `;` as a command-chain delimiter (it would open a second tab), so the semicolon between `claude` and `exec bash` must be escaped to be passed through as a literal.
- `bash -ic "claude; exec bash"`: interactive bash (`-i` sources `~/.bashrc` so `claude` is on PATH), runs claude, then `exec bash` replaces the shell so you stay interactive after.

## How it works (full chain)

1. You open a workspace folder → `auto-run-command` fires `terminals.runTerminals` (gated by `hasFile: **/*`).
2. VSCode routes the command to wherever Terminals Manager is installed — local scope for Windows projects, WSL scope for WSL projects.
3. Terminals Manager reads merged config (workspace `.vscode/terminals.json` + user/remote `settings.json`) and runs every defined terminal.
4. The configured terminal entry runs the shell command in an integrated terminal: `start "" wt.exe ...` (Windows) or `wt.exe new-tab wsl.exe ...` (WSL).
5. WT spawns detached; the launching integrated terminal can close.

## Customization

- **Swap `claude` for any command** — change `cmd /k claude` (Windows) and `bash -ic "claude\; exec bash"` (WSL) to whatever you want autorun.
- **Different external terminal** — replace `wt.exe` with another launcher (`alacritty.exe`, `wezterm.exe`, …) and adjust args.
- **Auto-close after command exits** — drop `/k` on Windows and `; exec bash` on WSL. Trade-off: Ctrl+C closes the window before you can inspect output.
