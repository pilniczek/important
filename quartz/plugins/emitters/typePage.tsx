import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, joinSegments, pathToRoot, slugType } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { TypeContent } from "../../components"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

interface TypePageOptions extends FullPageLayout {
  sort?: (f1: QuartzPluginData, f2: QuartzPluginData) => number
}

function computeTypeInfo(
  allFiles: QuartzPluginData[],
): [Set<string>, Record<string, ProcessedContent>] {
  const types: Set<string> = new Set()
  const firstRawForSlug: Record<string, string> = {}

  for (const data of allFiles) {
    const raw = data.frontmatter?.type
    if (typeof raw !== "string" || raw.length === 0) continue
    const ts = slugType(raw)
    if (!ts) continue
    types.add(ts)
    if (!(ts in firstRawForSlug)) firstRawForSlug[ts] = raw
  }

  const typeDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
    [...types].map((ts) => {
      const raw = firstRawForSlug[ts]
      const title = `Type: ${raw}`
      return [
        ts,
        defaultProcessedContent({
          slug: joinSegments("types", ts) as FullSlug,
          frontmatter: { title, tags: [] },
        }),
      ]
    }),
  )

  return [types, typeDescriptions]
}

async function processTypePage(
  ctx: BuildCtx,
  typeSlug: string,
  typeContent: ProcessedContent,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
) {
  const slug = joinSegments("types", typeSlug) as FullSlug
  const [tree, file] = typeContent
  const cfg = ctx.cfg.configuration
  const externalResources = pageResources(pathToRoot(slug), resources)
  const componentData: QuartzComponentProps = {
    ctx,
    fileData: file.data,
    externalResources,
    cfg,
    children: [],
    tree,
    allFiles,
  }

  const content = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({
    ctx,
    content,
    slug: file.data.slug!,
    ext: ".html",
  })
}

export const TypePage: QuartzEmitterPlugin<Partial<TypePageOptions>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: TypeContent({ sort: userOpts?.sort }),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "TypePage",
    getQuartzComponents() {
      return [
        Head,
        Header,
        Body,
        ...header,
        ...beforeBody,
        pageBody,
        ...afterBody,
        ...left,
        ...right,
        Footer,
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)
      const [types, typeDescriptions] = computeTypeInfo(allFiles)

      for (const ts of types) {
        yield processTypePage(ctx, ts, typeDescriptions[ts], allFiles, opts, resources)
      }
    },
  }
}
