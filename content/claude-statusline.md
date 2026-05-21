---
title: claude-statusline
tags:
  - AI
  - Claude
type: How To
section: Main
releaseDate: 2026-05-22
---

A custom Claude Code status line: project name, model, and a context-usage bar scaled to a fixed 100k-token "smart zone". Single Node.js file, no dependencies, no build step.

```bash
📁 important │ Opus 4.7 (1M) │ 0% ▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱ 15% out of 100k
```

## Why a fixed smart zone

The bar is scaled to 100k tokens regardless of the model's real context window. On a 1M-context model, 15% of the actual window is already a lot of context — enough that response quality starts to drift. The bar tracks a "you should care" budget, not the technical maximum. Past 100%, the label just keeps climbing.

Bar colors are positional, not value-based: green at the start, yellow in the middle, red at the end — a full bar always shows all three. The gradient is a ruler, not a mood ring.

## Install, preview, configure

See the repo for setup, preview tiers, payload shape, and tunables:

- [pilniczek/claude-statusline on GitHub](https://github.com/pilniczek/claude-statusline) — [README](https://github.com/pilniczek/claude-statusline/blob/main/README.md) covers install + preview; [CLAUDE.md](https://github.com/pilniczek/claude-statusline/blob/main/CLAUDE.md) covers design rationale and the fallback chain.

---

Related: [[claude-code-workflow-tips|Claude Code workflow tips]] mentions the built-in `/statusline` command (which this script replaces).
