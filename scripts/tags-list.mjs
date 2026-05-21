import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import matter from "gray-matter"
import { globby } from "globby"

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url))
const CONTENT_DIR = join(REPO_ROOT, "content")

const safeReadFile = async (path) => {
  try {
    return await readFile(path, "utf8")
  } catch {
    return ""
  }
}

const safeParseFrontmatter = (raw) => {
  try {
    return matter(raw).data ?? {}
  } catch {
    return {}
  }
}

const extractTagsFromFrontmatter = ({ tags } = {}) => {
  if (tags == null) return []
  const list = Array.isArray(tags) ? tags : [tags]
  const cleaned = list
    .filter((t) => typeof t === "string" || typeof t === "number")
    .map((t) => String(t).trim())
    .filter((t) => t.length > 0)
  return [...new Set(cleaned)]
}

const readArticleTags = async (path) =>
  extractTagsFromFrontmatter(safeParseFrontmatter(await safeReadFile(path)))

const findMarkdownArticles = (contentDir) => globby("**/*.md", { cwd: contentDir, absolute: true })

const countOccurrences = (items) =>
  items.reduce((counts, item) => counts.set(item, (counts.get(item) ?? 0) + 1), new Map())

const byFrequencyDescThenAlpha = ([tagA, countA], [tagB, countB]) =>
  countB - countA || tagA.localeCompare(tagB, undefined, { sensitivity: "base" })

const collisionKey = (tag) => tag.toLowerCase().replace(/s$/, "")

const findNearDuplicateGroups = (tags) =>
  Object.values(Object.groupBy(tags, collisionKey)).filter((group) => group.length > 1)

const formatFrequencyTable = (rankedTags) => {
  const widestCount = String(rankedTags[0]?.[1] ?? 0).length
  return rankedTags
    .map(([tag, count]) => `${String(count).padStart(widestCount)}  ${tag}`)
    .join("\n")
}

const formatTagWithCount = (tag, frequencies) => `"${tag}" (${frequencies.get(tag)})`

const formatCollisionLine = (group, frequencies) =>
  `- ${group.map((tag) => formatTagWithCount(tag, frequencies)).join(" / ")}`

const formatCollisionSection = (collisions, frequencies) =>
  collisions.length === 0
    ? ""
    : [
        "",
        "# Possible duplicates (case-insensitive or trailing-'s' collisions)",
        ...collisions.map((group) => formatCollisionLine(group, frequencies)),
        "",
        `# Synonyms (e.g. "Human" vs "People", "Test" vs "Testing") are NOT auto-detected — check by eye.`,
      ].join("\n")

const formatReport = ({ rankedTags, frequencies, collisions, taggedArticleCount }) =>
  [
    "# Tag inventory",
    `# ${rankedTags.length} unique tags across ${taggedArticleCount} tagged articles`,
    "",
    formatFrequencyTable(rankedTags),
    formatCollisionSection(collisions, frequencies),
  ]
    .filter((section) => section.length > 0)
    .join("\n") + "\n"

const articleFiles = await findMarkdownArticles(CONTENT_DIR)
const tagsPerArticle = await Promise.all(articleFiles.map(readArticleTags))
const taggedArticleCount = tagsPerArticle.filter((tags) => tags.length > 0).length
const frequencies = countOccurrences(tagsPerArticle.flat())
const rankedTags = [...frequencies.entries()].sort(byFrequencyDescThenAlpha)
const collisions = findNearDuplicateGroups(rankedTags.map(([tag]) => tag))

process.stdout.write(formatReport({ rankedTags, frequencies, collisions, taggedArticleCount }))
