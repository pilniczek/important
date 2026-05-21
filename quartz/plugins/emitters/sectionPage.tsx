import { QuartzEmitterPlugin } from "../types"
import { FullPageLayout } from "../../cfg"
import { FullSlug } from "../../util/path"
import { Content } from "../../components"
import { sectionOf } from "../../util/databaseView"
import { LISTING_SECTIONS } from "../../util/sections"
import {
  buildCollectionPageOpts,
  collectionPageComponents,
  collectionPageContent,
  renderCollectionPages,
} from "./collectionPage"

export const SectionPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts = buildCollectionPageOpts(userOpts ?? {}, Content())

  return {
    name: "SectionPage",
    getQuartzComponents() {
      return collectionPageComponents(opts)
    },
    async emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const present = new Set(allFiles.map(sectionOf))

      const pages = LISTING_SECTIONS.filter((meta) => present.has(meta.value)).map((meta) =>
        collectionPageContent(meta.slug as FullSlug, meta.title),
      )
      return renderCollectionPages(ctx, pages, allFiles, opts, resources)
    },
  }
}
