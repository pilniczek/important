import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default ((component: QuartzComponent) => {
  const Component = component
  const MobileOnly: QuartzComponent = (props: QuartzComponentProps) => {
    return <Component displayClass="mobile-only" {...props} />
  }

  MobileOnly.displayName = component.displayName
  MobileOnly.afterDOMLoaded = component?.afterDOMLoaded
  MobileOnly.beforeDOMLoaded = component?.beforeDOMLoaded
  MobileOnly.lazyScripts = component?.lazyScripts
  MobileOnly.css = component?.css
  return MobileOnly
}) satisfies QuartzComponentConstructor<QuartzComponent>
