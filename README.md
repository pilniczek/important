# important

Personal wiki — knowledge base and notes. A folder of Markdown files published as a static
site with [Quartz 4](https://quartz.jzhao.xyz), live at
[pilniczek.github.io/important](https://pilniczek.github.io/important). Content is mixed
English / Czech.

## Layout

- `content/` — the wiki: one flat `content/<slug>.md` per page, shared assets in subfolders
- `quartz/` — framework code: components, plugins, styles, util
- `quartz.config.ts` — site config (plugins, theme, base URL)
- `quartz.layout.ts` — which components render where
- `scripts/` — maintenance scripts: tag inventory, image/video optimization, agent env bootstrap

## Working here

```bash
npm run dev      # build and serve locally with hot reload
npm run build    # build the static site into public/
npm run check    # tsc --noEmit + prettier --check
npm run format   # prettier --write
```

Node 22 or newer, pinned in [.nvmrc](.nvmrc) and [package.json](package.json). Deployment is
automatic from `main` via [.github/workflows/deploy.yaml](.github/workflows/deploy.yaml).

## For agents

[AGENTS.md](AGENTS.md) is the canonical briefing — architecture, content conventions,
frontmatter rules, tagging rules, and the styling primitives. Read it before editing
anything here.
