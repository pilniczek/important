import { QuartzEmitterPlugin } from "../types"
import { ProcessedContent, QuartzPluginData } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, joinSegments } from "../../util/path"
import { Content } from "../../components"
import { typeLabelsBySlug } from "../../util/databaseView"
import {
  buildCollectionPageOpts,
  collectionPageComponents,
  collectionPageContent,
  renderCollectionPages,
} from "./collectionPage"

function computeTypeInfo(allFiles: QuartzPluginData[]): ProcessedContent[] {
  return [...typeLabelsBySlug(allFiles)].map(([ts, raw]) =>
    collectionPageContent(joinSegments("types", ts) as FullSlug, `Type: ${raw}`),
  )
}

export const TypePage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts = buildCollectionPageOpts(userOpts ?? {}, Content())

  return {
    name: "TypePage",
    getQuartzComponents() {
      return collectionPageComponents(opts)
    },
    async emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      return renderCollectionPages(ctx, computeTypeInfo(allFiles), allFiles, opts, resources)
    },
  }
}
