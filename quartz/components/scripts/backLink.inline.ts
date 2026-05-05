// First-nav fallback is `document.referrer`. Mirrors the `previousPath` /
// `cameFromArchive` pattern in databaseView.inline.ts; names are prefixed
// because all `.inline.ts` files share a single TS-script global scope.
let backLinkPreviousPath: string | null = null

function backLinkCameFromArchive(): boolean {
  const ref = backLinkPreviousPath ?? document.referrer
  return !!ref && ref.includes("/types/archived")
}

document.addEventListener("nav", () => {
  const backLink = document.querySelector<HTMLAnchorElement>("a.back-link-table")
  if (backLink && backLinkCameFromArchive()) {
    const rootHref = backLink.href.endsWith("/") ? backLink.href : backLink.href + "/"
    backLink.href = rootHref + "types/archived"
    const label = backLink.querySelector<HTMLElement>(".back-link-label")
    if (label) label.textContent = "Archived"
    backLink.setAttribute("aria-label", "Back to archived")
    backLink.setAttribute("title", "Back to archived")
  }
  backLinkPreviousPath = window.location.pathname
})
