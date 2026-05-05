import { QuartzPluginData } from "../plugins/vfile"
import { getAllSegmentPrefixes, slugType } from "./path"

export interface DatabaseViewOptions {
  /** If true, only include direct children (e.g. `<folder>/<name>/index`),
   *  not deeper grandchildren. Defaults to true. Only applies in folder mode. */
  directChildrenOnly: boolean
}

export type ViewMode =
  | { kind: "folder"; basePath: string }
  | { kind: "type"; typeSlug: string }
  | { kind: "tag"; tagSlug: string }

export interface DatabaseResult {
  pages: QuartzPluginData[]
  mode: ViewMode
}

/** Returns null for article pages (DatabaseView is a no-op there). */
export function resolveViewMode(slug: string | undefined = ""): ViewMode | null {
  const s = slug
  if (s === "index") return { kind: "folder", basePath: "" }
  if (s.endsWith("/index")) return { kind: "folder", basePath: s.slice(0, -"index".length) }
  if (s.startsWith("types/")) {
    const typeSlug = s.slice("types/".length)
    if (typeSlug.length === 0) return null
    return { kind: "type", typeSlug }
  }
  if (s.startsWith("tags/")) {
    const tagSlug = s.slice("tags/".length)
    if (tagSlug.length === 0 || tagSlug === "/") return null
    return { kind: "tag", tagSlug }
  }
  return null
}

function passesFolderFilter(
  f: QuartzPluginData,
  basePath: string,
  directChildrenOnly: boolean,
): boolean {
  if (!f.slug!.startsWith(basePath)) return false
  if (f.slug === basePath + "index") return false
  if ((f.frontmatter?.type ?? []).includes("Archived")) return false
  if (!directChildrenOnly) return true
  const parts = f.slug!.slice(basePath.length).split("/")
  return parts.length === 2 && parts[1] === "index"
}

function passesTypeFilter(f: QuartzPluginData, typeSlug: string): boolean {
  return (f.frontmatter?.type ?? []).some((t) => slugType(t) === typeSlug)
}

function passesTagFilter(f: QuartzPluginData, tagSlug: string): boolean {
  if ((f.frontmatter?.type ?? []).includes("Archived")) return false
  const tags = f.frontmatter?.tags ?? []
  return tags.flatMap(getAllSegmentPrefixes).includes(tagSlug)
}

export function getDatabasePages(
  allFiles: QuartzPluginData[],
  fileData: QuartzPluginData,
  options: DatabaseViewOptions,
): DatabaseResult | null {
  const mode = resolveViewMode(fileData.slug)
  if (mode === null) return null

  const pages = allFiles.filter((f) => {
    if (!f.slug) return false
    if (f.slug === fileData.slug) return false
    switch (mode.kind) {
      case "folder":
        return passesFolderFilter(f, mode.basePath, options.directChildrenOnly)
      case "type":
        return passesTypeFilter(f, mode.typeSlug)
      case "tag":
        return passesTagFilter(f, mode.tagSlug)
    }
  })

  if (pages.length === 0) return null

  pages.sort((a, b) => {
    const ta = (a.frontmatter?.title || "").toLowerCase()
    const tb = (b.frontmatter?.title || "").toLowerCase()
    return ta.localeCompare(tb)
  })

  return { pages, mode }
}

/** `excludeType` / `excludeTag` skip the collection's own dimension from its dropdown. */
export function aggregateFilters(
  pages: QuartzPluginData[],
  excludeType?: string,
  excludeTag?: string,
): {
  allTypes: string[]
  allTags: string[]
} {
  const tagSet = new Set<string>()
  const typeSet = new Set<string>()
  for (const p of pages) {
    for (const tag of p.frontmatter?.tags ?? []) {
      if (tag !== excludeTag) tagSet.add(tag)
    }
    for (const t of p.frontmatter?.type ?? []) {
      if (t !== excludeType) typeSet.add(t)
    }
  }
  return {
    allTypes: [...typeSet].sort((a, b) => a.localeCompare(b)),
    allTags: [...tagSet].sort((a, b) => a.localeCompare(b)),
  }
}

/** Strip protocol + `www.`, truncate paths over 30 chars. */
export function shortenUrl(url: string): string {
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
