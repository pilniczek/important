import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { TagPillList, TypePill, pillStyles } from "./Pill"
import style from "./styles/articleTitle.scss"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (!title || fileData.slug === "index") return null

  const types = fileData.frontmatter?.type ?? []
  const url = fileData.frontmatter?.url
  const tags = fileData.frontmatter?.tags ?? []

  return (
    <>
      <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
      {types.length > 0 && (
        <p class="article-meta-line">
          type:{" "}
          {types.map((t) => (
            <TypePill type={t} baseSlug={fileData.slug!} />
          ))}
        </p>
      )}
      {tags.length > 0 && (
        <p class="article-meta-line">
          tags: <TagPillList tags={tags} baseSlug={fileData.slug!} />
        </p>
      )}
      {url && (
        <p class="article-meta-line article-source-url">
          url:{" "}
          <a class="external" href={url} target="_blank" rel="noopener noreferrer">
            {url}
          </a>
        </p>
      )}
    </>
  )
}

ArticleTitle.css = pillStyles + style

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
