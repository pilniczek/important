---
title: Hardening Claude Code on the Windows side
tags:
  - AI
  - Claude
  - Security
  - Configuration
  - PC
type: How To
section: Archived
releaseDate: 2026-09-10
---

> Archived 2026-09-10. The Windows install this page hardens no longer exists - Claude Code runs
> in WSL only. Current setup: [[claude-code-environment|Claude Code environment]].

The Windows CLI runs on permission rules and nothing else - the sandbox covers macOS, Linux and WSL2, and the [sandboxing docs](https://code.claude.com/docs/en/sandboxing) state flatly that "Native Windows is not supported", as [[claude-code-environment|the environment page]] sets out. [[claude-code-permissions|The permission rules page]] covers how rules match, what precedence they follow, and the `Write(...)` trap. This page is the Windows-specific deny set that goes on top, and what measuring it actually showed.

Paths use `<you>` for the Windows account name.

## What the rules miss, measured

With `Read(//**/.ssh/**)` in `permissions.deny` and `blockReadsOutsideWorkingDirectories` set to `true`:

| Call                                  | Result                               |
| ------------------------------------- | ------------------------------------ |
| Read tool on `~/.ssh/known_hosts`     | Refused                              |
| `wc -l "~/.ssh/known_hosts"` via Bash | Succeeded                            |
| `ls -la "~/.ssh/"` via Bash           | Succeeded, printed the key filenames |

Three causes, only one of which is a settings mistake.

**Built-in read-only commands run in every mode.** `ls`, `cat`, `echo`, `pwd`, `head`, `tail`, `grep`, `find`, `wc`, `which`, `diff`, `stat`, `du`, `cd` and read-only forms of `git` are recognised as read-only and run without asking, as the [security overview](https://code.claude.com/docs/en/security) sets out. The set is not configurable; the only way to gate one is an explicit `ask` or `deny` rule naming it.

**Interpreters are not recognised as file commands.** Claude Code maps `Read` and `Edit` deny rules onto commands it understands, so `cat` and `sed` inherit them; the [permission rules reference](https://code.claude.com/docs/en/permissions) draws the boundary in the same place, warning that they "don't apply to arbitrary subprocesses that read or write files indirectly, like a Python or Node script that opens files itself". `node -e`, `python -c`, `perl -e` and `Get-Content` open a file through a language runtime and match no path rule at all.

**The pattern was wrong.** `//**/.ssh/**` requires a segment after `.ssh/`, so it fences files inside the directory but not the directory itself. That is why `ls` enumerated the key filenames. Both forms are needed:

```json
"Read(//**/.ssh/**)",
"Read(//**/.ssh)"
```

The Bash results above were taken in the session that wrote the settings. Rules load at session start, so re-run the probe from a fresh session before concluding anything about your own build.

## Fence reads to the working directories

```json
{
  "permissions": {
    "blockReadsOutsideWorkingDirectories": true,
    "disableBypassPermissionsMode": "disable"
  }
}
```

**`additionalDirectories` is the whitelist.** There is no second list. The fence covers the primary working directory plus every entry there, recursively, so one entry at a common parent covers every repo beneath it and sibling repos read each other without prompting.

That makes the list a security surface, not just convenience. It grows on its own from `/add-dir` the same way `permissions.allow` does, and a single entry pointing at the whole user profile hands over `.ssh`, `.aws`, browser profiles, DPAPI blobs and `~/.claude.json` - defeating every read rule below it. Read the list and delete what you no longer work in. Dead entries from typos and renamed projects are harmless but they camouflage the live ones.

`disableBypassPermissionsMode` is typically deployed from managed settings, but the [permission rules reference](https://code.claude.com/docs/en/permissions) has it working from any scope - a user can set it to lock themselves out of bypass mode - and the documented value is the string `"disable"` rather than a boolean.

### UNC entries: judge the path, not the prefix

The Windows warning in the docs is about enabling WebDAV and allowing paths _such as_ `\\*`: the [security overview](https://code.claude.com/docs/en/security) recommends "against enabling WebDAV or allowing Claude Code to access paths such as `\\*`", because doing so may let Claude Code trigger network requests to remote hosts and bypass the permission system. A fixed local share like `\\wsl.localhost\<distro>\tmp` names no remote host and does not carry that risk; a whole WSL home directory carries the same risk as a whole Windows profile, for the same reason. Removing both because they start with `\\` is the wrong cut.

Separately, the docs are firmer than "often": [working directories](https://code.claude.com/docs/en/permissions) now refuse most network paths outright, because looking one up can contact the host it names. Map the share to a drive letter and pass it with `--add-dir` if it needs to work reliably.

## The Windows deny set

Credential stores and secret material:

```json
"Read(//**/.ssh/**)",
"Read(//**/.ssh)",
"Read(//**/.aws/**)",
"Read(//**/.azure/**)",
"Read(//**/.gnupg/**)",
"Read(//**/.kube/**)",
"Read(//**/.docker/config.json)",
"Read(//**/.git-credentials)",
"Read(//**/.netrc)",
"Read(//**/.npmrc)",
"Read(//**/.pypirc)",
"Read(//**/.config/gh/**)",
"Read(//**/.claude/.credentials.json)",
"Read(//c/Users/<you>/.claude.json)",
"Read(//c/Windows/System32/config/**)",
"Read(//c/Users/<you>/AppData/Roaming/Microsoft/Protect/**)",
"Read(//c/Users/<you>/AppData/*/Microsoft/Credentials/**)",
"Read(//c/Users/<you>/AppData/Local/Google/Chrome/User Data/**)",
"Read(//c/Users/<you>/AppData/Local/Microsoft/Edge/User Data/**)",
"Read(//c/Users/<you>/AppData/Roaming/Mozilla/Firefox/**)"
```

`AppData/Roaming/Microsoft/Protect` holds the DPAPI master keys; the browser profile directories hold the encrypted password stores those keys decrypt. They belong together.

System tree and persistence points:

```json
"Edit(//c/Windows/**)",
"Edit(//c/Program Files/**)",
"Edit(//c/Program Files (x86)/**)",
"Edit(//c/ProgramData/**)",
"Edit(//c/Users/<you>/AppData/Roaming/Microsoft/Windows/Start Menu/Programs/Startup/**)",
"Edit(//c/Users/<you>/Documents/PowerShell/**)",
"Edit(//c/Users/<you>/Documents/WindowsPowerShell/**)",
"Edit(//**/.bashrc)",
"Edit(//**/.bash_profile)",
"Edit(//**/.profile)",
"Edit(//**/.git/hooks/**)",
"Edit(//**/.git/config)"
```

Git hooks and shell rc files are the two most commonly missed, and the two that matter most: both are code that runs later, on its own, with no agent in the loop.

Registry, services, scheduled tasks, recovery, and the signed-binary download primitives:

```json
"Bash(reg *)",
"Bash(reg.exe *)",
"Bash(regedit *)",
"Bash(schtasks *)",
"Bash(Register-ScheduledTask *)",
"Bash(sc.exe *)",
"Bash(New-Service *)",
"Bash(Set-Service *)",
"Bash(net user *)",
"Bash(net localgroup *)",
"Bash(vssadmin *)",
"Bash(wbadmin *)",
"Bash(bcdedit *)",
"Bash(diskpart *)",
"Bash(format *)",
"Bash(takeown *)",
"Bash(icacls *)",
"Bash(cacls *)",
"Bash(certutil *)",
"Bash(bitsadmin *)",
"Bash(mshta *)",
"Bash(regsvr32 *)",
"Bash(rundll32 *)",
"Bash(Set-MpPreference *)",
"Bash(Add-MpPreference *)",
"Bash(Set-ExecutionPolicy *)",
"Bash(git config --global *)",
"Bash(claude --dangerously-skip-permissions*)"
```

`certutil`, `bitsadmin`, `mshta`, `regsvr32` and `rundll32` are signed Windows binaries that fetch and execute remote content. Each has its own entry in [LOLBAS](https://lolbas-project.github.io/), the living-off-the-land catalogue that maps them to MITRE ATT&CK techniques, and nothing in normal development needs them. `vssadmin` and `wbadmin` delete shadow copies and backups, which is the step that turns a bad afternoon into an unrecoverable one.

The usual Bash-rule caveat applies in full: these match strings, not shell semantics.

## Interpreters and network egress on `ask`

These are the calls that walk past path rules, so moving them off silent-allow buys something even though a prompt is not a block:

```json
"Bash(node -e *)", "Bash(node --eval *)",
"Bash(python -c *)", "Bash(python3 -c *)", "Bash(py -c *)",
"Bash(perl -e *)", "Bash(ruby -e *)",
"Bash(Invoke-Expression *)", "Bash(iex *)",
"Bash(Invoke-WebRequest *)", "Bash(Invoke-RestMethod *)",
"Bash(iwr *)", "Bash(irm *)", "Bash(Start-BitsTransfer *)",
"Bash(curl *)", "Bash(wget *)", "Bash(scp *)", "Bash(ssh *)",
"Bash(rsync *)", "Bash(nc *)"
```

`ask` outranks `allow`, so these override accumulated allow entries of the same shape and calls that used to be silent start prompting. Adding `Bash(powershell *)` and `Bash(pwsh *)` is defensible but painful when PowerShell is the primary shell; the interpreter entries are the higher-value half.

## Lock the config against itself

```json
"Edit(//**/.claude/settings.json)",
"Edit(//**/.claude/settings.local.json)",
"Edit(//**/.claude/hooks/**)",
"Edit(//**/.mcp.json)",
"Edit(//c/Users/<you>/AGENTS.md)"
```

An instruction that can edit the deny list can remove itself from it. This closes that loop, at a cost that is felt immediately: permissions become hand-edited, including by an agent you _want_ to make the change. Take the backup before applying, because it becomes the rollback path.

```powershell
Copy-Item "$env:USERPROFILE\.claude\settings.json" "$env:USERPROFILE\.claude\settings.json.bak"
```

## Escalate to managed settings

Everything above sits in a file anything running as your user can rewrite. Managed settings sit above every scope and need administrator rights to change, which is what puts them out of reach of a session running as you. This is the file-based mechanism, distinct from the org-pushed `remote-settings.json` described on [[claude-code-permissions|the permission rules page]].

- **Windows**: `C:\Program Files\ClaudeCode\managed-settings.json`
- macOS: `/Library/Application Support/ClaudeCode/managed-settings.json`
- Linux and WSL: `/etc/claude-code/managed-settings.json`

`C:\ProgramData\ClaudeCode\managed-settings.json` is the **legacy** path, and the [managed settings guide](https://code.claude.com/docs/en/managed-settings) states outright that Claude Code doesn't read it. A policy left there is silently inert - no warning, no error.

From an elevated PowerShell:

```powershell
$dir = "C:\Program Files\ClaudeCode"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
Copy-Item .\managed-settings.json (Join-Path $dir "managed-settings.json") -Force
Get-Content (Join-Path $dir "managed-settings.json") | ConvertFrom-Json | Out-Null
```

`C:\Program Files` already denies write to non-administrators, so no ACL work is needed.

## Verify

1. Restart. Rules load at session start, and the session you configured from has tested nothing.
2. `/permissions` - read back the resolved set rather than trusting the file.
3. `/status` - the `Setting sources` line must read `Enterprise managed settings (file)`. If it does not, the policy is not applying and its contents are decoration.
4. Probe a real path. Read tool against a file under `~/.ssh`, then `wc -l` on the same path through Bash. If Bash still gets through after a restart, the read fence is not covering Bash on your build, and the deny list is worth exactly what the table at the top of this page says.

---

Related: [[claude-code-permissions|Claude Code permission rules]] · [[claude-code-environment|Claude Code environment]] · [[global-agents-md-windows-wsl|Global AGENTS.md across Windows and WSL]] · [[ai-security-audit|AI security audit]]
