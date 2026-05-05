import { FullSlug, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { TagPillList, TypePill } from "./Pill"
import { shortenUrl } from "../util/databaseView"

interface DatabaseRowProps {
  page: QuartzPluginData
  baseSlug: FullSlug
  hideTypePill?: string
  hideTag?: string
}

export function DatabaseRow({ page, baseSlug, hideTypePill, hideTag }: Readonly<DatabaseRowProps>) {
  const title =
    page.frontmatter?.title ||
    (page.slug || "").split("/").slice(-2, -1)[0] ||
    ""
  const allTypes = page.frontmatter?.type ?? []
  const allTags = page.frontmatter?.tags ?? []
  const visibleTypes = hideTypePill ? allTypes.filter((t) => t !== hideTypePill) : allTypes
  const visibleTags = hideTag ? allTags.filter((t) => t !== hideTag) : allTags
  const url = page.frontmatter?.url
  const href = resolveRelative(baseSlug, page.slug!)

  return (
    <div
      class="database-row"
      data-name={title.toLowerCase()}
      data-type={allTypes.map((t) => t.toLowerCase()).join("|")}
      data-tags={allTags.map((t) => t.toLowerCase()).join("|")}
      data-url={(url || "").toLowerCase()}
    >
      <div>
        <a class="internal" href={href}>
          {title}
        </a>
      </div>
      <div>
        {visibleTypes.map((t) => (
          <TypePill type={t} baseSlug={baseSlug} />
        ))}
      </div>
      <div>
        <TagPillList tags={visibleTags} baseSlug={baseSlug} />
      </div>
      <div>
        {url && (
          <a class="external database-url" href={url} target="_blank" rel="noopener">
            {shortenUrl(url)}
          </a>
        )}
      </div>
    </div>
  )
}
