# Plan: Convert the wiki to a PWA with offline fallback

## Context

This is a Quartz 4 personal wiki (223 markdown pages → static HTML in [public/](public/)) deployed to GitHub Pages at `pilniczek.github.io/important`. The user wants a Progressive Web App with **network-first, fall back to stored data** behavior so the wiki stays usable offline (subway, plane, flaky wifi).

Today the SPA router at [quartz/components/scripts/spa.inline.ts:65](quartz/components/scripts/spa.inline.ts#L65) calls `fetchCanonical()` and on failure falls back to `window.location.assign(url)` ([line 74-75](quartz/components/scripts/spa.inline.ts#L74-L75)) — i.e. a hard reload that *also* fails offline. There is no service worker, no `manifest.webmanifest`, no PWA plugin. Clean slate.

The elegant bit: with a service worker handling fetch, **no SPA code change is needed**. Both the SPA's `fetchCanonical()` and the fallback hard reload pass through the SW, which serves cached HTML when the network is down.

## Approach

Add one Quartz emitter plugin that drops the service worker + web app manifest + icons into `public/` at build time, and wire SW registration into [Head.tsx](quartz/components/Head.tsx). Three files touched, one new file, no runtime SPA changes.

### 1. New emitter: `quartz/plugins/emitters/pwa.ts`

Emits at build time:

- **`sw.js`** — the service worker, with a build-time–generated **precache manifest** baked into the source as a `const PRECACHE = [...]` array. Behavior:
  - **`install`** event → opens the versioned cache and fetches every URL in `PRECACHE`. Includes: every emitted HTML page (one per content slug, plus the tag/folder/type/404/index pages), `static/contentIndex.json`, the manifest, both icons, and the inline-script bundles emitted by `ComponentResources`. SW does not finish installing until the precache fully populates, so once activated, the entire wiki works offline.
  - **`activate`** event → deletes any cache whose name doesn't match the current version stamp.
  - **`fetch`** event strategies by request type:
    - **Navigations / HTML pages** → network-first, fall back to cache. Successful network responses overwrite the cached copy so users see the latest content when online.
    - **Search index** (`static/contentIndex.json` produced by [contentIndex.tsx](quartz/plugins/emitters/contentIndex.tsx)) → network-first, fall back to cache. Already in precache from install, so search works offline from the very first activation.
    - **Hashed static assets** under `static/` (CSS, JS, images, fonts) → cache-first. Filenames are content-stable.
    - **Cross-origin (Google Fonts CDN)** → stale-while-revalidate.
  - Cache name includes a **build-time version stamp** (timestamp injected into the SW source string) so each deploy invalidates old caches and triggers a new precache pass.
- **`manifest.webmanifest`** — `name` from `cfg.configuration.pageTitle` ("Wiki by pilniczek"), `scope` and `start_url` derived from `cfg.configuration.baseUrl`, theme/background colors from `cfg.theme.colors.lightMode`, two icon sizes (192, 512).
- **`icon-192.png` and `icon-512.png`** — resized from [quartz/static/icon.png](quartz/static/icon.png) using `sharp`, copying the pattern in [favicon.ts:11-19](quartz/plugins/emitters/favicon.ts#L11-L19).

Register the emitter in [quartz/plugins/emitters/index.ts](quartz/plugins/emitters/index.ts) and add `Plugin.PWA()` to the emitters array in [quartz.config.ts:76-98](quartz.config.ts#L76-L98).

### 2. Wire SW + manifest into the page head

Edit [quartz/components/Head.tsx](quartz/components/Head.tsx) right after the `<link rel="icon">` at [line 41](quartz/components/Head.tsx#L41):

- `<link rel="manifest" href={joinSegments(baseDir, "manifest.webmanifest")} />`
- `<meta name="theme-color" content="..."/>` using `cfg.theme.colors.lightMode.light`
- An inline `<script>` that registers the SW relative to `document.baseURI` (handles the `/important/` GitHub Pages subpath without hardcoding):

  ```html
  <script>
    if ('serviceWorker' in navigator) {
      addEventListener('load', () => {
        navigator.serviceWorker.register(new URL('sw.js', document.baseURI));
      });
    }
  </script>
  ```

### 3. Building the precache manifest

The emitter runs after the page-emitting emitters in `quartz.config.ts`, so it can read the `BuildCtx` to know which slugs were emitted. Two practical sources:

- **From `ctx.allFiles` / `ctx.allSlugs`** — the slug list Quartz already populates and that [contentIndex.tsx](quartz/plugins/emitters/contentIndex.tsx) iterates. Each slug maps to `<slug>/index.html`.
- **Plus fixed extras** — `index.html`, `404.html`, `static/contentIndex.json`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, and the `prescript.js` / `postscript.js` / `index.css` bundles emitted by `ComponentResources`.

The emitter inlines this list as a JS array literal into the `sw.js` source string before `write()`-ing it. The 223-page corpus + assets is roughly a few MB total — acceptable for a deliberate "install" action.

Image assets embedded inside content pages (e.g. screenshots under `content/issue/`, `content/semantic-commit-messages/`) are **not** included in the precache to keep first-install size bounded; they fall through to runtime cache-first on first view of their containing page.

## Files to touch

- **New**: `quartz/plugins/emitters/pwa.ts`
- **Edit**: [quartz/plugins/emitters/index.ts](quartz/plugins/emitters/index.ts) — export `PWA`
- **Edit**: [quartz.config.ts:76-98](quartz.config.ts#L76-L98) — add `Plugin.PWA()` to `emitters[]`
- **Edit**: [quartz/components/Head.tsx:41](quartz/components/Head.tsx#L41) — add manifest link, theme-color meta, SW registration script

## Reused utilities

- `write()` from [quartz/plugins/emitters/helpers.ts](quartz/plugins/emitters/helpers.ts) — for emitting the SW, manifest, and icons
- `sharp` icon-resize pattern from [favicon.ts:7-22](quartz/plugins/emitters/favicon.ts#L7-L22)
- `cfg.configuration.baseUrl` and `cfg.configuration.pageTitle` from [quartz.config.ts](quartz.config.ts) — for manifest fields
- `joinSegments`, `pathToRoot` from [quartz/util/path](quartz/util/path.ts) (already imported in [Head.tsx:2](quartz/components/Head.tsx#L2))

## Verification

1. **Build:** `npm run build` → confirm `public/sw.js`, `public/manifest.webmanifest`, `public/icon-192.png`, `public/icon-512.png` appear.
2. **Local dev:** `npm run dev`, open DevTools → **Application → Service Workers**: SW registered, scope correct. **Application → Manifest**: parses, both icons load.
3. **Offline navigation:** load the site once online, wait for SW status to flip to "activated" in DevTools, then toggle **Network → Offline**. Navigate to a page you have **never visited before** (e.g. via search or a deep link) — it should serve from precache. Reload — same. Click around — SPA navigation should never hit a "no internet" page.
4. **Offline search:** with Network still offline, open the search box and type — results come from the precached `contentIndex.json`, no first-online-search needed.
5. **Lighthouse PWA audit:** "installable" and "works offline" both pass.
6. **Production check:** deploy and repeat (3) on the live `pilniczek.github.io/important` URL — confirms SW scope works under the subpath.

## Caveats worth knowing up front

- **GitHub Pages subpath:** SW scope will be `/important/`, set automatically by registering relative to `document.baseURI`. Do **not** register with a leading-slash absolute path — it'd resolve to `pilniczek.github.io/sw.js` which doesn't exist.
- **Cache invalidation on deploy:** the build-timestamp baked into `sw.js` is what causes browsers to detect a new SW version and re-fetch updated pages. Without it, users would be stranded on stale cache forever.
- **Google Fonts:** cached on first online load via stale-while-revalidate. If you ever want the wiki to look right offline on first load too, that's a separate change to `cfg.theme.fontOrigin` to self-host fonts.
- **Update UX:** when a new SW activates, currently-open tabs may still show the old page until a refresh. This is normal SW behavior; could be improved later with a "new version available — reload?" toast.
