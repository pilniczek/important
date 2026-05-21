<!-- markdownlint-disable MD060 -->

# AGENTS.md

Briefing for AI coding agents working in this repository.

## Keep this file in sync (MUST)

**Update this file as part of any change that makes one of its statements stale** — any rule, convention, component API, build/CI fact, or shared primitive it references. AGENTS.md is the first thing the next agent reads; an out-of-date AGENTS.md gives bad signal that compounds across sessions. When a feature is removed entirely, **delete the section** rather than leaving a stale description. Reference [package.json](package.json), [quartz.config.ts](quartz.config.ts), [quartz.layout.ts](quartz.layout.ts), or specific source files (with line ranges where useful) instead of duplicating their contents — references stay accurate when the source changes.

## Git operations (state-changing commands require explicit ask)

**State-changing `git` commands MUST NOT run unless the user has explicitly asked for them in this turn.** That includes `git add`, `git commit`, `git restore`, `git checkout`, `git reset`, `git rebase`, `git merge`, `git push`, `git pull`, `git fetch`, `git stash`, `git tag`, `git config`, etc.

An explicit ask looks like "commit this", "stage these files", "push it", "rebase onto main". Ambient phrases like "we're done" or "ship it" do **not** count — confirm before reaching for a state-changing git command.

## Personal information (MUST NOT be published)

Anything that could be classified as **personal information** — the author's or anyone else's name, surname, phone number, email address, or any similar identifying detail — **MUST NOT** appear in published wiki content (anything under `content/` that ends up on the site at `baseUrl`).

If you encounter such content while editing, importing, or auditing, **pause and ask the user** for resolution. Don't silently redact, remove, or anonymize — the call (keep, strip, replace with a placeholder, leave a comment) belongs to the author.

## What this repo is

A personal wiki / knowledge base, originally exported from Notion, restructured into a folder-of-Markdown-files layout, and published as a static site via [Quartz 4](https://quartz.jzhao.xyz). Author / repo / homepage: see [package.json](package.json). Content is mixed English / Czech.

## Repository layout

Wiki content lives under [content/](content/) (every page is a flat `content/<slug>.md` file; assets live in shared subfolders such as `content/assets/`). Framework code is under [quartz/](quartz/) — `components/`, `plugins/`, `styles/`, `util/`. Site config is [quartz.config.ts](quartz.config.ts); layout wiring is [quartz.layout.ts](quartz.layout.ts); scripts and engine pins are in [package.json](package.json) (mirrored in `.nvmrc`); CI is in [.github/workflows/](.github/workflows/).

## Wiki content conventions

### Filename / folder rules

- **Every page is a flat `content/<slug>.md` file** — a direct child of `content/`. There are **no per-page folders and no nested page hierarchy**; the only subfolders under `content/` hold shared assets/config (`assets/`, `notion-assets/`, `lato-font/`, `.obsidian/`).
- **Slug format**: `[a-z0-9-]` only. Lowercase ASCII (the slug is the filename without `.md`).
- **Dashes are the only separator.** Multiple consecutive dashes collapse to one; no leading/trailing dashes.
- **Assets are referenced by filename**, Obsidian-style (`![[name.webp]]`), and resolved from the shared asset folders — not stored alongside each page.

### Frontmatter format

Every page file has YAML frontmatter; `title`, `tags`, `type`, `section`, `releaseDate` are required. The full set of fields and their types is declared in [plugins/transformers/frontmatter.ts](quartz/plugins/transformers/frontmatter.ts) (search for `interface DataMap` — source of truth).

**`tags`** is normalized by Quartz at parse time: single string → 1-element array, comma-separated string → split, non-strings filtered. Slugified via [`slugTag`](quartz/util/path.ts) (lowercase, spaces → hyphens), so `tags: [Start a project]` is exposed to components as `Start-a-project`.

**`type`** is a **single content-type string** (a legacy YAML array is tolerated — first entry wins):

```yaml
type: Tool
```

Canonical content types and their definitions live in [content/index.md](content/index.md) — single source of truth for the type list. Any other string renders as a generic neutral pill.

When auditing or assigning a type, follow the confidence rule: **a re-typing is "confident" only when (1) the current type's definition is clearly violated, AND (2) exactly one other canonical type fits unambiguously.** Anything else is borderline — flag for human review rather than auto-fix.

**`section`** is a **required, single-valued** enum — one of `Main` | `Archived` | `Utilities` — declaring where the page surfaces. It is a partition (every page is in exactly one section), so mutual exclusivity is structural, not a rule to remember. A missing/invalid value falls back to `Main` with a build warning ([frontmatter.ts](quartz/plugins/transformers/frontmatter.ts), search `section`). Section values are capitalized; their listing-page URLs are lowercased (`Archived` → `/archived`).

- **`Main`** — the default; appears on the homepage, folder, tag, and type listings.
- **`Archived`** — excluded from home/folder/tag listings; surfaced on `/archived`. Also appears on its content type's `/types/<X>` page (default-hidden behind the section dropdown).
- **`Utilities`** — excluded from home, folder, and tag listings; surfaced on `/utilities` **and** on its content type's `/types/<X>` page (default-hidden behind the section dropdown). (Utilities are _deleted_ when no longer useful, never archived.)

**`releaseDate`** is an ISO date (`YYYY-MM-DD`, e.g. `releaseDate: 2026-05-22`) marking when the page's content was last refreshed. Optional; add it when you make a substantive content update.

### Tags

Tags are **free-form** — no canonical list. Reusing existing tags matters more than inventing new ones; drift (e.g. `Skill` vs `skills`, `Human` vs `People`) fragments tag pages.

**Enumerate the current inventory** with `npm run tags:list` (defined in [package.json](package.json); script: [scripts/tags-list.mjs](scripts/tags-list.mjs)). Output is sorted by frequency and ends with a "Possible duplicates" section flagging case-insensitive and singular/plural collisions.

**Rules for assigning or adding a tag:**

- **Run `npm run tags:list` first.** If a reasonable match exists, reuse it — match the existing form exactly (including casing).
- **Case is significant.** [`slugTag`](quartz/util/path.ts) does not lowercase; `AI` and `ai` would render as two separate `/tags/…` pages.
- **Prefer singular over plural** when introducing a new tag (the collision detector treats `tag` and `tags` as the same concept).
- **Prefer the language already in use for that concept.** This repo is mixed English / Czech — don't introduce a translation of an existing tag (e.g. `Testování` next to `Testing`) without a deliberate reason.
- **One concept, one tag.** Synonyms (`Human` vs `People`, `Test` vs `Testing`) are **not** auto-detected by `tags:list` — those checks happen by eye.

When `tags:list` surfaces a case/plural collision, treat the fix as a **separate edit pass** — don't auto-rewrite tags during an unrelated change.

### Inline formatting

- **Inline code**: write as plain inline code — `` `/command` `` — never bold-wrapped like ``**`/command`**``.
- **Literal square brackets** (e.g. `Foo [GitHub]` where `GitHub` is a link): use HTML entities `&#91;` / `&#93;`, **not** backslash escapes `\[` / `\]`. Backslash escapes don't render reliably in Quartz/markdown-it. Precedent: [content/skills.md](content/skills.md).

### Linking conventions

- Internal page links: relative `[Foo](../foo/index.md)` from the source's directory.
- Same-folder asset embeds: `![alt](image.png)` — the asset sits in the page's own folder.
- Tag links: Quartz auto-creates `/tags/<slug>` pages from frontmatter `tags`; link to them as `[TagName](../tags/tagname/index.md)` if you need an in-body link.
- External URLs that should NOT be touched: `notion.so` / `notion.site` (external Notion references, kept intentionally despite containing UUIDs).

### Matrix-style pages

For pages whose subject is a matrix (2×2 quadrants, RACI tables, etc.), prefer text-source representations over embedded images:

- **2×2 quadrant matrices** (interest/influence, Eisenhower, BCG, etc.) → Mermaid `quadrantChart`. Quartz has Mermaid enabled via the ObsidianFlavoredMarkdown transformer ([quartz/plugins/transformers/ofm.ts](quartz/plugins/transformers/ofm.ts)).
- **Dense RACI / many-row matrices** → Markdown table (`quadrantChart` can't carry many rows).

When writing `quadrantChart` (working example: [content/matrix-stakeholders.md](content/matrix-stakeholders.md)):

- **Quote any label containing diacritics or special characters.** Mermaid 11.4's lexer throws `Lexical error` on unquoted Czech characters in axis/quadrant labels.
- **Single-label-per-axis, inline arrow style.** Wrap the dimension name with Unicode box-drawing dashes and a right-pointing pointer, e.g. `"─── Míra vlivu ───►"`. The y-axis label is rotated -90° by Mermaid, so the same `►` glyph automatically renders pointing up (low → high).
- Mermaid `quadrant-N` numbering: 1 = top-right, 2 = top-left, 3 = bottom-left, 4 = bottom-right.

**Dimensions are pinned globally** — the internal chart size lives in one constant, `DEFAULT_QUADRANT_SIZE` in [quartz/util/mermaid.ts](quartz/util/mermaid.ts), shared by the build-time renderer ([ofm.ts](quartz/plugins/transformers/ofm.ts)) and the client theme-toggle re-render ([mermaid.inline.ts](quartz/components/scripts/mermaid.inline.ts)) so they can't drift. The rendered on-page SVG display size is capped in [custom.scss](quartz/styles/custom.scss). Adjust there for a different standard size, not per-page.

**Quadrant colors come from CSS, not the chart.** Mermaid `%%{init}%%` theme-variable directives (e.g. `quadrant1Fill`) do **not** apply in this render path — `mermaid.inline.ts` re-`initialize`s per render and the directive's theme is dropped. To tint quadrants, target the `<rect>` `fill` presentation attribute with CSS (a plain rule overrides it, no `!important`). Quadrants render in q1..q4 order = top-right, top-left, bottom-left, bottom-right. Pages opt into a green↔red diagonal tint (yellow off-diagonal) by adding one of two `cssclasses` — `severity-matrix` (top-right q1 = worst = red; used by the risk pages, `matrix-decision`, `matrix-stakeholders`) or `opportunity-matrix` (top-right q1 = best = green; used by `matrix-eisenhower`, where "Do" is the goal corner). See the matching blocks in [custom.scss](quartz/styles/custom.scss). Opt in **only** where the top-right corner is unambiguously best or worst — not a typology grid whose four corners are independent categories rather than points on one good↔bad scale.

## Working in `quartz/`

### To add a new component

1. Create `.tsx` in `quartz/components/`.
2. If interactive: write `.inline.ts` in `scripts/`, attach via `Component.afterDOMLoaded = script`. Use `AbortController` + `window.addCleanup(() => ac.abort())` for SPA-safe event listeners (Quartz uses micromorph; listeners persist on morphed DOM unless removed).
3. If styled: write `.scss` in `styles/`, attach via `Component.css = style`. For helper components used by others (e.g. `Pill.tsx`), export the CSS string instead — consumers concat: `Owner.css = style + pillStyles`.
4. Export from [quartz/components/index.ts](quartz/components/index.ts).
5. Reference in [quartz.layout.ts](quartz.layout.ts).

### Shared building blocks

Reach for these instead of reinventing — they're the canonical primitives:

- [variables.scss](quartz/styles/variables.scss) — SCSS tokens (radii, breakpoints, weights).
- [\_colors.scss](quartz/styles/_colors.scss) — hue-keyed CSS custom-property palette, loaded globally via `base.scss`.
- [IconButton.tsx](quartz/components/IconButton.tsx) — shared icon-only `<a>`/`<button>` shell.
- [Pill.tsx](quartz/components/Pill.tsx) — pill primitives plus `TypePill` / `TagPillList` wrappers.

### Base SCSS structure (ITCSS via cascade layers)

Styling is organized as ITCSS using **CSS cascade layers (`@layer`)**, so priority follows the tier order regardless of source order or selector specificity — a low-specificity override in a later layer beats a high-specificity framework rule with **no `!important`**. The canonical order is declared once in the CSS emitter ([componentResources.ts](quartz/plugins/emitters/componentResources.ts), search `layerOrder`):

```css
@layer settings, generic, elements, objects, components, overrides;
```

Where each layer's rules come from:

- **settings** → [`_colors.scss`](quartz/styles/_colors.scss) palette (`variables.scss` is pure Sass, emits nothing).
- **generic** → [`_reset.scss`](quartz/styles/_reset.scss) (`html` / `body` / `::selection`).
- **elements** → [`_elements.scss`](quartz/styles/_elements.scss) (bare h1-h6, a, p, pre, table + content-adjacent rules like `.text-highlight`, `.footnotes`).
- **objects** → [`_layout.scss`](quartz/styles/_layout.scss) (`.page` grid + sidebars + `.flex-component` / `.desktop-only` / `.navigation-progress`).
- **components** → `syntax.scss`, `callouts.scss`, **and every component's `Component.css`** — the emitter wraps the whole component-CSS bundle in `@layer components {}`, so you do **not** add `@layer` to individual component SCSS.
- **overrides** → [`custom.scss`](quartz/styles/custom.scss), the highest layer (site-wide trumps).

[base.scss](quartz/styles/base.scss) is the manifest that `@use`s the global partials; each global partial wraps its own rules in its layer (`@layer generic { … }` etc.). When adding a global rule, put it in the partial for its tier; the layer wrapper is already there.

**Link policy (site-wide).** Links read as body text but underlined, with no background — [custom.scss](quartz/styles/custom.scss) sets `a:not(.pill):not(.icon-button)` to `color: inherit` + `text-decoration: underline` + `background: none`. Being in the `overrides` layer, it beats the per-component link colors / `text-decoration: none` **without `!important`**. Only pills (type/tag chips) and icon-only `.icon-button`s are exempt; if a link must opt out, give it a class and extend the exception list.

### CSS attachment pattern (`Component.css = style`)

Top-level layout components attach SCSS via `Component.css = style` (after `import style from "./styles/<name>.scss"`). This is the Quartz idiom — don't try to "simplify" it.

**Why it's like this:**

- **Per-page dead-code elimination.** Quartz collects `.css` only from components that actually render on a given page. Moving rules to `base.scss` loses this.
- **Composition with helper components.** Helpers like `Pill.tsx` export a CSS string and let consumers concat: `DatabaseView.css = style + pillStyles`. An auto-bound `import` would break this.

**Avoid:**

- **Side-effect imports** (`import "./styles/foo.scss"` with no binding). The esbuild-sass-plugin returns the compiled CSS as a string export; it doesn't inject anywhere, so the rules would silently disappear.
- **Template-literal CSS** (`` Component.css = `.foo { ... }` ``). This breaks SCSS variables (`$borderRadius` etc.), prettier formatting, and editor tooling. If you find this pattern, extract to a real `.scss` file when you next touch it (precedent: `TagList.tsx`).

### Search feature

Inline live-search in the TopBar — **not** the upstream Quartz Cmd+K modal. Files: [Search.tsx](quartz/components/Search.tsx), [scripts/search.inline.ts](quartz/components/scripts/search.inline.ts), [styles/search.scss](quartz/components/styles/search.scss). Index is a FlexSearch `Document` built once per session on the first `nav` event and held in module scope.

**Design decisions to preserve:**

- **Diacritics are significant.** The per-field `encode` tokenizer preserves Unicode letters — `cestina` does **not** match `čeština`. Don't "fix" this by lowercasing/folding.
- **`/` (slash) focuses the input** from anywhere on the page, unless focus is already in an `<input>` / `<textarea>` / `[contenteditable]`.
- SPA-morph reset: `<input>.value` survives `nav` events, so the bind resets it on each nav (same gotcha as "SPA morph navigation & form state" below).

### DatabaseView feature

"Notion-style" filterable table rendered on collection pages (root, folder indexes, `/types/<X>`, `/tags/<X>`, and the section pages `/archived` + `/utilities`). Pure logic in [util/databaseView.ts](quartz/util/databaseView.ts) (the `passes*Filter` helpers + `sectionOf`); orchestrator [DatabaseView.tsx](quartz/components/DatabaseView.tsx); rows [DatabaseRow.tsx](quartz/components/DatabaseRow.tsx); filter UI [DatabaseFilters.tsx](quartz/components/DatabaseFilters.tsx); client filter [scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts). Section semantics are defined under `section` above; the `passes*Filter` helpers enforce them by reading `frontmatter.section`. The `/archived` + `/utilities` pages are generated by [emitters/sectionPage.tsx](quartz/plugins/emitters/sectionPage.tsx) (registered in [quartz.config.ts](quartz.config.ts)); the topbar `ArchiveButton`/`UtilitiesButton` link to them — there is no hand-authored archive page.

**The second-column dropdown is polymorphic** — it filters whichever dimension _varies_ on the page (see `buildPrimaryFilter` in [DatabaseView.tsx](quartz/components/DatabaseView.tsx)): a **type** filter on root/folder/tag/section pages, and a **section** filter (All / Main / Archived / Utilities, default Main) on `/types/<X>` pages where the type is constant. The active dimension is signalled to the client via `data-filter-dim` on the `<select>`; [scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts) matches the chosen value against `data-type` or `data-section` accordingly.

**List pages render via `beforeBody`, not `pageBody`.** [quartz.layout.ts](quartz.layout.ts) wires DatabaseView into `defaultListPageLayout.beforeBody`; the `typePage`, `tagPage`, and `sectionPage` emitters use `pageBody: Content()` so any markdown the list page itself carries renders below the table. `TagContent` is retained only for the special-case `/tags` root (list-of-all-tags view).

**Collection-page emitters share boilerplate.** `typePage`, `tagPage`, and `sectionPage` ([plugins/emitters/](quartz/plugins/emitters/)) each enumerate their own slugs, then hand the resulting pages to the helpers in [emitters/collectionPage.ts](quartz/plugins/emitters/collectionPage.ts) (`buildCollectionPageOpts`, `collectionPageComponents`, `collectionPageContent`, `renderCollectionPages`). Keep that module page-kind-agnostic — enumeration lives in each emitter, not here. The type-slug → original-label lookup is `typeLabelsBySlug` in [util/databaseView.ts](quartz/util/databaseView.ts) (shared by `typePage` and `DatabaseView`).

### Back-link (in-page "back" navigation)

The top-of-page back control: component [BackLink.tsx](quartz/components/BackLink.tsx), behavior [scripts/backLink.inline.ts](quartz/components/scripts/backLink.inline.ts), style [styles/backLink.scss](quartz/components/styles/backLink.scss). `getBackLinkTarget(slug)` picks one of three **static** targets:

- **root** (`index`) → a plain `Wiki` `<h1>`, no link.
- **home** → tag / type / section / 404 pages (parent is the site root `/`), labeled "Home".
- **back** → article pages (parent is the Main home view), labeled "Main".

**History-aware rewrite.** The static href/label is only a fallback for direct loads. On in-app (SPA) navigation the click calls `history.back()` so it returns to the _actual_ previous page (this also preserves any DatabaseView filter params carried on that history entry). When you arrived from a known **listing** page, the script rewrites the label + fallback href to name it. Markers are built from `LISTING_SECTIONS` (`/archived`, `/utilities`) plus `/tags` — see `BACK_LINK_MARKERS` in [scripts/backLink.inline.ts](quartz/components/scripts/backLink.inline.ts). **To make the back-link name a new listing page, add a `{ slug, label }` marker there.** Referrer detection (`backLinkPreviousPath ?? document.referrer`) is shared with the DatabaseView client below — reuse it rather than adding a third copy.

### SPA morph navigation & form state (don't break this)

Quartz's SPA navigation morphs the DOM. Elements with stable IDs (including DatabaseView filter controls) are preserved across pages; only their `<option>` children are swapped, and the live `.value` is **not** reset — a value set on page A leaks onto page B and silently desyncs from the dropdown's apparent state.

**Rule:** at the top of every `bind()`, reset every filter via `resetSelectToDefault` / `resetInputToDefault` (reading `<option>.defaultSelected` / `<input>.defaultValue`) **before** `applyFilters()`. See [scripts/databaseView.inline.ts](quartz/components/scripts/databaseView.inline.ts) for the canonical implementation — including the URL-query mirroring convention. The back-link reuses the same referrer-detection pattern (see "Back-link" above).
