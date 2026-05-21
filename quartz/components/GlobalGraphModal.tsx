import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
// @ts-ignore
import script from "./scripts/graph.inline"
import style from "./styles/globalGraphModal.scss"
import { D3Config } from "./Graph"

interface GlobalGraphModalOptions {
  globalGraph: Partial<D3Config>
}

const defaultOptions: GlobalGraphModalOptions = {
  globalGraph: {
    drag: true,
    zoom: true,
    depth: -1,
    scale: 0.9,
    repelForce: 0.5,
    centerForce: 0.2,
    linkDistance: 30,
    fontSize: 0.6,
    opacityScale: 1,
    showTags: true,
    removeTags: [],
    focusOnHover: true,
    enableRadial: true,
  },
}

// Page-level overlay that hosts the global graph. The trigger lives in
// GraphButton (rendered with class="global-graph-icon"). graph.inline
// queries both elements globally by class, so DOM placement of either
// component is decoupled — mount this once anywhere in a shared layout
// slot (e.g., afterBody).
export default ((opts?: Partial<GlobalGraphModalOptions>) => {
  const globalGraph = { ...defaultOptions.globalGraph, ...opts?.globalGraph }

  const GlobalGraphModal: QuartzComponent = (_props: QuartzComponentProps) => {
    return (
      <div class="global-graph-outer">
        <div class="global-graph-container" data-cfg={JSON.stringify(globalGraph)}></div>
      </div>
    )
  }

  GlobalGraphModal.css = style
  GlobalGraphModal.afterDOMLoaded = script

  return GlobalGraphModal
}) satisfies QuartzComponentConstructor
