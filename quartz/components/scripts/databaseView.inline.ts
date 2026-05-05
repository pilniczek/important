// First-nav fallback is `document.referrer`.
let previousPath: string | null = null

function cameFromArchive(): boolean {
  const ref = previousPath ?? document.referrer
  return !!ref && ref.includes("/types/archived")
}

function applyArchiveContextOverride(typeSelect: HTMLSelectElement | null) {
  if (!typeSelect) return
  if (!cameFromArchive()) return
  const hasArchivedOption = Array.from(typeSelect.options).some((o) => o.value === "Archived")
  if (hasArchivedOption) typeSelect.value = "Archived"
}

// See AGENTS.md "SPA morph navigation & form state".
function resetSelectToDefault(sel: HTMLSelectElement | null) {
  if (!sel) return
  const def = Array.from(sel.options).find((o) => o.defaultSelected)
  sel.value = def?.value ?? sel.options[0]?.value ?? ""
}

function resetInputToDefault(input: HTMLInputElement | null) {
  if (input) input.value = input.defaultValue
}

function bind(view: HTMLElement) {
  const nameInput = view.querySelector<HTMLInputElement>(".database-filter-name")
  const typeSelect = view.querySelector<HTMLSelectElement>(".database-filter-type")
  const tagSelect = view.querySelector<HTMLSelectElement>(".database-filter-tag")
  const urlInput = view.querySelector<HTMLInputElement>(".database-filter-url")
  const rows = view.querySelectorAll<HTMLElement>(".database-row:not(.database-header)")

  const applyFilters = () => {
    const name = (nameInput?.value || "").toLowerCase().trim()
    const type = (typeSelect?.value || "").toLowerCase()
    const tag = (tagSelect?.value || "").toLowerCase()
    const url = (urlInput?.value || "").toLowerCase().trim()
    for (const row of rows) {
      const rName = row.dataset.name || ""
      const rTypes = (row.dataset.type || "").split("|")
      const rTags = (row.dataset.tags || "").split("|")
      const rUrl = row.dataset.url || ""
      const okName = !name || rName.includes(name)
      const okType =
        !type || (type === "__active__" ? !rTypes.includes("archived") : rTypes.includes(type))
      const okTag = !tag || rTags.includes(tag)
      const okUrl = !url || rUrl.includes(url)
      row.style.display = okName && okType && okTag && okUrl ? "" : "none"
    }
  }

  resetInputToDefault(nameInput)
  resetSelectToDefault(typeSelect)
  resetSelectToDefault(tagSelect)
  resetInputToDefault(urlInput)
  applyArchiveContextOverride(typeSelect)

  const ac = new AbortController()
  const signal = ac.signal
  nameInput?.addEventListener("input", applyFilters, { signal })
  typeSelect?.addEventListener("change", applyFilters, { signal })
  tagSelect?.addEventListener("change", applyFilters, { signal })
  urlInput?.addEventListener("input", applyFilters, { signal })
  window.addCleanup(() => ac.abort())

  applyFilters()
}

document.addEventListener("nav", () => {
  const view = document.querySelector<HTMLElement>(".database-view")
  if (view) bind(view)
  previousPath = window.location.pathname
})
