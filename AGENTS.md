# AGENTS.md

Briefing for AI coding agents working in this repository.

## What this repo is

A personal wiki / knowledge base, originally exported from Notion, restructured into a folder-of-Markdown-files layout, and published as a static site via [Quartz 4](https://quartz.jzhao.xyz).

- **Author**: Tomas Pilnaj (`pilnaj.t@gmail.com`)
- **Repo**: `pilniczek/important`
- **Site**: `https://pilniczek.github.io/important` (target — not yet deployed)
- **Page count**: ~339 `index.md` files
- **Languages in content**: mixed English / Czech (a tiny bit of Russian in legacy assets)

## Repository layout

```
important/
├── content/                   # the wiki — every page lives here
│   ├── index.md               # site root
│   ├── Archive/               # archived/older pages (linked from Wiki/index.md)
│   ├── Topics/                # tag landing pages (one folder per tag, mostly empty index.md)
│   └── Wiki-by-pilniczek/     # active knowledge base (~200 pages)
│
├── quartz/                    # Quartz framework code (treat as vendored — modify only when adding components or styles)
│   ├── components/
│   │   ├── DatabaseView.tsx           # ★ custom — Notion-style filterable table
│   │   ├── scripts/databaseView.inline.ts
│   │   ├── styles/databaseView.scss
│   │   └── index.ts                   # registers components, including DatabaseView
│   └── styles/custom.scss             # site-wide CSS overrides
│
├── public/                    # build output (gitignored)
├── wiki_original/             # raw Notion export, kept for reference (gitignored)
│
├── quartz.config.ts           # site title, baseUrl, plugins
├── quartz.layout.ts           # which components go in header / left / right / etc.
├── package.json               # `important-wiki`, scripts: dev, build, format, check
├── .nvmrc / .node-version     # Node 22
└── .gitignore                 # ignores wiki_original/, public/, node_modules/, .quartz-cache/
```

## Common commands

```bash
nvm use            # picks up .nvmrc → Node 22
npm run dev        # build + serve at http://localhost:8080 with hot reload
npm run build      # one-shot build to public/
npm run check      # tsc --noEmit + prettier --check
npm run format     # prettier --write
```

## Wiki content conventions

### Filename / folder rules

- **Every page is `<folder>/index.md`** — never a flat `Foo.md` at the parent level. The folder may also contain assets (images, PDFs) and child pages.
- **No spaces in folder/file names.** Spaces have been replaced with dashes (e.g. `Wiki-by-pilniczek/`, `Material-UI/`). The only file allowed to have a different name is `index.md` itself.
- Czech accented chars and other non-ASCII chars are preserved (`Cookie-lišta/`, `Vývojové-prostředí/`); they URL-encode to `%C5...` in links, which is fine.
- Multiple consecutive dashes were collapsed to single dash.

### Frontmatter format

Every `index.md` has YAML frontmatter, minimum:

```yaml
---
title: <Page Title>
---
```

Optional / common fields:

```yaml
---
title: Husky
tags:                     # array; Quartz auto-slugifies (Start a project → Start-a-project)
  - Linting
  - GitLab
type: Tutorial / How To   # Notion-style page type — drives the colored pill on the index DatabaseView
url: https://...          # external reference link, shown in URL column of the index
---
```

Supported `type` values (color-coded in the DatabaseView): `Tool`, `Tutorial / How To`, `Article`, `Code / Snippet`, `Course`, `Approach`. Other strings render as a generic neutral pill.

#### Type definitions and rules

| Type | Definition | Uniqueness |
|---|---|---|
| `Tool` | A page whose subject is a named 3rd-party library, framework, SaaS, font, or asset. Content can be a core-principles overview. Can be a collection of tools, a visual-only reference, or a cross-functional combination of two distinct tools. | **Unique per subject.** Cross-functional combos count as their own subjects. |
| `Tutorial / How To` | A page that walks through accomplishing a specific task. Action-oriented and reproducible; the spine is procedural/instructional. | Many per subject. |
| `Approach` | A page capturing a methodology, philosophy, framework, or set of principles — the "why" or "how to think about" something. Includes team/meeting practices and decision frameworks. | **Unique per subject.** |
| `Code / Snippet` | A page whose spine is reusable code/config, or a collection of related code recipes/commands clustered around one topic. | Many per subject. |
| `Course` | A page that primarily points to 3rd-party learning material. Qualifies via a `url:` frontmatter field, multiple external URLs in body, or embedded video/PDF. | No rule. |
| `Article` | User-authored content that was published on a 3rd-party blog. | No rule. |

When auditing or assigning a type, follow the confidence rule: **a re-typing is "confident" only when (1) the current type's definition is clearly violated, AND (2) exactly one other canonical type fits unambiguously, AND (3) the new type doesn't violate uniqueness.** Anything else is borderline — flag for human review rather than auto-fix.

Quartz **slugifies tag values** (lowercase, spaces → hyphens) when reading frontmatter, so `tags: [Start a project]` is exposed to components as `Start-a-project`. Display and filter values are consistent because they all come from the same normalized form.

### Linking conventions

- Internal page links: relative `[Foo](Foo/index.md)` from the source's directory.
- Same-folder asset embeds: `![alt](image.png)` — the asset sits in the page's own folder.
- Tag links: `[TagName](../Topics/TagName/index.md)` (Quartz also auto-creates `/tags/<slug>` pages).
- External URLs that should NOT be touched: `notion.so` / `notion.site` (they're external Notion references, kept intentionally despite containing UUIDs).

### Things that have been intentionally cleaned out (don't reintroduce)

- All Slack message links (`*.slack.com/...`)
- All GitLab links (`gitlab.com`, `gitlab.io`) — internal company repos that won't resolve publicly
- All Notion `notion.so/<uuid>` URLs that don't map to local content
- All UUIDs from filenames, folder names, and link paths (Notion-style `<Name> <32-hex>.md` is gone — only `notion.so/<uuid>` external URLs still contain UUIDs by necessity)
- All `.csv` files (Notion database exports — content was lifted into synthetic `<DB>/index.md` markdown tables)
- Personal-info trees (`Archive/People/<person>/`, `Archive/Pilnaj_2022-08-23-verified/`, `Archive/Webíci - original backup/Archive/People/`, `Archive/Webíci - original backup/Uchazeči/`) — only the `_TEMPLATE_SENIOR_-deprecated/` template scaffold remains
- All `Netlify` content (kept only third-party `*.netlify.app` URLs that happen to host external tools)

### Known false-positive patterns (don't "fix" them)

- `gitlab.com` mentioned as **prose** in `content/Wiki-by-pilniczek/Cookie-lišta/index.md` — it's about cookie banner design, not a hyperlink.
- Tag names with hyphens (`WAI-ARIA`, `react-hook-form`, `Material-UI`, `React-Query`) — some are original (`WAI-ARIA`), some are slugified (`Material UI` → `Material-UI`). A blanket "replace `-` with space" pass would break the legitimately-hyphenated ones.
- Russian alt-text on screenshot embeds (`![Снимок экрана](screenshot-247.png)`) — files were renamed to ASCII; the alt text is the original Notion description, harmless.
- `wiki_original/` exists at repo root but is `.gitignore`'d and only used as a fidelity reference.

## Custom Quartz components

### `DatabaseView` (root index only)

A Notion-style filterable table of every page directly under `Wiki-by-pilniczek/`. Configurable in `quartz.layout.ts`:

```ts
Component.DatabaseView({
  onlyOnSlug: "index",            // defaults to root; set to e.g. "Wiki-by-pilniczek/index"
  basePath: "Wiki-by-pilniczek/", // which folder's pages to enumerate
  directChildrenOnly: true,       // skip nested grandchildren
})
```

Returns `null` for any page where `fileData.slug !== onlyOnSlug`, so it's safe to leave in the shared content-page layout — it's a no-op everywhere else.

Files:
- `quartz/components/DatabaseView.tsx` — Preact server component (renders the table HTML at build time with all rows + filter UI)
- `quartz/components/scripts/databaseView.inline.ts` — client-side filter + sort, re-binds on every Quartz `nav` event (SPA navigation)
- `quartz/components/styles/databaseView.scss` — type-pill colors (light + dark mode), filter-bar layout

To add a new custom component:
1. Create `.tsx` in `quartz/components/` following the pattern of `Backlinks.tsx` (or `Graph.tsx` for components that need a bundled inline script + scss).
2. If interactive: write `.inline.ts` in `scripts/`, attach via `Component.afterDOMLoaded = script`.
3. If styled: write `.scss` in `styles/`, attach via `Component.css = style`.
4. Export from `quartz/components/index.ts`.
5. Reference in `quartz.layout.ts`.

## What NOT to do

- **Don't run `npx quartz create`** — it overwrites `content/index.md` with a blank welcome page and removes `README.md`. Only safe to run on a fresh install.
- **Don't commit `public/`, `node_modules/`, or `.quartz-cache/`** — `.gitignore` already excludes them.
- **Don't commit `wiki_original/`** — also gitignored. It's a 280 MB reference copy of the raw Notion export.
- **Don't reintroduce spaces in folder names** — every internal link rewrite would have to be redone.
- **Don't try to "humanize" tag display** by replacing hyphens with spaces blanket-style — see the false-positive note above.
- **Don't modify `quartz/` framework files** unless adding new components or fixing a real upstream bug. Quartz is treated as vendored; future upgrades are easier when the framework is unmodified.

## Build / publish notes

- `quartz.config.ts` has `baseUrl: "pilniczek.github.io/important"` — change before deploying anywhere else.
- `analytics: null` (no third-party analytics).
- `CustomOgImages` plugin is commented out (it's slow). Turn it back on if you want auto-generated social-media preview images.
- GitHub Pages workflow lives in `.github/workflows/` (from the Quartz template) — has not been customized yet.

## Backups on disk (outside the repo)

The host has several tarballs in `/tmp/` from intermediate cleanup steps. They're useful to consult if you suspect a regression but should not be relied on as long-term backups:

- `wiki-pre-restructure-backup.tar.gz` — original Notion export, pre-everything
- `wiki-pre-frontmatter.tar.gz` — after restructure + UUID strip, before frontmatter conversion
- `wiki-pre-csv-cleanup.tar.gz` — before deleting CSVs and synthesizing TOC index.md files
- `wiki-pre-extlink-strip.tar.gz` — before removing Slack/GitLab/Notion external links
- `wiki-pre-dashes.tar.gz` — before space-to-dash rename pass

These are scratch artifacts; the canonical source of truth is `wiki_original/` (raw Notion export) plus the current `content/` (cleaned wiki).

## Quick sanity checks

```bash
# every page reachable via internal links?
# every internal link target exists?
# (verified clean as of last commit; re-run after content edits)
find content -name 'index.md' | wc -l                      # ≈339
grep -rli 'slack\.com\|gitlab\.com\|notion\.so' content/   # only false-positive prose hits
find content -type d -name "* *"                            # should be empty (no spaces)
find content -type f -name '* *' -not -name 'index.md'      # should be empty
```
