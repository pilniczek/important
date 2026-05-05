import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative } from "../util/path"
import { IconButton, iconButtonStyles } from "./IconButton"

const ArchiveButton: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const href = resolveRelative(fileData.slug!, "types/archived" as SimpleSlug)
  return (
    <IconButton
      href={href}
      displayClass={displayClass}
      ariaLabel="Archive"
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="5" rx="1" />
          <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
          <path d="M10 12h4" />
        </svg>
      }
    />
  )
}

ArchiveButton.css = iconButtonStyles

export default (() => ArchiveButton) satisfies QuartzComponentConstructor
