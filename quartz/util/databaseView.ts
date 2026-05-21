import { QuartzPluginData } from "../plugins/vfile"
import { getAllSegmentPrefixes, slugTag, slugType } from "./path"
import { DEFAULT_SECTION, Section, listingSectionBySlug } from "./sections"

export type ViewMode =
  | { kind: "folder"; basePath: string }
  | { kind: "type"; typeSlug: string }
  | { kind: "tag"; tagSlug: string }
  | { kind: "section"; section: Exclude<Section, "Main"> }

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
  const listing = listingSectionBySlug(s)
  if (listing) return { kind: "section", section: listing.value as Exclude<Section, "Main"> }
  return null
}

export function sectionOf(f: QuartzPluginData): Section {
  return f.frontmatter?.section ?? DEFAULT_SECTION
}

/** Map each type's slug to a representative raw label (first page wins). */
export function typeLabelsBySlug(pages: QuartzPluginData[]): Map<string, string> {
  const entries = pages.flatMap((p): [string, string][] => {
    const raw = p.frontmatter?.type
    if (!raw) return []
    const ts = slugType(raw)
    return ts ? [[ts, raw]] : []
  })
  // `new Map` keeps the last value per key; reverse a copy so the first page wins.
  return new Map([...entries].reverse())
}

// Section/listing semantics: see AGENTS.md "DatabaseView feature" + "section".
// Content is flat, so a folder view is every Main page under basePath bar its index.
function passesFolderFilter(f: QuartzPluginData, basePath: string): boolean {
  if (!f.slug!.startsWith(basePath)) return false
  if (f.slug === basePath + "index") return false
  return sectionOf(f) === "Main"
}

// Type pages list every section of that type; the section dropdown narrows them.
function passesTypeFilter(f: QuartzPluginData, typeSlug: string): boolean {
  const t = f.frontmatter?.type
  return t != null && slugType(t) === typeSlug
}

function passesTagFilter(f: QuartzPluginData, tagSlug: string): boolean {
  if (sectionOf(f) !== "Main") return false
  const tags = f.frontmatter?.tags ?? []
  return tags.flatMap(getAllSegmentPrefixes).map(slugTag).includes(tagSlug)
}

function passesSectionFilter(f: QuartzPluginData, section: Exclude<Section, "Main">): boolean {
  return sectionOf(f) === section
}

export function getDatabasePages(
  allFiles: QuartzPluginData[],
  fileData: QuartzPluginData,
): DatabaseResult | null {
  const mode = resolveViewMode(fileData.slug)
  if (mode === null) return null

  const pages = allFiles.filter((f) => {
    if (!f.slug) return false
    if (f.slug === fileData.slug) return false
    switch (mode.kind) {
      case "folder":
        return passesFolderFilter(f, mode.basePath)
      case "type":
        return passesTypeFilter(f, mode.typeSlug)
      case "tag":
        return passesTagFilter(f, mode.tagSlug)
      case "section":
        return passesSectionFilter(f, mode.section)
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
    const t = p.frontmatter?.type
    if (t != null && t !== excludeType) typeSet.add(t)
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
