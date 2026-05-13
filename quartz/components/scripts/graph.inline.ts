import { getFullSlug } from "../../util/path"

type GraphLazy = typeof import("./graph.lazy")
let lazyMod: GraphLazy | null = null
let lazyPromise: Promise<GraphLazy> | null = null
const lazyChunkUrl = "./graph.js"

function load(): Promise<GraphLazy> {
  if (!lazyPromise) {
    lazyPromise = import(lazyChunkUrl).then((m) => (lazyMod = m as GraphLazy))
  }
  return lazyPromise
}

document.addEventListener("nav", () => {
  const slug = getFullSlug(window)
  const ac = new AbortController()

  document.addEventListener(
    "keydown",
    async (ev) => {
      if (ev.key !== "g" || !(ev.ctrlKey || ev.metaKey) || ev.shiftKey) return
      ev.preventDefault()
      const m = await load()
      if (m.isAnyGlobalGraphOpen()) m.hideGlobalGraph()
      else await m.renderGlobalGraph(slug)
    },
    { signal: ac.signal },
  )

  for (const icon of document.getElementsByClassName("global-graph-icon")) {
    icon.addEventListener(
      "click",
      async () => {
        const m = await load()
        await m.renderGlobalGraph(slug)
      },
      { signal: ac.signal },
    )
  }

  window.addCleanup(() => {
    ac.abort()
    lazyMod?.cleanupOnNav()
  })
})
