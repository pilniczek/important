---
title: Global AGENTS.md across Windows and WSL
tags:
  - AI
  - WSL
  - Skill
type: How To
section: Main
releaseDate: 2026-07-08
---

## Canonical file and pointers

Edit only canonical file: `C:\Users\[USER]\AGENTS.md`. Everything else points at it:

- Windows `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/.claude/CLAUDE.md` → `@../AGENTS.md`
- WSL `~/AGENTS.md` → (symlink) `/mnt/c/Users/[USER]/AGENTS.md`.

## Layout

```mermaid
flowchart LR
  subgraph WIN["Windows (~ = C:\Users\<UserName>)"]
    WC["~/.claude/CLAUDE.md<br/>@../AGENTS.md"] --> WA["~/AGENTS.md<br/>REAL FILE"]
    WOTHER["Other agent tools<br/>(Codex, Cursor, ...)"] --> WA
  end
  subgraph WSL["WSL (~ = /home/<UserName>)"]
    LC["~/.claude/CLAUDE.md<br/>@../AGENTS.md"] --> LA["~/AGENTS.md<br/>symlink"]
    LOTHER["Other agent tools<br/>(Codex, Cursor, ...)"] --> LA
  end
  LA -. symlink .-> WA
```

## How resolution works

- Claude auto-loads `~/.claude/CLAUDE.md` every session.
- `@../AGENTS.md` line imports file one dir up: `~/AGENTS.md`.
- Windows: real file. WSL: symlink, reads same `/mnt/c` file.
- Other agent tools read `~/AGENTS.md` directly. No import step.


Rules in that file: [[global-agent-preferences|Global agent preferences]].
