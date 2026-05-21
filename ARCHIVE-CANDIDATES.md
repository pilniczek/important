# Archive candidates — wiki sweep

## Context

Goal: surface unarchived articles that are no longer useful for everyday work, so the wiki stays focused on "things I actually need now". Current professional context: senior FE engineer at greencode.cz on the **DISE** stack — Electron + React + styled-components + custom CSS `vw()` scaling for Škoda touchtable apps — plus modern React/Next.js on the web side and Cypress for testing. Active interests also include Claude Code tooling.

Filter applied: drop articles whose topic is (a) a personal hobby with no obvious recurring need, (b) tech moved away from, or (c) one-off setup notes that have served their purpose. Keep anything still load-bearing for current FE work, team practices, or AI tooling.

> **Update (2026-05-28):** The hobby / personal-infra bucket below is no longer being archived. A new `Utilities` lifecycle marker was added — these pages now carry `type: [..., Utilities]` and are surfaced on [/types/utilities](content/types/utilities/index.md) via the topbar utilities button. Utilities are deleted (not archived) when they go stale. See [AGENTS.md](AGENTS.md) and [content/index.md](content/index.md) for the lifecycle-marker rules. The borderline / dated-tech list further down is still genuine archive material — revisit separately.

## Approach

- Catalogued all 171 unarchived `content/*.md` articles via frontmatter + opening-paragraph skim.
- Cross-referenced against the professional profile (DISE Electron product + modern React/Next).
- Routed candidates between the two lifecycle markers per [AGENTS.md](AGENTS.md):
  - **`Archived`** — work-relevant content that's gone stale (kept for retrieval on `/types/archived`).
  - **`Utilities`** — non-professional / personal-life content (kept hidden from the wiki proper, surfaced on `/types/utilities`, *deleted* when stale rather than archived).
  - **Mutually exclusive** — no `[..., Utilities, Archived]`.
- Conservative default: if it could plausibly help tomorrow, leave it active.

## Reclassified as `Utilities` (12 — applied 2026-05-28)

These pages were originally proposed for archival but instead got the new `Utilities` marker (combined with their existing content type). They live on [/types/utilities](content/types/utilities/index.md) and no longer appear in the main wiki or tag pages.

Hobby / non-work topics:

- [content/fallout-4-console-codes.md](content/fallout-4-console-codes.md) — gaming reference
- [content/gog.md](content/gog.md) — GOG store / gaming
- [content/music-resources.md](content/music-resources.md) — music links
- [content/noeverse.md](content/noeverse.md) — niche tool, no FE / day-to-day tie
- [content/obs-studio.md](content/obs-studio.md) — streaming/recording
- [content/prusaslicer.md](content/prusaslicer.md) — 3D-printing slicer
- [content/stl-thumbnails-on-windows.md](content/stl-thumbnails-on-windows.md) — 3D-printing accessory tooling
- [content/unigine-superposition.md](content/unigine-superposition.md) — GPU benchmark

Personal-infra (moved here from "Explicit keep" — they're useful for daily life, not FE work):

- [content/nas.md](content/nas.md) — NAS / Synology
- [content/independent-vpn.md](content/independent-vpn.md) — VPN setup pointer
- [content/hdd-tips.md](content/hdd-tips.md) — Diskpart
- [content/mdns.md](content/mdns.md) — mDNS protocol notes

## Round 2 candidates (2026-05-29)

After Round 1's 55 Archived + 11 Utilities, surveyed the remaining 153 active articles against the established pattern. Spot-verified each candidate before listing to avoid name-collision mis-calls.

### Move to Utilities (1)

- [content/mtg.md](content/mtg.md) — Magic: The Gathering hobby content; parallels `fallout-4-console-codes` / `gog` / `music-resources`.

### Move to Archived (9)

**MUI cluster** — MUI is no longer in the current DISE stack (styled-components is), and `4-start-a-project-material-ui` / `formik-and-mui-integration` are already archived:

- [content/material-ui.md](content/material-ui.md) — v4 docs pointer + Gatsby example, stack-obsolete on both axes
- [content/troubleshooting-mui.md](content/troubleshooting-mui.md) — MUI-specific debugging
- [content/typescript-mui.md](content/typescript-mui.md) — MUI+TS patterns
- [content/cssinjs-emotion-mui.md](content/cssinjs-emotion-mui.md) — Emotion was MUI's runtime; styled-components is the current choice (`cssinjs` / `cssinjs-linaria-non-mui` already archived)

**Past-era tooling / essays not in the current toolchain:**

- [content/fractal.md](content/fractal.md) — design-system docs tool, not used in DISE
- [content/pwa-x-webview-x-react-native.md](content/pwa-x-webview-x-react-native.md) — mobile-app delivery comparison; sibling `setup-for-android-twa` already archived
- [content/we-have-tried-gitpod-a-cloud-based-development-en.md](content/we-have-tried-gitpod-a-cloud-based-development-en.md) — cloud-IDE trial post; local Windows dev now
- [content/modern-web-builders-or-classy-code.md](content/modern-web-builders-or-classy-code.md) — Czech architecture essay tied to a past era
- [content/directus-cms-self-hosted-on-fly-io.md](content/directus-cms-self-hosted-on-fly-io.md) — Directus self-host walkthrough; mirrors the already-archived `sanity-cms`

### Borderline (4) — flag for human call

**CodePen cluster** — was the demo toolchain of an older era (many MUI/Formik examples lived there); archive if no longer in active use:

- [content/codepen.md](content/codepen.md)
- [content/codepen-snippets.md](content/codepen-snippets.md)
- [content/codepen-template.md](content/codepen-template.md)

**Corporate setup note:**

- [content/jfrog-npm-vscode-setup.md](content/jfrog-npm-vscode-setup.md) — JFrog private-registry setup; archive if not on a project using JFrog now.

### Correction notes (Round-1 mis-calls)

- `noeverse` — verified as an AI/research tool with `releaseDate: 2026-05-28`. **Active, keep.** My initial Round-1 catalog wrongly bucketed it under hobby.
- `obsidian-and-tolaria` — covers two **note-taking apps** (Obsidian + a markdown editor called Tolaria), tagged `AI / GIT / IDE`. Not MTG-related despite the name collision with the Tolaria card. **Active, keep.**

### Round-2 counts

Active set surveyed: 153. Move to Utilities: 1. Move to Archived: 9. Borderline: 4. Keep: 139.

---

## Round 1 — Borderline list (status: largely applied)

Listed with the reason — sanity-check before bulk-archiving.

**Looks dated / superseded:**

- [content/code-copy-paste.md](content/code-copy-paste.md) — old IDE-import workaround; modern IDEs auto-resolve, no longer a daily problem
- [content/es5-vs-es6.md](content/es5-vs-es6.md) — ES6 is the baseline; comparison no longer useful in 2026
- [content/storing-function-reference-into-the-state-without.md](content/storing-function-reference-into-the-state-without.md) — extremely narrow React tip, dated phrasing
- [content/requestly.md](content/requestly.md) — HTTP-modification tool comparison; only useful while actively mocking that way
- [content/fractal.md](content/fractal.md) — component-library tool (just a single link); unclear it's in active toolchain
- [content/ml-for-frontend-developers.md](content/ml-for-frontend-developers.md) — course pointer; the ML/FE landscape has moved on hard

**One-off / OS-specific setup notes (done once, then forgotten):**

- [content/running-scripts-on-windows.md](content/running-scripts-on-windows.md) — Windows execution-policy setup
- [content/windows-update-errors.md](content/windows-update-errors.md) — one-off Windows fix
- [content/development-in-wsl.md](content/development-in-wsl.md) — only useful if actively in WSL
- [content/jednotky-rem.md](content/jednotky-rem.md) — verify it's not a load-bearing CSS-units note before archiving

**Backend / infra outside the FE day-job:**

- [content/zapier.md](content/zapier.md) — automation SaaS, not FE-stack
- [content/localazy.md](content/localazy.md) — i18n SaaS; archive only if not used on the web side
- [content/timezone-issue-openapigenerator.md](content/timezone-issue-openapigenerator.md) — `openapi-generator` is in active use (separate article kept), but this is a specific bug-fix note; archive if the bug is long-resolved

## Explicit keep — even though they pattern-match "archive"

Flagging a few that look archiveable on first glance but are likely still useful:

- [content/wcag.md](content/wcag.md) — accessibility; still general FE knowledge worth indexed
- [content/seo.md](content/seo.md) — keep if any active web property cares about SEO
- [content/lato-font.md](content/lato-font.md) — verify whether it's a load-bearing asset reference

(Personal-infra notes — `nas`, `independent-vpn`, `hdd-tips`, `mdns` — were moved to the Utilities bucket above.)

## How to apply

The borderline list above is all `Archived` material (work-relevant but stale). For each, edit its frontmatter `type` list to add `Archived` (canonical block style per [AGENTS.md](AGENTS.md)):

```yaml
type:
  - Tool         # or whatever it already is
  - Archived
```

Lifecycle-marker rules (from AGENTS.md):

- `Archived` and `Utilities` are markers, not content types — always combined with a canonical type, never on their own.
- The two are **mutually exclusive** — `type: [..., Utilities, Archived]` is invalid.
- `Archived` pages are hidden from main and folder indexes, surfaced on `/types/archived`. Files preserved for retrieval.
- `Utilities` pages are hidden from main, folder, tag, **and** every other `/types/<X>` page, surfaced only on `/types/utilities`. Deleted (not archived) when stale.

Do **not** delete the borderline articles. Archiving keeps them retrievable.

## Verification

After applying:

1. `npm run build` (or `npm run serve` for live preview) — confirm no parse errors.
2. Visit `/types/archived` in the dev server — every newly archived article should appear there.
3. Spot-check that archived pages no longer appear on the wiki root or on their respective `/tags/<tag>` pages.
4. `npm run tags:list` — confirm no tag pages went from N to 0 unexpectedly.

## Out of scope

- Actually editing the frontmatter — needs explicit go-ahead.
- Deleting articles — archive only.
- Reorganising tags or types — separate audit pass.
- Second-pass scrutiny of the 141 "keep" articles — only if a tighter cut is wanted.
