import { DEFAULT_QUADRANT_SIZE } from "../../util/mermaid"

const cssVars = [
  "--secondary",
  "--tertiary",
  "--gray",
  "--light",
  "--lightgray",
  "--highlight",
  "--dark",
  "--darkgray",
  "--codeFont",
] as const

let mermaidImport = undefined

function readMermaidSource(node: HTMLElement): string {
  const dc = node.dataset.clipboard
  if (dc) {
    try {
      return JSON.parse(dc)
    } catch {
      // fall through
    }
  }
  return node.innerText
}

document.addEventListener("nav", async () => {
  const center = document.querySelector(".center") as HTMLElement
  const nodes = center.querySelectorAll("code.mermaid") as NodeListOf<HTMLElement>
  if (nodes.length === 0) return

  const textMapping: WeakMap<HTMLElement, string> = new WeakMap()
  for (const node of nodes) {
    textMapping.set(node, readMermaidSource(node))
  }

  async function loadMermaid() {
    mermaidImport ||= await import(
      // @ts-ignore
      "https://cdnjs.cloudflare.com/ajax/libs/mermaid/11.4.0/mermaid.esm.min.mjs"
    )
    return mermaidImport.default
  }

  async function renderMermaid() {
    const mermaid = await loadMermaid()
    // de-init any other diagrams
    for (const node of nodes) {
      node.removeAttribute("data-processed")
      const oldText = textMapping.get(node)
      if (oldText) {
        node.innerHTML = oldText
      }
    }

    const computedStyleMap = cssVars.reduce(
      (acc, key) => {
        acc[key] = window.getComputedStyle(document.documentElement).getPropertyValue(key)
        return acc
      },
      {} as Record<(typeof cssVars)[number], string>,
    )

    const darkMode = document.documentElement.getAttribute("saved-theme") === "dark"
    const quadrantSize = Number(nodes[0]?.dataset.quadrantSize) || DEFAULT_QUADRANT_SIZE
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: darkMode ? "dark" : "base",
      themeVariables: {
        fontFamily: computedStyleMap["--codeFont"],
        primaryColor: computedStyleMap["--light"],
        primaryTextColor: computedStyleMap["--darkgray"],
        primaryBorderColor: computedStyleMap["--tertiary"],
        lineColor: computedStyleMap["--darkgray"],
        secondaryColor: computedStyleMap["--secondary"],
        tertiaryColor: computedStyleMap["--tertiary"],
        clusterBkg: computedStyleMap["--light"],
        edgeLabelBackground: computedStyleMap["--highlight"],
      },
      quadrantChart: {
        chartWidth: quadrantSize,
        chartHeight: quadrantSize,
        titleFontSize: 18,
        titlePadding: 10,
        quadrantPadding: 5,
        quadrantTextTopPadding: 5,
        quadrantLabelFontSize: 14,
        quadrantInternalBorderStrokeWidth: 0.8,
        quadrantExternalBorderStrokeWidth: 1.5,
        xAxisLabelPadding: 5,
        yAxisLabelPadding: 5,
        xAxisLabelFontSize: 14,
        yAxisLabelFontSize: 14,
      },
      // Mirror of ofm.ts: suppress the xychart y-axis labels/ticks + x-axis ticks at
      // render time so the theme-toggle re-render reclaims the y-label space (CSS
      // display:none can't). See diffusion-of-innovations.md.
      xyChart: {
        height: 250,
        xAxis: { showTick: false },
        yAxis: { showLabel: false, showTick: false },
      },
    })

    await mermaid.run({ nodes })
  }

  const allPreRendered = Array.from(nodes).every(
    (n) => n.dataset.processed === "true" && n.querySelector("svg") !== null,
  )
  if (!allPreRendered) {
    await renderMermaid()
  }
  document.addEventListener("themechange", renderMermaid)
  window.addCleanup(() => document.removeEventListener("themechange", renderMermaid))
})
