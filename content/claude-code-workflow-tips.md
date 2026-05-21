---
title: Claude Code workflow tips
tags:
  - AI
  - Skill
type:
  - How To
releaseDate: 2026-05-21
---

A grab-bag of Claude Code slash commands and one MCP that make day-to-day work less painful.

## Context & history

- `/init` — Scans the current repo and generates a `CLAUDE.md` briefing. Run once when adopting a new project so future sessions start with shared context.
- `/context` — Shows what's loaded right now: tokens used, files in scope, system reminders. Quickest way to see why a session feels slow.
- `/compact` — Summarises the older half of the conversation to free up context. Use when you want to keep going on a long session without losing thread.
- `/clear` — Resets the conversation. Same effect as restarting; faster than closing the terminal.
- `/rewind` — Steps the conversation back to an earlier turn. Cheap undo for "actually, take that back" — also rolls back file edits made since that turn.
- `/model` — Switches model mid-session. Drop to Haiku for trivial edits, jump to Opus for the gnarly stuff. Probably the highest-leverage habit on this page.
- `/resume` — Reopens a prior session by id. Useful when you closed the terminal mid-task.

## Reasoning depth

- **Thinking budgets** — Keywords like `think`, `think hard`, `ultrathink` (plus the `/ultrathink` slash command) buy more deliberation. See [[claude-code-thinking-budgets|Claude Code thinking budgets]] for which to reach for when.

## Input & UI

- `/voice` — Talk to Claude Code with your microphone instead of typing.
- `/statusline` — Configures the bottom-of-terminal status line (model, branch, token usage, etc.).
- **Inline prefixes.** `@path/to/file` attaches a file, `!cmd` runs a shell command in the session so its output lands in the conversation, `#text` pins a note to memory. Daily-driver shortcuts most people miss.

## Automation

- `/loop <interval> <prompt>` — Runs a prompt on a recurring interval, e.g. `/loop 5m /check-deploys`. Omit the interval to let the model self-pace. Useful for polling CI, watching builds, babysitting long jobs.
- `/schedule` — Cron-style remote runs. Sibling to `/loop`, but unattended — the agent runs on a schedule without your terminal open.
- `/remotecontrol` — Drives the local Claude Code session from another device.

## MCP servers

- **Context7 MCP** — Pulls up-to-date docs for libraries and frameworks straight into the conversation. Install once, then add "use context7" to any prompt and Claude fetches current docs instead of relying on its training cutoff. Saves a lot of "this API changed last year" mistakes.

---

Note: [YT: 32 Tricks to Level Up Claude Code](https://www.youtube.com/watch?v=jqoFP9QapXI)
