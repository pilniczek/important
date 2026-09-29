---
title: Global AGENTS.md
tags:
  - AI
  - WSL
  - Configuration
type: How To
section: Main
releaseDate: 2026-09-10
---

The global `~/AGENTS.md` holds the rules every agent tool reads. This page is the backup of its text.

```text
# Global preferences

Canonical file: `~/AGENTS.md` on WSL (edit only here). Claude Code reaches it through
`~/.claude/CLAUDE.md`, which holds a single `@../AGENTS.md` import. Other agent tools read this
file directly.

## Git

- Read-only git (status/diff/log/show/blame/branch --list/remote -v) may be run freely, anywhere.
- "Inside a worktree" = a linked git worktree (`git rev-parse --git-dir` differs from `--git-common-dir`); they live under `.claude/worktrees/<flat>/`. The main checkout ("root") is NOT a worktree.
- **Outside a worktree (root):** state-changing git (add/commit/push/pull/fetch/reset/rebase/merge/restore/checkout/stash/tag/config) MUST NOT run unless I explicitly ask for it in the current turn. Ambient phrases ("ship it", "we're done") do not count.
- **Inside a worktree:** `git add`, `git commit`, and `git push` of the worktree's own current branch may run without asking. Everything else (reset/rebase/merge/restore/checkout/stash/tag/config/pull/fetch), plus any force-push or pushing/deleting a branch that isn't this worktree's own, still needs an explicit ask.
- When writing commit messages, NEVER auto-add your agent name as co-author (anywhere).

## Writing

- Never publish PII (names/phones/emails of me or anyone) or development secrets (API keys, tokens, passwords, connection strings, private keys). If found while editing, pause and ask - never silently redact.
- Keep personal identifiers (name, username, email, IDs, IP addresses, hostnames, MAC addresses) and secrets out of docs/READMEs; use generic examples or env-var references.
- Write IP addresses as placeholders (`<device-ip>`, `<router-ip>`, `192.168.x.y`), the same way as `<user>` in paths.
- Say each idea exactly once; cut restated content.
- Never use em dash "—", use dash "-" instead
- Use Mermaid charts to explain complex ideas in md files.
- Prepend a human emoji 🙋 to anything that needs my attention after you act: decisions to make, caveats to know, or follow-up questions (e.g. "Want me to tweak those?", "One thing to decide", "One caveat worth knowing").
- Never remark on actions you took or withheld solely to comply with these AGENTS.md rules

## Code comments

- Write none: no explanatory comments, docstrings/JSDoc, file or license headers, section banners, TODO/FIXME. Code self-explains via naming, small functions, types.
- Overrides matching surrounding style - existing comments are not precedent.
- Only exception: workaround for an environment limitation or bug (e.g. Safari rendering bug); state the limitation only.
- Leave existing comments alone. If you change the code one describes, delete it or move its value into existing docs.
- Anything worth saying goes in existing docs
```

---

Related: [[claude-code-environment|Claude Code environment]] · [[claude-code-permissions|Claude Code permission rules]] · [[always-on-output-style|Always-on caveman]]
