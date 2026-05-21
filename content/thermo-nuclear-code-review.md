---
title: Thermo-Nuclear review - be ambitious
tags:
  - AI
  - Skill
type: Approach
section: Main
releaseDate: 2026-06-08
url: https://www.youtube.com/watch?v=mh5XZ-L5SFQ
---

Matt Pocock test-drives Cursor's [Thermo-Nuclear Code Quality Review](https://skills.sh/cursor/plugins/thermo-nuclear-code-quality-review)
skill. The lesson: an *ambitious* review beats a timid one. Most review prompts
treat the diff as their bounds; this one hunts the whole codebase for "code judo
moves" - reframings that delete whole categories of complexity.

## What the skill pushes for

- **Split big files.** Don't let a PR push a file past ~1K lines - large files are
  hard for agents to navigate (they ingest the whole thing); filenames are context pointers.
- **No spaghetti.** Weird nested `if`s are a design problem - push logic into a
  helper / state machine / policy object, not into an existing path.
- **Boring over magical.** Prefer direct, maintainable code; reuse canonical helpers
  over bespoke one-offs.
- **Tight types.** Question unnecessary optionality, `any`, `unknown`, cast-heavy code
  (agents love marking required props optional).
- **Parallelise** independent work serialised for no reason - but don't micro-optimise.
- **Prioritise output:** structural regressions at the top, legibility nits at the bottom; then approve/reject.

## Takeaways

- Ambition yields more false positives - but those are cheap to reject. The
  expensive ones are the improvements you never see.
- Weak spots: no mention of **tests** or **seams**, and the prompt is long and repetitive (could be much DRYer).
- On a real run (5 PRs), ~5/7 findings were genuinely worth fixing: an oversized
  file, scattered special-cases that belonged in a type, swallowed errors, a
  half-finished refactor.
