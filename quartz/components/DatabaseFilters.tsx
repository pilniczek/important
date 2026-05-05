interface DatabaseFiltersProps {
  allTypes: string[]
  allTags: string[]
  showActiveFilter?: boolean
}

export function DatabaseFilters({
  allTypes,
  allTags,
  showActiveFilter,
}: Readonly<DatabaseFiltersProps>) {
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
        <label class="visually-hidden" for="database-filter-type">
          Filter by type
        </label>
        <div class="database-filter-type-wrap">
          <select id="database-filter-type" class="database-filter-type">
            <option value="">All types</option>
            {showActiveFilter && (
              <option value="__active__" selected>
                Active
              </option>
            )}
            {allTypes.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </select>
        </div>
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
