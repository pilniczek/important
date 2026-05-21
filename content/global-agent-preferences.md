---
title: Global agent preferences
tags:
  - AI
type: How To
section: Main
releaseDate: 2026-07-08
---

The rules stored in the one global `AGENTS.md` that every agent tool reads.
How this file is wired so every tool reads it: [[global-agents-md-windows-wsl|Global AGENTS.md across Windows and WSL]].

```text

# Global preferences

Canonical file: `C:\Users\[USER]\AGENTS.md` (edit only here).

- Windows `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/AGENTS.md` → (symlink) `/mnt/c/Users/[USER]/AGENTS.md`.

## Git

- Read-only git (status/diff/log/show/blame/branch --list/remote -v) may be run freely.
- State-changing git (add/commit/push/pull/fetch/reset/rebase/merge/restore/checkout/stash/tag/config) MUST NOT run unless I explicitly ask for it in the current turn. Ambient phrases ("ship it", "we're done") do not count.
- When writing commit messages, NEVER auto-add your agent name as co-author.

## Writing

- Never publish PII (names/phones/emails of me or anyone). If found while editing, pause and ask - never silently redact.
- Keep personal identifiers (name, username, email, IDs) out of docs/READMEs; use generic examples.
- Say each idea exactly once; cut restated content.
- Never use em dash "—", use dash "-" instead
- Use Mermaid charts to explain complex ideas in md files.
- Prepend a human emoji 🙋 to anything that needs my attention after you act: decisions to make, caveats to know, or follow-up questions (e.g. "Want me to tweak those?", "One thing to decide", "One caveat worth knowing").

```
