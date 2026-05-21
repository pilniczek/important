---
title: Claude /init is a bait
tags:
  - AI
  - Claude
type: Approach
section: Main
releaseDate: 2026-06-08
url: https://www.youtube.com/watch?v=9tmsq-Gvx6g
---

`/init` generates a long CLAUDE.md into your **global** context.

- It burns tokens on every request.
- Distracts the agent during small tasks.
- Rots when code changes.

## Why it hurts

- The system prompt (CLAUDE.md included) is the one *fixed* slice of the context window — it shrinks the room left for explore, implement, and test, every request.
- LLMs have an instruction budget - irrelevant instructions distract agent before it even starts working.
- Most of init's output (commands, architecture, file references) is trivially discoverable (`package.json`, config files)

## What to do instead

- Do not document discoverable data.
  - Let the built-in **explore phase** build context just-in-time.
- Put steering ("prefer reducers", "use pnpm not npm") in **skills**.
  - Discovered on demand.
  - Not loaded on every request.
- Document genuinely non-discoverable quirks
  - E.g. "you are on WSL on Windows".
