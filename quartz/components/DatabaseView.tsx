import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pillStyles } from "./Pill"
import {
  ViewMode,
  aggregateFilters,
  getDatabasePages,
  sectionOf,
  typeLabelsBySlug,
} from "../util/databaseView"
import { QuartzPluginData } from "../plugins/vfile"
import { SECTION_VALUES } from "../util/sections"
import { DatabaseFilters, PrimaryFilter } from "./DatabaseFilters"
import { DatabaseRow } from "./DatabaseRow"
// @ts-ignore
import script from "./scripts/databaseView.inline"
import style from "./styles/databaseView.scss"

// Polymorphic second-column dropdown — see AGENTS.md "DatabaseView feature".
function buildPrimaryFilter(
  mode: ViewMode,
  pages: QuartzPluginData[],
  allTypes: string[],
): PrimaryFilter | null {
  if (mode.kind === "type") {
    const present = new Set(pages.map(sectionOf))
    return {
      dim: "section",
      ariaLabel: "Filter by section",
      allLabel: "All",
      defaultValue: present.has("Main") ? "Main" : "",
      options: SECTION_VALUES.filter((s) => present.has(s)).map((s) => ({ value: s, label: s })),
    }
  }
  return {
    dim: "type",
    ariaLabel: "Filter by type",
    allLabel: "All types",
    defaultValue: "",
    options: allTypes.map((t) => ({ value: t, label: t })),
  }
}

export default (() => {
  const DatabaseView: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const result = getDatabasePages(allFiles, fileData)
    if (!result) return null
    const { pages, mode } = result

    const hideTypePill =
      mode.kind === "type" ? typeLabelsBySlug(pages).get(mode.typeSlug) : undefined
    const hideTag = mode.kind === "tag" ? mode.tagSlug : undefined
    const { allTypes, allTags } = aggregateFilters(pages, hideTypePill, hideTag)
    const primaryFilter = buildPrimaryFilter(mode, pages, allTypes)

    return (
      <div class="database-view">
        <div class="database-table">
          <DatabaseFilters primaryFilter={primaryFilter} allTags={allTags} />
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
