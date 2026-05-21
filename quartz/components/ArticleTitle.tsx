import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { TagPillList, TypePill, pillStyles } from "./Pill"
import style from "./styles/articleTitle.scss"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  if (!title || fileData.slug === "index") return null

  const type = fileData.frontmatter?.type
  const url = fileData.frontmatter?.url
  const tags = fileData.frontmatter?.tags ?? []
  const releaseDate = fileData.frontmatter?.releaseDate

  return (
    <>
      <h1 class={classNames(displayClass, "article-title")}>{title}</h1>
      {(type != null || tags.length > 0) && (
        <p class="article-meta-line">
          <span class="article-meta-pills">
            <span>
              {`type: `}
              {type != null && <TypePill type={type} baseSlug={fileData.slug!} />}
            </span>
            <span>
              {`tags: `}
              <TagPillList tags={tags} baseSlug={fileData.slug!} />
            </span>
          </span>
          {releaseDate && <time dateTime={releaseDate}>{releaseDate}</time>}
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
