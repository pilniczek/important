import { LISTING_SECTIONS } from "../../util/sections"

// See AGENTS.md "Back-link" for the design. Names are prefixed because all
// `.inline.ts` files share one TS-script global scope.

// Previous SPA nav's pathname (first-nav fallback is `document.referrer`).
let backLinkPreviousPath: string | null = null

// Listing pages a back-nav can be labeled with. Add a marker to name a new one.
type BackLinkMarker = { slug: string; label: string }
const BACK_LINK_MARKERS: readonly BackLinkMarker[] = [
  ...LISTING_SECTIONS.map((s) => ({ slug: s.slug, label: s.value })),
  { slug: "tags", label: "Tags" },
]

function backLinkDetectMarker(): BackLinkMarker | null {
  const ref = backLinkPreviousPath ?? document.referrer
  if (!ref) return null
  return BACK_LINK_MARKERS.find((m) => ref.includes(`/${m.slug}`)) ?? null
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
  // Non-null => at least one prior SPA nav this session, so history.back() is safe.
  const arrivedViaSpa = backLinkPreviousPath !== null

  const backLink = document.querySelector<HTMLAnchorElement>("a.back-link-table, a.back-link-home")
  const fromMarker = backLinkDetectMarker()
  if (backLink && fromMarker) {
    const rootHref = backLink.href.endsWith("/") ? backLink.href : backLink.href + "/"
    backLink.href = rootHref + fromMarker.slug
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
        // Beat spa.inline.ts's window-level click listener so it doesn't push
        // a fresh history entry to the static href.
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
