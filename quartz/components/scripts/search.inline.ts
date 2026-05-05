import { Document } from "flexsearch"
import { FullSlug, getFullSlug, resolveRelative } from "../../util/path"
import { ContentDetails } from "../../plugins/emitters/contentIndex"

// Global injected by renderPage.tsx — a Promise<Record<FullSlug, ContentDetails>>.
declare const fetchData: Promise<Record<FullSlug, ContentDetails>>

type SearchDoc = {
  id: number
  slug: FullSlug
  title: string
  content: string
  tags: string[]
}

type IndexHandle = {
  index: Document<SearchDoc>
  byId: Map<number, SearchDoc>
}

// Module-scoped — survives Quartz's micromorph SPA navigation.
let indexPromise: Promise<IndexHandle> | undefined
let active = -1
let lastQuery = ""

const MAX_RESULTS_DEFAULT = 8
const DEBOUNCE_MS = 90
const SNIPPET_RADIUS = 70

// Lowercase + split on whitespace/punctuation, but PRESERVE Unicode letters
// (no diacritic folding) — per user choice, `cestina` should NOT match `čeština`.
const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .split(/[\s.,;:!?()[\]{}"'`/\\<>|*+\-_=&%$#@~^]+/u)
    .filter(Boolean)

async function buildIndex(): Promise<IndexHandle> {
  const data = await fetchData
  const index = new Document<SearchDoc>({
    cache: true,
    document: {
      id: "id",
      index: [
        { field: "title", tokenize: "forward", resolution: 9, encode: tokenize },
        { field: "content", tokenize: "forward", resolution: 5, encode: tokenize },
        { field: "tags", tokenize: "strict", encode: tokenize },
      ],
    },
  })

  const byId = new Map<number, SearchDoc>()
  let id = 0
  for (const [slug, details] of Object.entries(data) as [FullSlug, ContentDetails][]) {
    const doc: SearchDoc = {
      id,
      slug,
      title: details.title ?? slug,
      content: details.content ?? "",
      tags: details.tags ?? [],
    }
    byId.set(id, doc)
    index.add(doc)
    id++
  }
  return { index, byId }
}

function ensureIndex(): Promise<IndexHandle> {
  if (!indexPromise) indexPromise = buildIndex()
  return indexPromise
}

function highlightSnippet(content: string, query: string): string {
  const q = query.trim().toLowerCase()
  if (!q || !content) return ""
  const lc = content.toLowerCase()
  const at = lc.indexOf(q)
  if (at < 0) {
    // Match was on a tokenized fragment; fall back to first chars.
    return (
      escapeHtml(content.slice(0, SNIPPET_RADIUS * 2)) +
      (content.length > SNIPPET_RADIUS * 2 ? "…" : "")
    )
  }
  const start = Math.max(0, at - SNIPPET_RADIUS)
  const end = Math.min(content.length, at + q.length + SNIPPET_RADIUS)
  const before = escapeHtml(content.slice(start, at))
  const match = escapeHtml(content.slice(at, at + q.length))
  const after = escapeHtml(content.slice(at + q.length, end))
  const prefix = start > 0 ? "…" : ""
  const suffix = end < content.length ? "…" : ""
  return `${prefix}${before}<mark>${match}</mark>${after}${suffix}`
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

type Scored = { id: number; score: number; fields: Set<string> }

function rankResults(
  raw: Array<{ field?: string; result: (number | string)[] }>,
  limit: number,
): Scored[] {
  const weight = (f?: string) => (f === "title" ? 3 : f === "tags" ? 2 : 1)
  const merged = new Map<number, Scored>()
  for (const group of raw) {
    const w = weight(group.field)
    for (const rawId of group.result) {
      const numId = typeof rawId === "number" ? rawId : Number(rawId)
      const existing = merged.get(numId)
      if (existing) {
        existing.score += w
        if (group.field) existing.fields.add(group.field)
      } else {
        merged.set(numId, {
          id: numId,
          score: w,
          fields: new Set(group.field ? [group.field] : []),
        })
      }
    }
  }
  return [...merged.values()].sort((a, b) => b.score - a.score).slice(0, limit)
}

function renderResults(
  scored: Scored[],
  handle: IndexHandle,
  container: HTMLElement,
  query: string,
  enablePreview: boolean,
  currentSlug: FullSlug,
) {
  if (scored.length === 0) {
    container.innerHTML = `<div class="search-empty">No results</div>`
    container.hidden = false
    active = -1
    return
  }
  const html = scored
    .map((s, i) => {
      const doc = handle.byId.get(s.id)
      if (!doc) return ""
      const href = resolveRelative(currentSlug, doc.slug)
      const titleHtml = highlightSnippet(doc.title, query) || escapeHtml(doc.title)
      const preview =
        enablePreview && s.fields.has("content") ? highlightSnippet(doc.content, query) : ""
      const tagsHtml = s.fields.has("tags")
        ? `<span class="search-result-tags">${doc.tags
            .map((t) => `<span class="search-result-tag">${escapeHtml(t)}</span>`)
            .join("")}</span>`
        : ""
      return `<a class="search-result" role="option" data-idx="${i}" aria-selected="${
        i === 0 ? "true" : "false"
      }" href="${href}">
        <span class="search-result-title">${titleHtml}</span>
        ${preview ? `<span class="search-result-preview">${preview}</span>` : ""}
        ${tagsHtml}
      </a>`
    })
    .join("")
  container.innerHTML = html
  container.hidden = false
  active = 0
}

function setActive(container: HTMLElement, next: number) {
  const items = container.querySelectorAll<HTMLAnchorElement>(".search-result")
  if (items.length === 0) return
  const idx = ((next % items.length) + items.length) % items.length
  items.forEach((el, i) => el.setAttribute("aria-selected", i === idx ? "true" : "false"))
  items[idx].scrollIntoView({ block: "nearest" })
  active = idx
}

function closeDropdown(container: HTMLElement) {
  container.hidden = true
  active = -1
}

async function runQuery(
  query: string,
  resultsEl: HTMLElement,
  enablePreview: boolean,
  maxResults: number,
  currentSlug: FullSlug,
) {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    closeDropdown(resultsEl)
    return
  }
  resultsEl.hidden = false
  if (!indexPromise) {
    resultsEl.innerHTML = `<div class="search-loading">Loading…</div>`
  }
  const handle = await ensureIndex()
  if (lastQuery !== trimmed) return // a newer query has been issued

  const raw = handle.index.search(trimmed, { limit: maxResults * 3 }) as Array<{
    field?: string
    result: (number | string)[]
  }>
  const scored = rankResults(raw, maxResults)
  renderResults(scored, handle, resultsEl, trimmed, enablePreview, currentSlug)
}

function bind(currentSlug: FullSlug) {
  const container = document.querySelector<HTMLElement>(".search-container")
  if (!container) return
  const input = container.querySelector<HTMLInputElement>("#search-input")
  const resultsEl = container.querySelector<HTMLElement>("#search-results")
  if (!input || !resultsEl) return

  // SPA morph preserves DOM but not live `.value`. Reset on every nav.
  // (Same pattern as databaseView.inline.ts — see AGENTS.md "SPA morph navigation".)
  input.value = ""
  closeDropdown(resultsEl)

  const enablePreview = container.dataset.preview !== "false"
  const maxResults = Number(container.dataset.maxResults) || MAX_RESULTS_DEFAULT

  const ac = new AbortController()
  let debounceHandle: number | undefined

  const schedule = (q: string) => {
    if (debounceHandle !== undefined) clearTimeout(debounceHandle)
    debounceHandle = window.setTimeout(() => {
      lastQuery = q
      void runQuery(q, resultsEl, enablePreview, maxResults, currentSlug)
    }, DEBOUNCE_MS)
  }

  input.addEventListener(
    "input",
    () => {
      const q = input.value
      if (q.trim().length < 2) {
        closeDropdown(resultsEl)
        lastQuery = ""
        return
      }
      schedule(q)
    },
    { signal: ac.signal },
  )

  input.addEventListener(
    "focus",
    () => {
      // Warm the index up so the first real search is fast.
      void ensureIndex()
      if (input.value.trim().length >= 2 && resultsEl.children.length > 0) {
        resultsEl.hidden = false
      }
    },
    { signal: ac.signal },
  )

  input.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setActive(resultsEl, active < 0 ? 0 : active + 1)
      } else if (event.key === "ArrowUp") {
        event.preventDefault()
        setActive(resultsEl, active < 0 ? -1 : active - 1)
      } else if (event.key === "Enter") {
        const items = resultsEl.querySelectorAll<HTMLAnchorElement>(".search-result")
        const target = items[active >= 0 ? active : 0]
        if (target) {
          event.preventDefault()
          target.click()
        }
      } else if (event.key === "Escape") {
        input.value = ""
        closeDropdown(resultsEl)
        input.blur()
      }
    },
    { signal: ac.signal },
  )

  document.addEventListener(
    "click",
    (event) => {
      if (!container.contains(event.target as Node)) closeDropdown(resultsEl)
    },
    { signal: ac.signal },
  )

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "/") return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return
      }
      event.preventDefault()
      input.focus()
      input.select()
    },
    { signal: ac.signal },
  )

  window.addCleanup(() => {
    if (debounceHandle !== undefined) clearTimeout(debounceHandle)
    ac.abort()
  })
}

document.addEventListener("nav", () => {
  bind(getFullSlug(window))
})
