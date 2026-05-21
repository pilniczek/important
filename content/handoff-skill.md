---
title: Multi-session solutions via /handoff
tags:
  - AI
  - Skill
type: How To
section: Main
releaseDate: 2026-06-10
url: https://www.youtube.com/watch?v=dtAJ2dOd3ko
---

Matt Pocock's `/handoff` skill ([[skills|registry]]) is tiny: *write a doc summarizing the current
conversation so a fresh agent can continue, saved to the OS temp dir.* It slices the context that
matters into a new session, keeping the current one pure.

- **Handoff vs. compact.** Compact summarizes back into the *same* session (good for long debugging). Handoff spins out-of-scope work into a *separate* session - without diluting or clobbering the current one. Bonus: declaring something out of scope sharpens the session you're in.
- **DIY sub-agent.** Mid-[[grill-with-docs|grill]], hand an ungrillable question off to a prototype session, then hand the learnings *back*. Parent → child → parent.
- **Tool-agnostic.** It's just markdown - hand a Claude Code doc to Codex, Copilot, etc.

A good handoff doc: suggests which skills the next session should invoke, points to existing artifacts instead of duplicating them, redacts secrets, and states the next session's purpose.
