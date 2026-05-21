import { QuartzEmitterPlugin } from "../types"
import { ProcessedContent, QuartzPluginData } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, getAllSegmentPrefixes, joinSegments, slugTag } from "../../util/path"
import { TagContent } from "../../components"
import { i18n, TRANSLATIONS } from "../../i18n"
import {
  buildCollectionPageOpts,
  collectionPageComponents,
  collectionPageContent,
  renderCollectionPages,
} from "./collectionPage"

interface TagPageOptions extends FullPageLayout {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

/** Find the human tag whose slug matches `tagSlug`, falling back to the slug itself. */
function resolveDisplayTag(tags: Iterable<string>, tagSlug: string): string {
  return [...tags].find((t) => slugTag(t) === tagSlug) ?? tagSlug
}

function computeTagInfo(
  allFiles: QuartzPluginData[],
  content: ProcessedContent[],
  locale: keyof typeof TRANSLATIONS,
): Map<string, ProcessedContent> {
  // "index" is the base tag page listing everything.
  const tags = new Set<string>([
    "index",
    ...allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
  ])

  const baseDescriptions = [...tags].map((tag): [string, ProcessedContent] => {
    const title =
      tag === "index"
        ? i18n(locale).pages.tagContent.tagIndex
        : `${i18n(locale).pages.tagContent.tag}: ${tag}`
    const tagSlug = tag === "index" ? "index" : slugTag(tag)
    return [tag, collectionPageContent(joinSegments("tags", tagSlug) as FullSlug, title)]
  })

  // Override the synthetic page with a real tag page's content where one exists.
  // (The title rewrite is an intentional side-effect on the shared vfile.)
  const overrides = content.flatMap(([tree, file]): [string, ProcessedContent][] => {
    const slug = file.data.slug!
    if (!slug.startsWith("tags/")) return []
    const displayTag = resolveDisplayTag(tags, slug.slice("tags/".length))
    if (!tags.has(displayTag)) return []
    if (file.data.frontmatter?.title === displayTag) {
      file.data.frontmatter.title = `${i18n(locale).pages.tagContent.tag}: ${displayTag}`
    }
    return [[displayTag, [tree, file]]]
  })

  // Later entries win per key, so overrides replace base entries.
  return new Map([...baseDescriptions, ...overrides])
}

export const TagPage: QuartzEmitterPlugin<Partial<TagPageOptions>> = (userOpts) => {
  const opts = buildCollectionPageOpts(userOpts ?? {}, TagContent({ sort: userOpts?.sort }))

  return {
    name: "TagPage",
    getQuartzComponents() {
      return collectionPageComponents(opts)
    },
    async emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration
      const tagDescriptions = computeTagInfo(allFiles, content, cfg.locale)
      return renderCollectionPages(ctx, tagDescriptions.values(), allFiles, opts, resources)
    },
    async partialEmit(ctx, content, resources, changeEvents) {
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const allTags = allFiles
        .flatMap((d) => d.frontmatter?.tags ?? [])
        .flatMap(getAllSegmentPrefixes)

      // Tags to rebuild: a changed tag page, a changed file's own tags, and
      // always "index". No change events => empty set => nothing rebuilt.
      const affectedTags = new Set(
        changeEvents.flatMap((changeEvent): string[] => {
          const file = changeEvent.file
          if (!file) return []
          const slug = file.data.slug!

          const fromTagPage = slug.startsWith("tags/")
            ? [resolveDisplayTag(allTags, slug.slice("tags/".length))]
            : []

          const fileTags = (file.data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes)
          return [...fromTagPage, ...fileTags, "index"]
        }),
      )

      if (affectedTags.size === 0) return []

      // We still need to compute all tags because tag pages show all tags
      const tagDescriptions = computeTagInfo(allFiles, content, cfg.locale)
      const affectedPages = [...affectedTags]
        .map((tag) => tagDescriptions.get(tag))
        .filter((page): page is ProcessedContent => page !== undefined)
      return renderCollectionPages(ctx, affectedPages, allFiles, opts, resources)
    },
  }
}
