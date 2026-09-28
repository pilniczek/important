---
title: claude-statusline
tags:
  - AI
  - Claude
  - Configuration
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

Clone it to `~/.claude/statusline/` and name it in `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node /home/[USER]/.claude/statusline/statusline.js"
  }
}
```

## Two checkouts on purpose

The deployed clone is not where the tool is developed. Development happens in a normal WSL checkout, while `~/.claude/statusline/` is a separate clone that only ever gets pulled: changes go up to GitHub from the development checkout and come back down with `git pull`. Every session runs that second clone, so an experiment mid-edit cannot break the status line in the very session you are experimenting from.

The deployed clone was made over HTTPS deliberately: it needs no SSH key, which keeps it usable as a plain read-only consumer of the repo.

See the repo for setup, preview tiers, payload shape, and tunables:

- [pilniczek/claude-statusline on GitHub](https://github.com/pilniczek/claude-statusline) — [README](https://github.com/pilniczek/claude-statusline/blob/main/README.md) covers install + preview; [CLAUDE.md](https://github.com/pilniczek/claude-statusline/blob/main/CLAUDE.md) covers design rationale and the fallback chain.

---

Related: [[claude-code-workflow-tips|Claude Code workflow tips]] mentions the built-in `/statusline` command (which this script replaces).
