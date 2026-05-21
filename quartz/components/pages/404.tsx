import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <h1>404</h1>
      <h2>Not Found</h2>
      <p>Either this page is private or doesn't exist.</p>
      <p>
        <a href={baseDir}>Return to Homepage →</a>
      </p>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
