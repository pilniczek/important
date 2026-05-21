import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { SimpleSlug, resolveRelative } from "../util/path"
import { IconButton, iconButtonStyles } from "./IconButton"

const UtilitiesButton: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const href = resolveRelative(fileData.slug!, "types/utilities" as SimpleSlug)
  return (
    <IconButton
      href={href}
      displayClass={displayClass}
      ariaLabel="Utilities"
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
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6 6 2 2 6-6a4 4 0 0 0 5.4-5.4l-2.6 2.6-2-2 2.6-2.6Z" />
        </svg>
      }
    />
  )
}

UtilitiesButton.css = iconButtonStyles

export default (() => UtilitiesButton) satisfies QuartzComponentConstructor
