import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pillStyles } from "./Pill"
import {
  DatabaseViewOptions,
  ViewMode,
  aggregateFilters,
  getDatabasePages,
} from "../util/databaseView"
import { slugType } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { DatabaseFilters } from "./DatabaseFilters"
import { DatabaseRow } from "./DatabaseRow"
// @ts-ignore
import script from "./scripts/databaseView.inline"
import style from "./styles/databaseView.scss"

const defaultOptions: DatabaseViewOptions = {
  directChildrenOnly: true,
}

function recoverTypeLabel(pages: QuartzPluginData[], typeSlug: string): string | undefined {
  for (const p of pages) {
    const match = (p.frontmatter?.type ?? []).find((t) => slugType(t) === typeSlug)
    if (match) return match
  }
  return undefined
}

function isPageSetMixed(pages: QuartzPluginData[]): boolean {
  let hasArchived = false
  let hasActive = false
  for (const p of pages) {
    if ((p.frontmatter?.type ?? []).includes("Archived")) hasArchived = true
    else hasActive = true
    if (hasArchived && hasActive) return true
  }
  return false
}

function shouldShowActiveFilter(mode: ViewMode, pages: QuartzPluginData[]): boolean {
  return mode.kind === "type" && mode.typeSlug !== "archived" && isPageSetMixed(pages)
}

export default ((opts?: Partial<DatabaseViewOptions>) => {
  const options: DatabaseViewOptions = { ...defaultOptions, ...opts }

  const DatabaseView: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const result = getDatabasePages(allFiles, fileData, options)
    if (!result) return null
    const { pages, mode } = result

    const hideTypePill = mode.kind === "type" ? recoverTypeLabel(pages, mode.typeSlug) : undefined
    const hideTag = mode.kind === "tag" ? mode.tagSlug : undefined
    const { allTypes, allTags } = aggregateFilters(pages, hideTypePill, hideTag)
    const showActiveFilter = shouldShowActiveFilter(mode, pages)

    return (
      <div class="database-view">
        <div class="database-table">
          <DatabaseFilters
            allTypes={allTypes}
            allTags={allTags}
            showActiveFilter={showActiveFilter}
          />
          {pages.map((p) => (
            <DatabaseRow
              page={p}
              baseSlug={fileData.slug!}
              hideTypePill={hideTypePill}
              hideTag={hideTag}
            />
          ))}
        </div>
      </div>
    )
  }

  DatabaseView.css = style + pillStyles
  DatabaseView.afterDOMLoaded = script

  return DatabaseView
}) satisfies QuartzComponentConstructor
