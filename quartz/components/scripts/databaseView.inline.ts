// DatabaseView client-side filter behaviour.
// Wires up the filter inputs on each `nav` event (Quartz uses SPA navigation,
// so we re-bind on each page load).

function bind(view: HTMLElement) {
  const nameInput = view.querySelector<HTMLInputElement>(".database-filter-name")
  const typeSelect = view.querySelector<HTMLSelectElement>(".database-filter-type")
  const tagSelect = view.querySelector<HTMLSelectElement>(".database-filter-tag")
  const urlInput = view.querySelector<HTMLInputElement>(".database-filter-url")
  const tbody = view.querySelector<HTMLTableSectionElement>(".database-table tbody")
  if (!tbody) return

  const applyFilters = () => {
    const name = (nameInput?.value || "").toLowerCase().trim()
    const type = (typeSelect?.value || "").toLowerCase()
    const tag = (tagSelect?.value || "").toLowerCase()
    const url = (urlInput?.value || "").toLowerCase().trim()
    for (const row of Array.from(tbody.rows)) {
      const rName = row.dataset.name || ""
      const rType = row.dataset.type || ""
      const rTags = (row.dataset.tags || "").split("|")
      const rUrl = row.dataset.url || ""
      const okName = !name || rName.includes(name)
      const okType = !type || rType === type
      const okTag = !tag || rTags.includes(tag)
      const okUrl = !url || rUrl.includes(url)
      row.style.display = okName && okType && okTag && okUrl ? "" : "none"
    }
  }

  nameInput?.addEventListener("input", applyFilters)
  typeSelect?.addEventListener("change", applyFilters)
  tagSelect?.addEventListener("change", applyFilters)
  urlInput?.addEventListener("input", applyFilters)

  applyFilters()
}

document.addEventListener("nav", () => {
  const view = document.querySelector<HTMLElement>(".database-view")
  if (view) bind(view)
})
