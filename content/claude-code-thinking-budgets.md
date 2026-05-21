---
title: Claude Code thinking budgets
tags:
  - AI
  - Claude
type: How To
section: Main
releaseDate: 2026-05-21
---

Claude Code reads thinking-budget hints from keywords in your message. Higher tiers buy more deliberation at the cost of latency and tokens — match the rung to the task instead of always reaching for the top.

| Keyword(s)                                   | Reach for it when…                                                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `(none)`<br/>default                         | Routine edits, lookups, single-file tweaks — anything the model can answer without planning.                                          |
| `think`<br/>~4k tokens                       | Small judgement calls: naming, picking between two known options, light refactors, "is this approach reasonable?".                    |
| `think hard`, `megathink`<br/>~10k tokens    |  Multi-step changes, weighing architecture / API trade-offs, planning a non-trivial PR, untangling a flaky test.                       |
| `think harder`, `ultrathink`<br/>~32k tokens | ~32k tokens (max) | Tricky debugging, subtle concurrency or security issues, designs with many moving constraints, "I've been stuck for an hour" moments. |

The slash command `/ultrathink` is a one-handed shortcut for the top tier. Latency climbs sharply past `think hard` though — don't reach for it by default.

## Resources

- Anthropic engineering: [Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices) — the post that introduced the keyword ladder publicly.

Budgets above are approximate, sourced from community reverse-engineering rather than an official spec.
