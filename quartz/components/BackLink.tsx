import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/backLink.scss"
import { FullSlug, SimpleSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/backLink.inline"

type BackLinkTarget =
  | { kind: "root" }
  | { kind: "home"; href: string }
  | { kind: "back"; href: string }

const LeftArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
)

function getBackLinkTarget(slug: FullSlug): BackLinkTarget {
  if (slug === "index") return { kind: "root" }

  // Collection + 404 pages have no parent — show "Home".
  if (slug.startsWith("tags/") || slug.startsWith("types/") || slug === "404") {
    return { kind: "home", href: resolveRelative(slug, "/" as SimpleSlug) }
  }

  return { kind: "back", href: resolveRelative(slug, "/" as SimpleSlug) }
}

const BackLink: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const target = getBackLinkTarget(fileData.slug!)

  switch (target.kind) {
    case "root":
      return <h1 class={classNames(displayClass, "back-link", "back-link-root")}>Wiki</h1>
    case "home":
      return (
        <a class={classNames(displayClass, "back-link", "back-link-home")} href={target.href}>
          <LeftArrowIcon />
          <span class="back-link-label">Home</span>
        </a>
      )
    case "back":
      return (
        <a
          class={classNames(displayClass, "back-link", "back-link-table")}
          href={target.href}
          aria-label="Back to active"
          title="Back to active"
        >
          <LeftArrowIcon />
          <span class="back-link-label">Active</span>
        </a>
      )
  }
}

BackLink.css = style
BackLink.afterDOMLoaded = script

export default (() => BackLink) satisfies QuartzComponentConstructor
