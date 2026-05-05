import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { slugType } from "../../util/path"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"

interface TypeContentOptions {
  sort?: SortFn
}

const defaultOptions: TypeContentOptions = {}

export default ((opts?: Partial<TypeContentOptions>) => {
  const options: TypeContentOptions = { ...defaultOptions, ...opts }

  const TypeContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!slug?.startsWith("types/")) {
      throw new Error(`Component "TypeContent" tried to render a non-type page: ${slug}`)
    }

    const typeSlug = slug.slice("types/".length)
    const pages = allFiles.filter((file) => {
      const t = file.frontmatter?.type
      return typeof t === "string" && slugType(t) === typeSlug
    })

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")

    const listProps = {
      ...props,
      allFiles: pages,
    }

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          <p>{i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}</p>
          <div>
            <PageList {...listProps} sort={options?.sort} />
          </div>
        </div>
      </div>
    )
  }

  TypeContent.css = concatenateResources(style, PageList.css)
  return TypeContent
}) satisfies QuartzComponentConstructor
