import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const TopBar = Component.Flex({
  components: [
    { Component: Component.Search(), grow: true },
    { Component: Component.GraphButton() },
    { Component: Component.Darkmode() },
  ],
})

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      Archive: "/archive/",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    TopBar,
    Component.ArticleTitle(),
    Component.TagList(),
    Component.DatabaseView(),
  ],
  left: [],
  right: [],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    TopBar,
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.DatabaseView(),
  ],
  left: [],
  right: [],
}
