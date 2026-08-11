---
title: Global AGENTS.md across Windows and WSL
tags:
  - AI
  - WSL
  - Configuration
type: How To
section: Main
releaseDate: 2026-08-11
---

One global `AGENTS.md` holds the rules every agent tool reads, on both Windows and WSL.

## Canonical file and pointers

Edit only canonical file: `C:\Users\[USER]\AGENTS.md`. Everything else points at it:

- Windows `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/AGENTS.md` → (symlink) `/mnt/c/Users/[USER]/AGENTS.md`.

The same pattern carries the rest of the shared configuration, each canonical under `C:\Users\[USER]\` with a symlink to it from WSL:

- `.claude\skills\` and `.agents\` - the skills Claude Code reads, plus the CLI's store and lock, linked as a unit so an install from either OS updates one state
- `.claude\statusline\` - the statusline clone, see [[claude-statusline|claude-statusline]]
- `.claude\caveman\` - the caveman clone whose hooks carry the always-on voice, see [[always-on-output-style|Always-on caveman]]

Anything whose content is free of OS-specific paths qualifies. `settings.json` does not, which is why its `statusLine` command and its two hook commands are written separately on each side - the full inventory is in [[claude-code-environment|Claude Code environment]].

## Layout: agent instruction files

The pointer chain, and the one file every agent tool reads. `CLAUDE.md` is duplicated because it is only a pointer; the file it points at is shared.

```mermaid
flowchart LR
  subgraph WIN["Windows (~ = C:\Users\[USER])"]
    WC["~/.claude/CLAUDE.md<br/>@../AGENTS.md"] --> WA["~/AGENTS.md<br/>REAL FILE"]
    WOTHER["Other agent tools<br/>(Codex, Cursor, ...)"] --> WA
  end
  subgraph WSL["WSL (~ = /home/[USER])"]
    LC["~/.claude/CLAUDE.md<br/>@../AGENTS.md"] --> LA["~/AGENTS.md<br/>symlink"]
    LOTHER["Other agent tools<br/>(Codex, Cursor, ...)"] --> LA
  end
  LA -. symlink .-> WA
```

## Layout: skills and the caveman voice

The skills directory and the CLI's store travel together, so `skills list` cannot disagree between the two sides. The caveman clone rides along with them, and its `SessionStart` hook reads the caveman `SKILL.md` out of that same shared skills directory - one source for both the slash command and the always-on voice. What each side still writes for itself is the hook command, because it carries a path.

```mermaid
flowchart LR
  subgraph WIN2["Windows (~ = C:\Users\[USER])"]
    WK["~/.claude/skills<br/>REAL DIRS"]
    WG["~/.agents<br/>store + .skill-lock.json"]
    WV["~/.claude/caveman<br/>REAL DIR (clone)"]
  end
  subgraph WSL2["WSL (~ = /home/[USER])"]
    LK["~/.claude/skills<br/>symlink"]
    LG["~/.agents<br/>symlink"]
    LV["~/.claude/caveman<br/>symlink"]
  end
  LK -. symlink .-> WK
  LG -. symlink .-> WG
  LV -. symlink .-> WV
  WSET["Windows settings.json<br/>hooks -> C:/.../caveman"] --> WV
  LSET["WSL settings.json<br/>hooks -> /home/.../caveman"] --> LV
```

## Layout: statusline

The statusline adds a step the others do not have, because it is a program under development rather than a config file. The two checkouts never talk to each other directly: changes go up to GitHub from the development checkout and come back down into the deployed clone, which is the copy both operating systems execute.

```mermaid
flowchart LR
  DEV["WSL ~/Projects.../claude-statusline<br/>development checkout, SSH remote"]
  GH["github.com/[USER]/claude-statusline"]
  WT["Windows ~/.claude/statusline<br/>deployed clone, HTTPS remote"]
  LT["WSL ~/.claude/statusline<br/>symlink"]
  DEV -- "git push" --> GH
  GH -- "git pull" --> WT
  LT -. symlink .-> WT
  WT --> WRUN["Windows settings.json<br/>node C:/.../statusline.js"]
  LT --> LRUN["WSL settings.json<br/>node /home/.../statusline.js"]
```

## How resolution works

- Claude auto-loads `~/.claude/CLAUDE.md` every session.
- `@../AGENTS.md` line imports file one dir up: `~/AGENTS.md`.
- Windows: real file. WSL: symlink, reads same `/mnt/c` file.
- Other agent tools read `~/AGENTS.md` directly. No import step.
- The symlinks are created on the WSL side, where no privilege is needed. Windows does support symlinks, but creating one there needs Developer Mode or an elevated shell.

## The rules in that file

```text

# Global preferences

Canonical file: `C:\Users\[USER]\AGENTS.md` (edit only here).

- Windows `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/AGENTS.md` → (symlink) `/mnt/c/Users/[USER]/AGENTS.md`.

## Git

- Read-only git (status/diff/log/show/blame/branch --list/remote -v) may be run freely, anywhere.
- "Inside a worktree" = a linked git worktree (`git rev-parse --git-dir` differs from `--git-common-dir`); they live under `.claude/worktrees/<flat>/`. The main checkout ("root") is NOT a worktree.
- **Outside a worktree (root):** state-changing git (add/commit/push/pull/fetch/reset/rebase/merge/restore/checkout/stash/tag/config) MUST NOT run unless I explicitly ask for it in the current turn. Ambient phrases ("ship it", "we're done") do not count.
- **Inside a worktree:** `git add`, `git commit`, and `git push` of the worktree's own current branch may run without asking. Everything else (reset/rebase/merge/restore/checkout/stash/tag/config/pull/fetch), plus any force-push or pushing/deleting a branch that isn't this worktree's own, still needs an explicit ask.
- When writing commit messages, NEVER auto-add your agent name as co-author (anywhere).

## Writing

- Never publish PII (names/phones/emails of me or anyone) or development secrets (API keys, tokens, passwords, connection strings, private keys). If found while editing, pause and ask - never silently redact.
- Keep personal identifiers (name, username, email, IDs) and secrets out of docs/READMEs; use generic examples or env-var references.
- Say each idea exactly once; cut restated content.
- Never use em dash "—", use dash "-" instead
- Use Mermaid charts to explain complex ideas in md files.
- Prepend a human emoji 🙋 to anything that needs my attention after you act: decisions to make, caveats to know, or follow-up questions (e.g. "Want me to tweak those?", "One thing to decide", "One caveat worth knowing").
- Never remark on actions you took or withheld solely to comply with these AGENTS.md rules

```

Related: [[claude-code-environment|Claude Code environment]] · [[claude-code-permissions|Claude Code permission rules]] · [[always-on-output-style|Always-on caveman]]
