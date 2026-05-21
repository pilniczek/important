// First-nav fallback is `document.referrer`. Mirrors the `previousPath` /
// `detectMarkerFromReferrer` pattern in databaseView.inline.ts; names are
// prefixed because all `.inline.ts` files share a single TS-script global scope.
let backLinkPreviousPath: string | null = null

type BackLinkMarker = { slug: string; label: string }
const BACK_LINK_MARKERS: readonly BackLinkMarker[] = [
  { slug: "archived", label: "Archived" },
  { slug: "utilities", label: "Utilities" },
]

function backLinkDetectMarker(): BackLinkMarker | null {
  const ref = backLinkPreviousPath ?? document.referrer
  if (!ref) return null
  return BACK_LINK_MARKERS.find((m) => ref.includes(`/types/${m.slug}`)) ?? null
}

function backLinkReferrerIsSameOrigin(): boolean {
  const ref = document.referrer
  if (!ref) return false
  try {
    return new URL(ref).origin === window.location.origin
  } catch {
    return false
  }
}

document.addEventListener("nav", () => {
  // Capture the PREVIOUS nav's pathname before the bottom of this handler
  // overwrites it. Non-null means we've had at least one prior SPA navigation
  // in this session — so history.back() will land on a same-origin entry that
  // already carries any DatabaseView filter params (written via replaceState
  // in databaseView.inline.ts).
  const arrivedViaSpa = backLinkPreviousPath !== null

  const backLink = document.querySelector<HTMLAnchorElement>("a.back-link-table")
  const fromMarker = backLinkDetectMarker()
  if (backLink && fromMarker) {
    const rootHref = backLink.href.endsWith("/") ? backLink.href : backLink.href + "/"
    backLink.href = rootHref + `types/${fromMarker.slug}`
    const label = backLink.querySelector<HTMLElement>(".back-link-label")
    if (label) label.textContent = fromMarker.label
    backLink.setAttribute("aria-label", `Back to ${fromMarker.slug}`)
    backLink.setAttribute("title", `Back to ${fromMarker.slug}`)
  }

  if (backLink) {
    const canUseHistoryBack = arrivedViaSpa || backLinkReferrerIsSameOrigin()
    const ac = new AbortController()
    backLink.addEventListener(
      "click",
      (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey) return
        if (!canUseHistoryBack) return
        if (window.history.length <= 1) return
        // Beat the SPA router's window-level click listener (spa.inline.ts)
        // so it doesn't push a fresh history entry to the static href.
        event.preventDefault()
        event.stopImmediatePropagation()
        window.history.back()
      },
      { signal: ac.signal },
    )
    window.addCleanup(() => ac.abort())
  }

  backLinkPreviousPath = window.location.pathname
})
