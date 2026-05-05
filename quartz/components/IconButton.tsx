import { ComponentChildren } from "preact"
import { classNames } from "../util/lang"
import iconButtonStyle from "./styles/iconButton.scss"

export { iconButtonStyle as iconButtonStyles }

interface IconButtonProps {
  /** Accessible name — used for both screen readers (aria-label) and the
   *  browser hover tooltip (title). Keeping them in sync here ensures
   *  sighted-hover users and AT users get the same label. */
  ariaLabel: string
  /** The icon SVG. Caller controls viewBox, fill/stroke style, and paths.
   *  Don't put a <title> inside the SVG — accessibility is handled by
   *  aria-label on the wrapping element. */
  icon: ComponentChildren
  /** If provided, renders as `<a href>`. Otherwise renders as `<button>`. */
  href?: string
  /** Quartz visibility hint for responsive layout. */
  displayClass?: "mobile-only" | "desktop-only"
  /** Optional extra class for component-specific extension hooks. */
  className?: string
}

export function IconButton({ ariaLabel, icon, href, displayClass, className }: IconButtonProps) {
  const cls = classNames(displayClass, "icon-button", ...(className ? [className] : []))
  if (href) {
    return (
      <a class={cls} href={href} aria-label={ariaLabel} title={ariaLabel}>
        {icon}
      </a>
    )
  }
  return (
    <button class={cls} aria-label={ariaLabel} title={ariaLabel}>
      {icon}
    </button>
  )
}
