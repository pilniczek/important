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
      <div>
        <label class="visually-hidden" for="database-filter-tag">
          Filter by tag
        </label>
        <select id="database-filter-tag" class="database-filter-tag">
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option value={t}>{t}</option>
          ))}
        </select>
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
