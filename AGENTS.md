<!-- markdownlint-disable MD060 -->
# AGENTS.md

Briefing for AI coding agents working in this repository.

## Keep this file in sync (MUST)

**Update this file as part of any change that makes one of its statements stale.** AGENTS.md is the first thing the next agent reads — an out-of-date AGENTS.md gives bad signal that compounds across sessions.

You **MUST** update the relevant section when you:

- Add, rename, remove, or restructure a custom component, helper, or directory described here.
- Change a component's public API (props/options) or its render behavior.
- Add or remove a convention (frontmatter field, slug rule, linking pattern, etc.).
- Change build/publish setup, CI workflows, deployment targets, or the package manifest in a way mentioned here.
- Introduce a new shared primitive (mixin, token, util) or change one that's referenced here.

When a feature is removed entirely, **delete the section** rather than leaving a stale description. Reference [package.json](package.json), [quartz.config.ts](quartz.config.ts), [quartz.layout.ts](quartz.layout.ts), or specific source files (with line ranges where useful) instead of duplicating their contents — references stay accurate when the source changes.

## Personal information (MUST NOT be published)

Anything that could be classified as **personal information** — the author's or anyone else's name, surname, phone number, email address, or any similar identifying detail — **MUST NOT** appear in published wiki content (anything under `content/` that ends up on the site at `baseUrl`).

If you encounter such content while editing, importing, or auditing, **pause and ask the user** for resolution. Don't silently redact, remove, or anonymize — the call (keep, strip, replace with a placeholder, leave a comment) belongs to the author.

## What this repo is

A personal wiki / knowledge base, originally exported from Notion, restructured into a folder-of-Markdown-files layout, and published as a static site via [Quartz 4](https://quartz.jzhao.xyz). Author / repo / homepage: see [package.json](package.json). Content is mixed English / Czech.

## Repository layout

```text
important/
├── content/                # the wiki — every page is content/<slug>/index.md
│   ├── index.md            # site root
│                           # archived pages live across the wiki tagged `type: [..., Archived]`; surfaced on /types/archived
├── quartz/                 # framework code — customized Quartz, modifications allowed (see "Working in `quartz/`")
│   ├── components/         # Preact components
│   ├── plugins/            # transformers, filters, emitters
│   ├── styles/             # global SCSS — see "Base SCSS structure"
│   └── util/               # shared helpers
├── public/                 # build output (gitignored)
├── quartz.config.ts        # site config — source of truth (baseUrl, pageTitle, analytics, theme, plugins)
├── quartz.layout.ts        # which components render where on the page
├── package.json            # `scripts` (run `npm run <name>`), deps, Node engines pin (also in `.nvmrc`)
├── .github/workflows/      # CI — inspect YAMLs before changing
└── REVIEW.md               # one-shot code-quality review checklist (transient)
```

## Wiki content conventions

### Filename / folder rules

- **Every page is `content/<slug>/index.md`** — direct child of `content/`. The folder may also contain assets (images, PDFs); no nested page folders are currently used.
- **Slug format**: `[a-z0-9-]` only. Lowercase ASCII,
- **Dashes are the only separator.** Multiple consecutive dashes collapse to one; no leading/trailing dashes.
- The only file allowed to have a different basename than its folder is `index.md` itself; assets sit alongside (`group.png`, `screenshot.jpg`).

### Frontmatter format

Every `index.md` has YAML frontmatter; `title`, `tags`, `type` are required. The full set of fields and their types is declared in [plugins/transformers/frontmatter.ts](quartz/plugins/transformers/frontmatter.ts) (search for `interface DataMap` — that's the source of truth for what the consumer sees).

**`tags`** is normalized by Quartz at parse time: single string → 1-element array, comma-separated string → split, non-strings filtered. Slugified via [`slugTag`](quartz/util/path.ts) (lowercase, spaces → hyphens), so `tags: [Start a project]` is exposed to components as `Start-a-project`. Display and filter values stay consistent because they share the same normalized form.

**`type`** is a YAML list (block-style, like `tags`):

```yaml
type:
  - Tool
  - Archived
```

A scalar `type: Tool` and a flow array `type: [Tool, Archived]` are also accepted and coerced to a list, but block style is the canonical form. Canonical content types live in [content/index.md](content/index.md): `Tool` / `Tutorial / How To` / `Approach` / `Code / Snippet` / `Course` / `Article`. Any other string renders as a generic neutral pill. `Tool` and `Approach` are **unique per subject**; the rest can repeat.

`Archived` is a lifecycle marker, not a content type — combine it with another value (e.g. `type: [Tool, Archived]`). Pages with `Archived` are excluded from main and folder indexes and surfaced on `/types/archived` (the wiki's archive listing; reached via the topbar archive button).

When auditing or assigning a type, follow the confidence rule: **a re-typing is "confident" only when (1) the current type's definition is clearly violated, AND (2) exactly one other canonical type fits unambiguously, AND (3) the new type doesn't violate uniqueness.** Anything else is borderline — flag for human review rather than auto-fix.

### Linking conventions

- Internal page links: relative `[Foo](../foo/index.md)` from the source's directory.
- Same-folder asset embeds: `![alt](image.png)` — the asset sits in the page's own folder.
- Tag links: Quartz auto-creates `/tags/<slug>` pages from frontmatter `tags`; link to them as `[TagName](../tags/tagname/index.md)` if you need an in-body link.
- External URLs that should NOT be touched: `notion.so` / `notion.site` (external Notion references, kept intentionally despite containing UUIDs).

### Matrix-style pages

For pages whose subject is a matrix (2×2 quadrants, RACI tables, etc.), prefer text-source representations over embedded images:

- **2×2 quadrant matrices** (interest/influence, Eisenhower, BCG, etc.) → Mermaid `quadrantChart`. Quartz has Mermaid enabled via the ObsidianFlavoredMarkdown transformer ([quartz/plugins/transformers/ofm.ts](quartz/plugins/transformers/ofm.ts)).
- **Dense RACI / many-row matrices** → Markdown table (`quadrantChart` can't carry many rows).

When writing `quadrantChart`, follow these rules (see [content/matrix-stakeholders/index.md](content/matrix-stakeholders/index.md) for a working example):

- **Quote any label containing diacritics or special characters.** Mermaid 11.4's lexer throws `Lexical error` on unquoted Czech characters in axis/quadrant labels.
- **Single-label-per-axis, inline arrow style.** Wrap the dimension name with Unicode box-drawing dashes and a right-pointing pointer, e.g. `"─── Míra vlivu ───►"`. The y-axis label is rotated -90° by Mermaid, so the same `►` glyph automatically renders pointing up (low → high).
- Mermaid `quadrant-N` numbering: 1 = top-right, 2 = top-left, 3 = bottom-left, 4 = bottom-right.

**Dimensions are pinned globally** so every matrix renders at the same size regardless of label length: internal viewBox is set via `mermaid.initialize` in [quartz/components/scripts/mermaid.inline.ts](quartz/components/scripts/mermaid.inline.ts); rendered SVG display size is pinned by a rule in [quartz/styles/custom.scss](quartz/styles/custom.scss). Adjust there if you want a different standard size, not per-page.

## Working in `quartz/`

### To add a new component

1. Create `.tsx` in `quartz/components/`.
2. If interactive: write `.inline.ts` in `scripts/`, attach via `Component.afterDOMLoaded = script`. Use `AbortController` + `window.addCleanup(() => ac.abort())` for SPA-safe event listeners (Quartz uses micromorph; listeners persist on morphed DOM unless removed).
3. If styled: write `.scss` in `styles/`, attach via `Component.css = style`. For helper components used by others (e.g. `Pill.tsx`), export the CSS string instead — consumers concat: `Owner.css = style + pillStyles`.
4. Export from [quartz/components/index.ts](quartz/components/index.ts).
5. Reference in [quartz.layout.ts](quartz.layout.ts).

### Shared building blocks

Reach for these instead of reinventing — they're the canonical primitives:

- [variables.scss](quartz/styles/variables.scss) — SCSS tokens (radii, breakpoints, weights). Source of truth for token names and values.
- [_colors.scss](quartz/styles/_colors.scss) — hue-keyed CSS custom-property palette, loaded globally via `base.scss`.
- [IconButton.tsx](quartz/components/IconButton.tsx) — shared icon-only `<a>`/`<button>` shell.
- [Pill.tsx](quartz/components/Pill.tsx) — pill primitives plus `TypePill` / `TagPillList` wrappers.

### Base SCSS structure (ITCSS-lite)

[base.scss](quartz/styles/base.scss) is a thin manifest. Add new rules to the right layer:

- `_reset.scss` — `html` / `body` / `::selection` resets only.
- `_elements.scss` — bare element styles (h1-h6, a, p, pre, table, etc.) and content-adjacent rules (`.text-highlight`, `.footnotes`, `.transclude`, `.external-embed`).
- `_layout.scss` — `.page` grid + sidebars + chrome (`.flex-component`, `.desktop-only` / `.mobile-only`, `.navigation-progress`).

Site-wide overrides live in [custom.scss](quartz/styles/custom.scss) (loaded via `@use "./base.scss"`). Component-specific styles stay with their component under `quartz/components/styles/`.

### CSS attachment pattern (`Component.css = style`)

Top-level layout components attach SCSS via `Component.css = style` (after `import style from "./styles/<name>.scss"`). This is the Quartz idiom — don't try to "simplify" it.

**Why it's like this:**

- **Per-page dead-code elimination.** Quartz collects `.css` only from components that actually render on a given page. Moving rules to `base.scss` loses this.
- **Composition with helper components.** Helpers like `Pill.tsx` export a CSS string and let consumers concat: `DatabaseView.css = style + pillStyles`. An auto-bound `import` would break this.

**Avoid:**

- **Side-effect imports** (`import "./styles/foo.scss"` with no binding). The esbuild-sass-plugin returns the compiled CSS as a string export; it doesn't inject anywhere, so the rules would silently disappear.
- **Template-literal CSS** (`` Component.css = `.foo { ... }` ``). This breaks SCSS variables (`$borderRadius` etc.), prettier formatting, and editor tooling. If you find this pattern, extract to a real `.scss` file when you next touch it (precedent: `TagList.tsx`).

### DatabaseView feature

DatabaseView is the "Notion-style" filterable table rendered on collection pages (root, folder indexes, `/types/<X>`, `/tags/<X>`). The pure logic lives in [util/databaseView.ts](quartz/util/databaseView.ts); the orchestrator in [DatabaseView.tsx](quartz/components/DatabaseView.tsx); row rendering in [DatabaseRow.tsx](quartz/components/DatabaseRow.tsx); filter UI in [DatabaseFilters.tsx](quartz/components/DatabaseFilters.tsx); client-side filter in [scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts).

**Archived lifecycle.** `Archived` is a value in the `type` array (e.g. `type: [Tool, Archived]`), not a content type of its own. Per-mode handling:

| Mode | Archived rows |
|---|---|
| Root + folder indexes | excluded (`passesFolderFilter`) |
| `/types/<X>` (X ≠ archived) | mixed; an "Active" filter is offered, preselected unless the user arrived from `/types/archived` |
| `/tags/<X>` | excluded (`passesTagFilter`) — tags are orthogonal to lifecycle |
| `/types/archived` | only archived; title rendered as "Archive" (special-cased in `typePage.tsx`) |

The topbar `ArchiveButton` links to `/types/archived`. There is no longer a hand-authored `/archive` page.

**Active-filter sentinel.** `DatabaseFilters` emits an `<option value="__active__">Active</option>` when the row set is mixed (archived + active). The inline filter script translates this sentinel to "rows whose `data-type` does not contain `archived`". Two consumers — keep them in sync.

**Hide-pill suppression.** On `/types/<X>` and `/tags/<X>`, the row pill and filter-dropdown option matching the active collection are suppressed (they'd repeat on every row). `DatabaseRow` accepts `hideTypePill` / `hideTag` props; `aggregateFilters` accepts matching `excludeType` / `excludeTag` args.

**List pages render via beforeBody, not pageBody.** [quartz.layout.ts](quartz.layout.ts) wires DatabaseView into `defaultListPageLayout.beforeBody`. The `typePage` and `tagPage` emitters use `pageBody: Content()` so any markdown the page itself carries renders below the table. `TagContent` is retained only for the special-case `/tags` root (list-of-all-tags view).

### SPA morph navigation & form state (don't break this)

Quartz's SPA navigation morphs the DOM. Elements with stable IDs — including our `DatabaseView` filter controls — are preserved across pages; only their `<option>` children are swapped. The live `.value` is **not** reset, so a value set by script on page A (e.g., `"Archived"` from the archive-context override) leaks onto page B and silently desyncs from the dropdown's apparent state.

[scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts) normalizes every filter via `resetSelectToDefault` / `resetInputToDefault` at the top of each `bind()`, reading `<option>.defaultSelected` and `<input>.defaultValue` (which always reflect the *current* page's SSR intent). These must run **before** `applyArchiveContextOverride` and the first `applyFilters()`. Add matching resets for any new filter control.

**Archive-context provenance.** Two inline scripts independently track `previousPath` and use the same `cameFromArchive()` helper (referrer-or-previousPath includes `/types/archived`): [scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts) uses it to auto-select the "Archived" type filter on the next collection page, and [scripts/backLink.inline.ts](quartz/components/scripts/backLink.inline.ts) uses it to repoint the article-page back arrow at `/types/archived`. The two scripts each maintain their own `previousPath` — both listen to the same `nav` event so they stay in sync. Any new archive-context behaviour should reuse this convention rather than introduce a third copy.
