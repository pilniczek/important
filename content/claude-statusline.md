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

Clone it to `~/.claude/statusline/` on the Windows side, so it sits with the rest of the shared configuration and WSL reaches it through the same symlink pattern as skills and the output style - see [[global-agents-md-windows-wsl|Global AGENTS.md across Windows and WSL]]. One clone serves both operating systems, but each `settings.json` still names it in that OS's own terms, because the `statusLine` command is a path:

```json
{
  "statusLine": {
    "type": "command",
    "command": "node C:/Users/[USER]/.claude/statusline/statusline.js"
  }
}
```

## Two checkouts on purpose

The deployed clone is not where the tool is developed. Development happens in a normal WSL checkout, while `~/.claude/statusline/` is a separate clone that only ever gets pulled - the round trip through GitHub is drawn in [[global-agents-md-windows-wsl|Global AGENTS.md across Windows and WSL]]. Every session on both operating systems runs that second clone, so an experiment mid-edit cannot break the status line in the very session you are experimenting from.

The deployed clone was made over HTTPS deliberately: it needs no SSH key, which keeps it usable as a plain read-only consumer of the repo.

See the repo for setup, preview tiers, payload shape, and tunables:

- [pilniczek/claude-statusline on GitHub](https://github.com/pilniczek/claude-statusline) — [README](https://github.com/pilniczek/claude-statusline/blob/main/README.md) covers install + preview; [CLAUDE.md](https://github.com/pilniczek/claude-statusline/blob/main/CLAUDE.md) covers design rationale and the fallback chain.

---

Related: [[claude-code-workflow-tips|Claude Code workflow tips]] mentions the built-in `/statusline` command (which this script replaces).
