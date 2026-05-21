import { ComponentChildren } from "preact"
import { FullSlug, resolveRelative, slugTag, slugType } from "../util/path"
import pillStyles from "./styles/pill.scss"

export { pillStyles }

interface PillProps {
  className: string
  href?: string
  children: ComponentChildren
}

/** Low-level primitive — most callers want `TypePill` or `TagPillList`. */
export function Pill({ className, href, children }: PillProps) {
  if (href) {
    return (
      <a class={className} href={href}>
        {children}
      </a>
    )
  }
  return <span class={className}>{children}</span>
}

interface TypePillProps {
  type: string
  baseSlug: FullSlug
}

export function TypePill({ type, baseSlug }: TypePillProps) {
  const slug = slugType(type)
  return (
    <Pill
      className={`pill pill-type pill-type-${slug}`}
      href={resolveRelative(baseSlug, `types/${slug}` as FullSlug)}
    >
      {type}
    </Pill>
  )
}

interface TagPillListProps {
  tags: string[]
  baseSlug: FullSlug
}

/** Caller owns the wrapping element — layout stays at the call site. */
export function TagPillList({ tags, baseSlug }: TagPillListProps) {
  return (
    <>
      {tags.map((tag) => (
        <Pill
          className="pill pill-tag"
          href={resolveRelative(baseSlug, `tags/${slugTag(tag)}` as FullSlug)}
        >
          {tag}
        </Pill>
      ))}
    </>
  )
}
