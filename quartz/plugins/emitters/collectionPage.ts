// Shared boilerplate for the collection list-page emitters (typePage, tagPage,
// sectionPage). See AGENTS.md "DatabaseView feature". Keep this page-kind-agnostic.

import { QuartzComponent, QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, QuartzPluginData, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FullSlug, FilePath, pathToRoot } from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"

/** Merge `userOpts` over the shared list-page layout with the given `pageBody`. */
export function buildCollectionPageOpts(
  userOpts: Partial<FullPageLayout>,
  pageBody: QuartzComponent,
): FullPageLayout {
  return {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody,
    ...userOpts,
  }
}

/** The component list a collection emitter must expose via `getQuartzComponents()`. */
export function collectionPageComponents(opts: FullPageLayout): QuartzComponent[] {
  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()
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
}

/** A synthetic, body-less list page at `slug` titled `title`. */
export function collectionPageContent(slug: FullSlug, title: string): ProcessedContent {
  return defaultProcessedContent({ slug, frontmatter: { title, tags: [] } })
}

/** Render one collection page to disk (keyed off `file.data.slug!`). */
export async function renderCollectionPage(
  ctx: BuildCtx,
  content: ProcessedContent,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
): Promise<FilePath> {
  const [tree, file] = content
  const slug = file.data.slug!
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
  const rendered = renderPage(cfg, slug, componentData, opts, externalResources)
  return write({ ctx, content: rendered, slug, ext: ".html" })
}

/** Render a batch of pre-built collection pages to disk. */
export function renderCollectionPages(
  ctx: BuildCtx,
  pages: Iterable<ProcessedContent>,
  allFiles: QuartzPluginData[],
  opts: FullPageLayout,
  resources: StaticResources,
): Promise<FilePath[]> {
  return Promise.all(
    [...pages].map((page) => renderCollectionPage(ctx, page, allFiles, opts, resources)),
  )
}
