// Single source of truth for article "sections" (see AGENTS.md "Frontmatter
// format"): the value ↔ URL-slug ↔ listing-page-title mapping. Browser-safe
// (constants only) so inline scripts can import it.

export type Section = "Main" | "Archived" | "Utilities"

export const DEFAULT_SECTION: Section = "Main"

export interface SectionMeta {
  value: Section
  /** Listing-page URL slug; "" for Main (which has no dedicated page). */
  slug: string
  /** Listing-page title. */
  title: string
}

// Canonical display order.
export const SECTIONS: readonly SectionMeta[] = [
  { value: "Main", slug: "", title: "" },
  { value: "Archived", slug: "archived", title: "Archive" },
  { value: "Utilities", slug: "utilities", title: "Utilities" },
]

export const SECTION_VALUES: readonly Section[] = SECTIONS.map((s) => s.value)

/** Sections with their own listing page (everything except Main). */
export const LISTING_SECTIONS: readonly SectionMeta[] = SECTIONS.filter((s) => s.slug !== "")

/** Resolve a listing-page slug (e.g. "archived") to its section, if any. */
export function listingSectionBySlug(slug: string): SectionMeta | undefined {
  return LISTING_SECTIONS.find((s) => s.slug === slug)
}
