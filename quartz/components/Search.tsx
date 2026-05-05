import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import style from "./styles/search.scss"
// @ts-ignore
import script from "./scripts/search.inline"

export interface SearchOptions {
  enablePreview?: boolean
  maxResults?: number
}

const defaultOptions: Required<SearchOptions> = {
  enablePreview: true,
  maxResults: 8,
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="20" y1="20" x2="16.65" y2="16.65" />
  </svg>
)

export default ((userOpts?: SearchOptions) => {
  const opts = { ...defaultOptions, ...userOpts }

  const Search: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const placeholder = i18n(cfg.locale).components.search.searchBarPlaceholder
    return (
      <div
        class={classNames(displayClass, "search-container")}
        data-preview={opts.enablePreview ? "true" : "false"}
        data-max-results={String(opts.maxResults)}
      >
        <label class="search-input-wrapper" for="search-input">
          <span class="search-input-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            type="search"
            id="search-input"
            class="search-input"
            placeholder={placeholder}
            aria-label={placeholder}
            aria-controls="search-results"
            aria-autocomplete="list"
            autoComplete="off"
            spellcheck={false}
          />
        </label>
        <div
          id="search-results"
          class="search-results"
          role="listbox"
          aria-label={placeholder}
          hidden
        ></div>
      </div>
    )
  }

  Search.css = style
  Search.afterDOMLoaded = script
  return Search
}) satisfies QuartzComponentConstructor<SearchOptions | undefined>
