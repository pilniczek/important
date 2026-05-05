// First-nav fallback is `document.referrer`.
let previousPath: string | null = null

type FilterControls = {
  nameInput: HTMLInputElement | null
  typeSelect: HTMLSelectElement | null
  tagSelect: HTMLSelectElement | null
  urlInput: HTMLInputElement | null
}

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

function defaultSelectValue(sel: HTMLSelectElement | null): string {
  if (!sel) return ""
  const def = Array.from(sel.options).find((o) => o.defaultSelected)
  return def?.value ?? sel.options[0]?.value ?? ""
}

function selectHasOption(sel: HTMLSelectElement | null, value: string): boolean {
  if (!sel) return false
  return Array.from(sel.options).some((o) => o.value === value)
}

function readFiltersFromURL(controls: FilterControls): boolean {
  const params = new URLSearchParams(window.location.search)
  let applied = false
  const name = params.get("name")
  if (name !== null && controls.nameInput) {
    controls.nameInput.value = name
    applied = true
  }
  const type = params.get("type")
  if (type !== null && selectHasOption(controls.typeSelect, type)) {
    controls.typeSelect!.value = type
    applied = true
  }
  const tag = params.get("tag")
  if (tag !== null && selectHasOption(controls.tagSelect, tag)) {
    controls.tagSelect!.value = tag
    applied = true
  }
  const urlParam = params.get("url")
  if (urlParam !== null && controls.urlInput) {
    controls.urlInput.value = urlParam
    applied = true
  }
  return applied
}

function writeFiltersToURL(controls: FilterControls) {
  const loc = window.location
  const params = new URLSearchParams(loc.search)
  const sync = (key: string, value: string, def: string) => {
    if (value === def) params.delete(key)
    else params.set(key, value)
  }
  sync("name", controls.nameInput?.value ?? "", controls.nameInput?.defaultValue ?? "")
  sync("type", controls.typeSelect?.value ?? "", defaultSelectValue(controls.typeSelect))
  sync("tag", controls.tagSelect?.value ?? "", defaultSelectValue(controls.tagSelect))
  sync("url", controls.urlInput?.value ?? "", controls.urlInput?.defaultValue ?? "")
  const qs = params.toString()
  const next = loc.pathname + (qs ? "?" + qs : "") + loc.hash
  history.replaceState(history.state, "", next)
}

function bind(view: HTMLElement) {
  const nameInput = view.querySelector<HTMLInputElement>(".database-filter-name")
  const typeSelect = view.querySelector<HTMLSelectElement>(".database-filter-type")
  const tagSelect = view.querySelector<HTMLSelectElement>(".database-filter-tag")
  const urlInput = view.querySelector<HTMLInputElement>(".database-filter-url")
  const controls: FilterControls = { nameInput, typeSelect, tagSelect, urlInput }
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
    writeFiltersToURL(controls)
  }

  resetInputToDefault(nameInput)
  resetSelectToDefault(typeSelect)
  resetSelectToDefault(tagSelect)
  resetInputToDefault(urlInput)
  // URL params take precedence over inferred archive context — an explicit
  // bookmark/back-restore should win over the referrer-based auto-select.
  const fromURL = readFiltersFromURL(controls)
  if (!fromURL) applyArchiveContextOverride(typeSelect)

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
