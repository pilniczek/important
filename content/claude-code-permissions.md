---
title: Claude Code permission rules (and three traps)
tags:
  - AI
  - Claude
  - Configuration
  - Security
type: How To
section: Main
releaseDate: 2026-09-10
---

Every tool call Claude Code makes is matched against a flat list of [permission rules](https://code.claude.com/docs/en/permissions). A rule is a string shaped `ToolName(argument)`, and it sits in one of three buckets inside a `permissions` object:

```json
{
  "permissions": {
    "deny": ["Bash(sudo *)"],
    "ask": ["Bash(chmod *)"],
    "allow": ["Bash(npm ls:*)"]
  }
}
```

The mechanics look obvious and are not. Three separate traps make rules that read as protective do nothing at all. All three are reproducible, and the recipe for reproducing them is at the bottom.

Verified against Claude Code 2.1.210.

## Scopes and where relative paths point

Rules can come from five sources, ranked by [settings precedence](https://code.claude.com/docs/en/settings) with managed highest and user lowest. They are all merged into one list before matching, so a rule's scope decides two things only: who can override the file, and what a relative path inside it resolves against.

| Scope            | File                                                                        | Base dir for `/x`         |
| ---------------- | --------------------------------------------------------------------------- | ------------------------- |
| policy / managed | pushed by an org-managed channel, lands in `~/.claude/remote-settings.json` | working directory         |
| flag             | whatever you pass to `--settings <file>`                                    | that file's own directory |
| local            | `<repo>/.claude/settings.local.json`                                        | repo root                 |
| project          | `<repo>/.claude/settings.json`                                              | repo root                 |
| user             | `~/.claude/settings.json`                                                   | **`~/.claude`**           |

That last row is the first trap. A rule written `Read(/.env)` in **user** settings guards `~/.claude/.env`, not the `.env` of whatever repo you happen to be in; the [permission rules reference](https://code.claude.com/docs/en/permissions) gives the same case: "a deny rule such as `Read(/secrets/**)` in user settings blocks `~/.claude/secrets/**`". The same string in **project** settings guards the repo's own `.env`, which is what everyone assumes it does everywhere.

Path prefixes are interpreted like this:

| Written as    | Resolves to                             |
| ------------- | --------------------------------------- |
| `//etc/hosts` | absolute `/etc/hosts`, base dir ignored |
| `/etc/hosts`  | `<base dir>/etc/hosts`                  |
| `./x`, `x`    | relative to the current directory       |
| `~/x`         | home directory                          |

So a rule that must hold in every repo regardless of which settings file carries it has to be written absolute, with the doubled slash and a `**` for depth:

```json
"deny": ["Read(//**/.env)"]
```

That form is verified: a `.env` several directories deep is refused with `File is in a directory that is denied by your permission settings.`

## Precedence: deny, then ask, then allow

Matching walks the buckets in a fixed order and returns on the first hit. Deny wins over everything, ask wins over allow, and allow is only reached when neither of the others matched.

```mermaid
flowchart LR
  A["tool call"] --> D{"matches deny?"}
  D -- yes --> X["refused"]
  D -- no --> K{"matches ask?"}
  K -- yes --> P["prompt"]
  K -- no --> L{"matches allow?"}
  L -- yes --> Y["runs"]
  L -- no --> M["mode default decides"]
```

Two consequences worth internalising.

**An ask rule silently kills a broader allow.** A block holding `ask: Read(./.env.*)` alongside `allow: Read(./.env.example)` never reaches the allow, because `.env.*` matches `.env.example` and ask is checked first. Reading the template prompts you, forever, and the allow rule looks fine in the file.

**No allow rule can rescue a deny.** If a deny pattern is broad, narrowing it is the only fix. There is no negation syntax, so `deny: Edit(//**/.env.*)` genuinely does mean the agent can never write a `.env.example` either. Decide which of the two you want before writing the pattern.

## The `Write(...)` trap

This is the expensive one. File permission checks consult `Read(...)` for reads and `Edit(...)` for writes. `Edit(...)` covers **every** file-modifying tool. `Write(...)` is not a rule name the check ever looks at, so any rule written that way is an inert string. Claude Code "accepts the rule but never consults it", in the words of the [permission rules reference](https://code.claude.com/docs/en/permissions), and `NotebookEdit`, `Glob` and the legacy `MultiEdit` behave the same way.

Claude Code says so itself, once per offending rule, at every session start:

```text
Permission deny rule: Write(./.env) is not matched by file permission checks
— only Edit(path) rules are. Use Edit(./.env) instead (Edit rules cover all
file-editing tools).
```

A hardening block that guards reads with `Read(...)` and writes with `Write(...)` therefore protects exactly half of what it looks like it protects:

```mermaid
flowchart LR
  R["agent reads .env"] --> RG["ask Read(./.env)<br/>matches, prompts"]
  W["agent overwrites .env"] --> WG["deny Write(./.env)<br/>never matches, proceeds"]
```

Both halves of that diagram are verified. With `deny: Edit(//**/.env)` in place the write is refused and the file is left byte-identical; with only the `Write(...)` form, nothing stops it.

## Bash rules are string patterns, not semantics

`Bash(...)` rules match the command string by prefix and wildcard. They do not understand shell. `Bash(rm -rf /)` and `Bash(rm -rf /*)` say nothing about `rm -fr /`, and `Bash(git push --force)` says nothing about `git -c foo=bar push --force`. Treat a Bash deny list as a guardrail against the obvious slip, never as a sandbox. Anthropic's own answer to that gap is the [sandboxed Bash tool](https://code.claude.com/docs/en/sandboxing), which constrains every process a command starts at the OS level instead of matching strings.

The two mechanisms meet at the escape hatch. When the sandbox blocks a command, Claude may retry it with `dangerouslyDisableSandbox`, and that retry lands back in the permission flow - a prompt in Manual mode, the classifier in auto mode. So a sandbox with the default `allowUnsandboxedCommands: true` is ultimately still gated by the rules above, traps included. Setting it to `false` makes Claude Code ignore the parameter outright, which is the one configuration where the rules stop being the last line. `Bash(dangerouslyDisableSandbox:true)` as an `ask` rule is the middle setting: keep the hatch, prompt every time it is used. The [sandboxing docs](https://code.claude.com/docs/en/sandboxing) carry all three. Verified on 2.1.267: with the strict form set, the tool description itself changes to say the parameter is disabled by policy.

### The `!` prompt is outside all of it

A prompt line beginning with `!` is [shell mode](https://code.claude.com/docs/en/interactive-mode): the rest of the line runs as a shell command in your own shell, and Claude Code "doesn't require Claude to interpret or approve the command". No tool call is made, so no rule in this page's buckets is consulted - the deny list, the ask list and the `Write(...)` trap are all bypassed by construction. The command and its output land in the conversation afterwards, and since v2.1.186 Claude also responds to that output automatically.

The sandbox skips it as well. Strict mode "applies to the commands Claude runs", and the [sandboxing docs](https://code.claude.com/docs/en/sandboxing) name the two sessions where that stops being true:

- A **background session** with strict mode on sandboxes shell-mode commands too.
- A **Linux session with `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` set** sandboxes every command, shell-mode included.
- An ordinary interactive session does neither.

Before v2.1.260 strict mode sandboxed shell-mode commands in every session, so a setup verified against an older build has since loosened without anything in the config changing.

This is a boundary rather than a gap: the rules and the sandbox constrain the agent, not the person at the keyboard. It is also the practical route for anything the agent is deliberately denied. `Bash(sudo *)` in the deny list plus strict sandbox mode leaves no way for Claude to run an elevated command, and `! sudo …` is how that command gets run anyway - by you, visibly, with the output still landing in the transcript for Claude to read.

## The policy scope is not yours to edit

If your Claude account belongs to an org-managed channel, that channel can push permission rules to your machine. They land in `~/.claude/remote-settings.json` and arrive in the [managed settings](https://code.claude.com/docs/en/managed-settings) tier, which sits above every scope you control, your own user settings included. Their relative paths resolve against the working directory, so unlike user-scope rules the `./`-relative form does work per-repo.

Two things follow. Your own settings cannot loosen them, so there is no point restating them. And a local edit to that file survives only until the next sync, so a defect in a pushed block has to be fixed by whoever administers the channel. What you _can_ do meanwhile is add rules of your own: deny is additive across scopes, so a deny you add in user settings holds regardless of what policy says - unless the pushed block also carries `allowManagedPermissionRulesOnly`, which the [server-managed settings](https://code.claude.com/docs/en/server-managed-settings) page gives as a standard example and which makes Claude Code ignore permission rules from user, project and local files entirely.

### The managed tier holds one source, not all of them

The tier is not a merge of everywhere a policy could come from. Four sources feed it - server-managed settings fetched from claude.ai, an MDM or OS-level policy, a `managed-settings.json` file in a system directory, and the Windows `HKCU` registry - and the [managed settings docs](https://code.claude.com/docs/en/managed-settings) describe the default behaviour as `"first-wins"`: "Claude Code uses the highest-ranked source that delivers at least one policy key and ignores the rest rather than merging them". A **policy key** is any key except the two control keys, so one pushed `deny` entry is enough for the remote source to claim the tier and shut the others out.

The consequence is counter-intuitive and silent. Deploying your own root-owned `managed-settings.json` to lock something down does nothing on an account whose organization already pushes anything, because the file ranks below the remote source and is never read. There is no warning. A handful of keys are exempt and read from every admin source, most of them sandbox locks, and `/status` names both the source that won and the ones skipped - that line, not the presence of the file, is the proof. Turning the file back on across the board takes `managedSourcesBehavior: "merge"`, which is only honored from the highest-ranked source, so it is the administrator's key rather than yours.

## Reproducing any of this yourself

`--settings <file>` loads a settings file at flag scope without touching your real config, which makes rule behaviour testable in one command. Use a dummy value, never a real secret.

```bash
mkdir -p /tmp/permtest && printf 'DUMMY=pineapple42\n' > /tmp/permtest/.env

cat > /tmp/deny.json <<'JSON'
{ "permissions": { "deny": ["Edit(//**/.env)"] } }
JSON

cd /tmp/permtest
claude -p --settings /tmp/deny.json \
  "Append FOO=bar to .env in the current directory. Report the exact error if it fails."
```

A working deny answers with `File is in a directory that is denied by your permission settings.` and leaves the file unchanged. Swap `Edit` for `Write` in the JSON and the same command edits the file, which is the whole trap in one diff.

## A block that actually fires

Corrected shape for a secrets-hardening block, written absolute so it holds from user scope in every repo including fresh clones:

```json
{
  "permissions": {
    "deny": [
      "Edit(//**/.env)",
      "Edit(//**/.env.*)",
      "Edit(//**/secrets/**)",
      "Edit(//**/.credentials/**)",
      "Edit(//**/keys/**)",
      "Edit(//**/config/credentials.json)",
      "Edit(//**/application-secrets.yml)",
      "Edit(//**/application-secrets.yaml)",
      "Read(//**/secrets/**)",
      "Read(//**/.credentials/**)",
      "Read(//**/keys/**)",
      "Read(//**/config/credentials.json)",
      "Bash(sudo *)",
      "Bash(chown *)"
    ],
    "ask": [
      "Read(//**/.env)",
      "Read(//**/application-secrets.yml)",
      "Read(//**/application-secrets.yaml)",
      "Read(//**/gradle.properties)",
      "Bash(git reset --hard*)",
      "Bash(chmod *)",
      "Bash(curl * | bash*)",
      "Bash(curl * | sh*)",
      "Bash(wget * | bash*)",
      "Bash(wget * | sh*)"
    ]
  }
}
```

Note what is deliberately absent. There are no `allow` entries for `.env.example` and friends: the `Edit(//**/.env.*)` deny above outranks any allow, so those entries would be decoration. If editing templates matters more than blanket coverage, drop the `.env.*` deny and enumerate the real suffixes (`.env.local`, `.env.production`, and so on) instead.

## Caveats

- **Rule counts grow on their own.** Approving a one-off command in a session appends it to `permissions.allow`, so a long-lived user settings file accumulates hundreds of hyper-specific entries. Edit that file surgically; a reformat there is a diff nobody can review.
- **Deny is not a sandbox.** It refuses tool calls. It does not constrain a process that a permitted command starts.
- **The session you edit from does not see the change.** Rules load at session start. Test in a fresh one.

---

Related: [[always-on-output-style|Always-on caveman]] · [[global-agents-md-windows-wsl|Global AGENTS.md across Windows and WSL]] · [[claude-code-environment|Claude Code environment]] · [[claude-code-windows-hardening|Hardening Claude Code on the Windows side]]
