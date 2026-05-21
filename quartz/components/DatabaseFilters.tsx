export interface PrimaryFilterOption {
  value: string
  label: string
}

/** The polymorphic second-column dropdown — filters `type` or `section`
 *  depending on the page kind (see `buildPrimaryFilter` in DatabaseView). */
export interface PrimaryFilter {
  dim: "type" | "section"
  ariaLabel: string
  allLabel: string
  defaultValue: string
  options: PrimaryFilterOption[]
}

interface DatabaseFiltersProps {
  primaryFilter: PrimaryFilter | null
  allTags: string[]
}

export function DatabaseFilters({ primaryFilter, allTags }: Readonly<DatabaseFiltersProps>) {
  const isDefault = (value: string) =>
    !!primaryFilter && value.toLowerCase() === primaryFilter.defaultValue.toLowerCase()
  return (
    <div class="database-row database-header">
      <div>
        <label class="visually-hidden" for="database-filter-name">
          Filter by name
        </label>
        <input
          id="database-filter-name"
          type="search"
          class="database-filter-name"
          placeholder="Filter by name"
        />
      </div>
      <div>
        {primaryFilter && (
          <>
            <label class="visually-hidden" for="database-filter-type">
              {primaryFilter.ariaLabel}
            </label>
            <div class="database-filter-type-wrap">
              <select
                id="database-filter-type"
                class="database-filter-type"
                data-filter-dim={primaryFilter.dim}
              >
                <option value="" selected={isDefault("")}>
                  {primaryFilter.allLabel}
                </option>
                {primaryFilter.options.map((o) => (
                  <option value={o.value} selected={isDefault(o.value)}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      <div>
        <details class="database-filter-tag">
          <summary>
            <span class="database-filter-tag-label" data-empty-label="All tags">
              All tags
            </span>
          </summary>
          <div class="database-filter-tag-panel">
            <div class="database-filter-tag-search-row">
              <input
                type="search"
                class="database-filter-tag-search"
                placeholder="Search tags…"
                aria-label="Search tags"
              />
              <button
                type="button"
                class="database-filter-tag-clear"
                aria-label="Clear selected tags"
                hidden
              >
                Clear
              </button>
            </div>
            <div class="database-filter-tag-options">
              {allTags.map((t) => (
                <label key={t} class="database-filter-tag-option" data-tag={t.toLowerCase()}>
                  <input type="checkbox" class="database-filter-tag-checkbox" value={t} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>
        </details>
      </div>
      <div>
        <label class="visually-hidden" for="database-filter-url">
          Filter by URL
        </label>
        <input
          id="database-filter-url"
          type="search"
          class="database-filter-url"
          placeholder="Filter by URL"
        />
      </div>
    </div>
  )
}
