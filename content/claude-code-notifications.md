---
title: Windows toast when Claude Code finishes
tags:
  - AI
  - Claude
  - Configuration
  - WSL
type: How To
section: Main
releaseDate: 2026-09-22
---

Claude Code runs a turn for minutes at a time and then sits there, finished, in a terminal that is no longer on screen. A `Stop` hook closes that gap: when the turn ends, WSL calls `powershell.exe` and Windows raises a real toast. This page is the WSL-only variant of the setup described in [[claude-code-environment|Claude Code environment]]; the hook files live under `~/.claude/hooks/`, which that page's inventory already covers as the place for hook scripts.

## What fires when

Claude Code has several hook events. Two of them are candidates here.

| event | fires when | good for |
| --- | --- | --- |
| `Stop` | the main agent has finished its turn | "it is done, come back" |
| `Notification` | Claude waits for a permission answer, or has been idle 60 s | "it is blocked on you" |
| `SubagentStop` | a subagent finished | noisy as soon as agents fan out |

`Stop` is the one that answers "did it finish". A hook receives the event payload as JSON on stdin - for `Stop` that is `session_id`, `transcript_path`, `cwd` and `stop_hook_active` - and a non-zero exit only matters for the events that can block, which `Stop` is not. Exiting `0` unconditionally keeps a broken notifier from ever interfering with the session.

## Why it has to be PowerShell

There is no notification daemon inside a default WSL distro, so `notify-send` has nothing to talk to. The only path to the Windows notification centre is WSL interop: run `powershell.exe`, and let Windows PowerShell 5.1 use the WinRT `ToastNotificationManager`. PowerShell 7 does not carry those WinRT projections, so the script must run under `powershell.exe` and not `pwsh.exe`.

A toast also needs an **AUMID** - an application id that is registered on the machine - or `Show()` succeeds and nothing ever appears. Windows PowerShell registers one itself, and borrowing it is the version that needs no install and no extra module:

```text
{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe
```

The toast then shows the PowerShell icon and name. `BurntToast` gives nicer branding and costs a module install; the raw WinRT call below costs nothing.

## The two files

### `~/.claude/hooks/toast.ps1`

```powershell
param(
  [string]$Title = 'Claude Code',
  [string]$Text = 'Finished'
)

$ErrorActionPreference = 'Stop'

[void][Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime]
[void][Windows.Data.Xml.Dom.XmlDocument, Windows.Data.Xml.Dom, ContentType = WindowsRuntime]

$appId = '{1AC14E77-02E7-4E5D-B744-2EB1AE5198B7}\WindowsPowerShell\v1.0\powershell.exe'

$xml = @"
<toast>
  <visual>
    <binding template="ToastGeneric">
      <text>$([System.Security.SecurityElement]::Escape($Title))</text>
      <text>$([System.Security.SecurityElement]::Escape($Text))</text>
    </binding>
  </visual>
  <audio src="ms-winsoundevent:Notification.Default" />
</toast>
"@

$doc = [Windows.Data.Xml.Dom.XmlDocument]::new()
$doc.LoadXml($xml)

[Windows.UI.Notifications.ToastNotificationManager]::CreateToastNotifier($appId).Show(
  [Windows.UI.Notifications.ToastNotification]::new($doc)
)
```

`SecurityElement::Escape` is not decoration - a project directory called `r&d` produces invalid XML and a silent no-toast without it.

### `~/.claude/hooks/notify-stop.sh`

```bash
#!/usr/bin/env bash
set -uo pipefail

payload=$(cat)

project=$(printf '%s' "$payload" | python3 -c '
import json, os, sys
try:
    data = json.load(sys.stdin)
except Exception:
    data = {}
print(os.path.basename(data.get("cwd") or os.getcwd()) or "Claude Code")
')

script_win=$(wslpath -w "$HOME/.claude/hooks/toast.ps1")

powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass \
  -File "$script_win" \
  -Title "Claude Code" \
  -Text "$project - turn finished" >/dev/null 2>&1 &

exit 0
```

Three things in there are load-bearing:

- **`wslpath -w`.** `powershell.exe -File` is a Windows process and cannot open `/home/...`. It needs `\\wsl.localhost\...`, which `wslpath` produces.
- **The trailing `&`.** Starting a Windows process from WSL costs the better part of a second. Backgrounding it means the turn ends immediately and the hook's `timeout` never bites.
- **`-NoProfile`.** A PowerShell profile that prints anything, or that takes two seconds to load, turns every finished turn into a delay.

Make it executable:

```bash
chmod +x ~/.claude/hooks/notify-stop.sh
```

## Where to paste the config

The hook is registered in `~/.claude/settings.json`, under `hooks.Stop`. That file already holds the `SessionStart` and `UserPromptSubmit` entries, so the new block goes beside them - `hooks` is one object with one key per event, not one object per hook:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$HOME/.claude/hooks/notify-stop.sh\"",
            "timeout": 15,
            "statusMessage": "Sending Windows toast..."
          }
        ]
      }
    ]
  }
}
```

Hook commands run through a shell, so `$HOME` expands. `Stop` takes no `matcher` - that field only applies to the tool events.

Settings are read at session start, so restart Claude Code, or run `/hooks` to confirm the entry is registered.

## Test it without waiting for a turn

The script is an ordinary program reading stdin, so it can be run by hand:

```bash
echo '{"cwd":"'"$PWD"'","session_id":"test"}' | ~/.claude/hooks/notify-stop.sh
```

A toast should appear within a second or two. If nothing shows up, work down this list:

- **Run the PowerShell side directly.** `powershell.exe -NoProfile -File "$(wslpath -w ~/.claude/hooks/toast.ps1)" -Text hi`. An error here is a PowerShell problem, not a hook problem.
- **Check Focus assist.** Windows suppresses toasts during Do Not Disturb / focus sessions and in full-screen mode, and the notification still lands silently in the Action Center.
- **Check notifications are enabled for Windows PowerShell** under Settings, System, Notifications. Borrowing its AUMID means borrowing its notification permission too.
- **Check interop is alive.** `powershell.exe -NoProfile -Command exit` failing with `UtilConnectUnix: socket failed` means interop is blocked - which is exactly what a sandboxed shell does. The hook process itself is not sandboxed, so this failure can appear in an agent's own shell while the real hook works.

## Optional: only notify slow turns

`Stop` fires at the end of every turn, including the one-line answers, and a toast for each of those is worse than no toast. Recording the turn's start in a `UserPromptSubmit` hook makes a duration available, and the notifier can then keep quiet under a threshold.

`~/.claude/hooks/turn-start.sh`:

```bash
#!/usr/bin/env bash
set -uo pipefail

payload=$(cat)

session=$(printf '%s' "$payload" | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    data = {}
print(data.get("session_id") or "unknown")
')

mkdir -p "${TMPDIR:-/tmp}/claude-turn-start"
date +%s > "${TMPDIR:-/tmp}/claude-turn-start/$session"

exit 0
```

Registered the same way, under `hooks.UserPromptSubmit`. In `notify-stop.sh`, read it back before building the toast:

```bash
session=$(printf '%s' "$payload" | python3 -c '
import json, sys
try:
    data = json.load(sys.stdin)
except Exception:
    data = {}
print(data.get("session_id") or "unknown")
')

started_file="${TMPDIR:-/tmp}/claude-turn-start/$session"
threshold=60

if [ -f "$started_file" ]; then
  elapsed=$(( $(date +%s) - $(cat "$started_file") ))
  rm -f "$started_file"
  [ "$elapsed" -lt "$threshold" ] && exit 0
fi
```

Sixty seconds is a starting point: long enough that anything triggering a toast was worth walking away from, short enough that a normal edit-and-lint turn still counts.

## What this does not cover

- **Permission prompts.** A turn that stops to ask for approval does not fire `Stop`; it fires `Notification`. Pointing the same script at `hooks.Notification` covers it, at the cost of a toast every time an unapproved command comes up.
- **Background tasks.** A `run_in_background` command that finishes after the turn has ended is not a `Stop` event and raises nothing.
- **Other machines.** This is interop and a Windows AUMID, so it works on WSL under Windows and nowhere else. On a Linux desktop the same `notify-stop.sh` shape works with `notify-send` in place of the `powershell.exe` line.
