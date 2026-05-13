import { getFullSlug } from "../../util/path"

type SearchLazy = typeof import("./search.lazy")
let lazyMod: SearchLazy | null = null
const lazyChunkUrl = "./search.js"

function setLoading(loading: boolean) {
  for (const s of document.getElementsByClassName("search")) {
    s.classList.toggle("loading", loading)
  }
  for (const b of document.getElementsByClassName("search-button")) {
    ;(b as HTMLButtonElement).disabled = loading
  }
}

document.addEventListener("nav", () => {
  if (lazyMod) return

  const slug = getFullSlug(window)
  setLoading(true)

  const ac = new AbortController()
  window.addCleanup(() => ac.abort())
  document.addEventListener(
    "keydown",
    (ev) => {
      if ((ev.key === "k" || ev.key === "K") && (ev.ctrlKey || ev.metaKey)) ev.preventDefault()
    },
    { signal: ac.signal },
  )

  const startPreload = async () => {
    try {
      const m = (await import(lazyChunkUrl)) as SearchLazy
      await m.init(slug)
      lazyMod = m
    } catch (e) {
      console.error("[search] preload failed:", e)
    } finally {
      setLoading(false)
      ac.abort()
    }
  }

  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
  ).requestIdleCallback
  if (ric) ric(startPreload, { timeout: 3000 })
  else setTimeout(startPreload, 100)
})
