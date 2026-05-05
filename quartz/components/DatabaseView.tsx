import { FullSlug, resolveRelative } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/databaseView.inline"
import style from "./styles/databaseView.scss"

interface DatabaseViewOptions {
  // If true, only include direct children (e.g. <folder>/<name>/index),
  // not deeper grandchildren. Defaults to true.
  directChildrenOnly: boolean
}

const defaultOptions: DatabaseViewOptions = {
  directChildrenOnly: true,
}

function slugifyClass(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function shortenUrl(url: string): string {
  try {
    const u = new URL(url)
    let path = u.pathname
    if (u.search) path += u.search
    if (path.length > 30) path = path.slice(0, 28) + "…"
    return u.host.replace(/^www\./, "") + path
  } catch {
    return url.length > 50 ? url.slice(0, 48) + "…" : url
  }
}

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String)
  if (v == null) return []
  return [String(v)]
}

export default ((opts?: Partial<DatabaseViewOptions>) => {
  const options: DatabaseViewOptions = { ...defaultOptions, ...opts }

  // Render only on folder-index pages (root "index" or any "<folder>/index").
  // basePath is derived from the current page's slug:
  //   "index"                       -> ""              (root lists everything direct)
  //   "Archive/index"               -> "Archive/"
  //   "Wiki-by-pilniczek/Foo/index" -> "Wiki-by-pilniczek/Foo/"
  const resolveBasePath = (slug: string | undefined): string | null => {
    const s = slug ?? ""
    if (s === "index") return ""
    if (s.endsWith("/index")) return s.slice(0, -"index".length)
    return null
  }

  const DatabaseView: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    // Archive landing page: scan from root, show only archived pages,
    // and don't restrict to direct children (archived pages live at
    // arbitrary depths in the tree).
    const archivedOnly = fileData.frontmatter?.archiveIndex === true
    const basePath = archivedOnly ? "" : resolveBasePath(fileData.slug)
    if (basePath === null) return null

    const pages = allFiles.filter((f) => {
      if (!f.slug) return false
      if (!f.slug.startsWith(basePath)) return false
      // skip the folder's own index page
      if (f.slug === basePath + "index") return false
      const isArchived = f.frontmatter?.archived === true
      const isArchiveIndex = f.frontmatter?.archiveIndex === true
      if (archivedOnly) {
        if (!isArchived) return false
      } else {
        if (isArchived || isArchiveIndex) return false
        if (options.directChildrenOnly) {
          // accept only `<name>/index`
          const rest = f.slug.slice(basePath.length)
          const parts = rest.split("/")
          if (parts.length !== 2 || parts[1] !== "index") return false
        }
      }
      return true
    })

    // hide the view entirely if the folder has no listable children
    if (pages.length === 0) return null

    pages.sort((a, b) => {
      const ta = (a.frontmatter?.title || "").toString().toLowerCase()
      const tb = (b.frontmatter?.title || "").toString().toLowerCase()
      return ta.localeCompare(tb)
    })

    const tagSet = new Set<string>()
    const typeSet = new Set<string>()
    for (const p of pages) {
      for (const t of asArray(p.frontmatter?.tags)) tagSet.add(t)
      const type = p.frontmatter?.type
      if (type) typeSet.add(String(type))
    }
    const allTags = [...tagSet].sort((a, b) => a.localeCompare(b))
    const allTypes = [...typeSet].sort((a, b) => a.localeCompare(b))

    return (
      <div class="database-view">
        <div class="database-filters">
          <input
            type="search"
            class="database-filter-name"
            placeholder="Filter by name…"
            aria-label="Filter by name"
          />
          <select class="database-filter-type" aria-label="Filter by type">
            <option value="">All types</option>
            {allTypes.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </select>
          <select class="database-filter-tag" aria-label="Filter by tag">
            <option value="">All tags</option>
            {allTags.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </select>
          <input
            type="search"
            class="database-filter-url"
            placeholder="Filter by URL…"
            aria-label="Filter by URL"
          />
        </div>
        <div class="database-table-wrapper">
          <table class="database-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Tags</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => {
                const title =
                  (p.frontmatter?.title as string | undefined) ||
                  (p.slug || "").split("/").slice(-2, -1)[0] ||
                  ""
                const type = p.frontmatter?.type as string | undefined
                const tags = asArray(p.frontmatter?.tags)
                const url = p.frontmatter?.url as string | undefined
                const href = resolveRelative(fileData.slug!, p.slug!)
                return (
                  <tr
                    data-name={title.toLowerCase()}
                    data-type={(type || "").toLowerCase()}
                    data-tags={tags.map((t) => t.toLowerCase()).join("|")}
                    data-url={(url || "").toLowerCase()}
                  >
                    <td>
                      <a class="internal" href={href}>
                        {title}
                      </a>
                    </td>
                    <td>
                      {type ? (
                        <a
                          class={`database-pill database-type type-${slugifyClass(type)} internal`}
                          href={resolveRelative(
                            fileData.slug!,
                            `types/${slugifyClass(type)}` as FullSlug,
                          )}
                        >
                          {type}
                        </a>
                      ) : null}
                    </td>
                    <td>
                      {tags.map((t) => (
                        <a
                          class="database-pill database-tag internal"
                          href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)}
                        >
                          {t}
                        </a>
                      ))}
                    </td>
                    <td>
                      {url ? (
                        <a
                          class="external database-url"
                          href={url}
                          target="_blank"
                          rel="noopener"
                        >
                          {shortenUrl(url)}
                        </a>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  DatabaseView.css = style
  DatabaseView.afterDOMLoaded = script

  return DatabaseView
}) satisfies QuartzComponentConstructor
