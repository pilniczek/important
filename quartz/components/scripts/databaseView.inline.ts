// First-nav fallback is `document.referrer`.
let previousPath: string | null = null

type FilterControls = {
  nameInput: HTMLInputElement | null
  typeSelect: HTMLSelectElement | null
  tagCheckboxes: HTMLInputElement[]
  tagLabel: HTMLElement | null
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

function resetCheckboxesToDefault(boxes: HTMLInputElement[]) {
  for (const cb of boxes) cb.checked = cb.defaultChecked
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

function selectedTagValues(controls: FilterControls): string[] {
  return controls.tagCheckboxes.filter((cb) => cb.checked).map((cb) => cb.value.toLowerCase())
}

function updateTagSummary(controls: FilterControls) {
  if (!controls.tagLabel) return
  const checked = controls.tagCheckboxes.filter((cb) => cb.checked)
  const empty = controls.tagLabel.dataset.emptyLabel ?? "All tags"
  if (checked.length === 0) controls.tagLabel.textContent = empty
  else controls.tagLabel.textContent = checked.map((cb) => cb.value).join(", ")
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
  const tagParams = params.getAll("tag")
  if (tagParams.length > 0) {
    const wanted = new Set(tagParams.map((t) => t.toLowerCase()))
    let any = false
    for (const cb of controls.tagCheckboxes) {
      const want = wanted.has(cb.value.toLowerCase())
      cb.checked = want
      if (want) any = true
    }
    if (any) applied = true
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
  params.delete("tag")
  for (const t of selectedTagValues(controls)) params.append("tag", t)
  sync("url", controls.urlInput?.value ?? "", controls.urlInput?.defaultValue ?? "")
  const qs = params.toString()
  const next = loc.pathname + (qs ? "?" + qs : "") + loc.hash
  history.replaceState(history.state, "", next)
}

function bind(view: HTMLElement) {
  const nameInput = view.querySelector<HTMLInputElement>(".database-filter-name")
  const typeSelect = view.querySelector<HTMLSelectElement>(".database-filter-type")
  const tagContainer = view.querySelector<HTMLDetailsElement>(".database-filter-tag")
  const tagSummary = tagContainer?.querySelector<HTMLElement>("summary") ?? null
  const tagPanel = view.querySelector<HTMLElement>(".database-filter-tag-panel")
  const tagCheckboxes = Array.from(
    view.querySelectorAll<HTMLInputElement>(".database-filter-tag-checkbox"),
  )
  const tagLabel = view.querySelector<HTMLElement>(".database-filter-tag-label")
  const tagSearch = view.querySelector<HTMLInputElement>(".database-filter-tag-search")
  const tagClearBtn = view.querySelector<HTMLButtonElement>(".database-filter-tag-clear")
  const tagOptions = Array.from(view.querySelectorAll<HTMLElement>(".database-filter-tag-option"))
  const urlInput = view.querySelector<HTMLInputElement>(".database-filter-url")
  const controls: FilterControls = { nameInput, typeSelect, tagCheckboxes, tagLabel, urlInput }
  const rows = view.querySelectorAll<HTMLElement>(".database-row:not(.database-header)")

  const applyTagSearch = () => {
    const q = (tagSearch?.value || "").toLowerCase().trim()
    for (const opt of tagOptions) {
      const tag = opt.dataset.tag || ""
      opt.style.display = !q || tag.includes(q) ? "" : "none"
    }
  }

  const applyFilters = () => {
    const name = (nameInput?.value || "").toLowerCase().trim()
    const type = (typeSelect?.value || "").toLowerCase()
    const tags = selectedTagValues(controls)
    const url = (urlInput?.value || "").toLowerCase().trim()
    for (const row of rows) {
      const rName = row.dataset.name || ""
      const rTypes = (row.dataset.type || "").split("|")
      const rTags = (row.dataset.tags || "").split("|")
      const rUrl = row.dataset.url || ""
      const okName = !name || rName.includes(name)
      const okType =
        !type || (type === "__active__" ? !rTypes.includes("archived") : rTypes.includes(type))
      const okTag = tags.length === 0 || tags.every((t) => rTags.includes(t))
      const okUrl = !url || rUrl.includes(url)
      row.style.display = okName && okType && okTag && okUrl ? "" : "none"
    }
    updateTagSummary(controls)
    writeFiltersToURL(controls)
    if (tagClearBtn) tagClearBtn.hidden = !tagCheckboxes.some((cb) => cb.checked)
  }

  resetInputToDefault(nameInput)
  resetSelectToDefault(typeSelect)
  resetCheckboxesToDefault(tagCheckboxes)
  resetInputToDefault(tagSearch)
  resetInputToDefault(urlInput)
  applyTagSearch()
  // URL params take precedence over inferred archive context — an explicit
  // bookmark/back-restore should win over the referrer-based auto-select.
  const fromURL = readFiltersFromURL(controls)
  if (!fromURL) applyArchiveContextOverride(typeSelect)

  const ac = new AbortController()
  const signal = ac.signal
  nameInput?.addEventListener("input", applyFilters, { signal })
  typeSelect?.addEventListener("change", applyFilters, { signal })
  for (const cb of tagCheckboxes) cb.addEventListener("change", applyFilters, { signal })
  tagSearch?.addEventListener("input", applyTagSearch, { signal })
  tagClearBtn?.addEventListener(
    "click",
    () => {
      for (const cb of tagCheckboxes) cb.checked = false
      applyFilters()
    },
    { signal },
  )
  // Place the tag panel relative to its summary in viewport coordinates.
  // The panel is position:fixed so it escapes .database-table's overflow
  // clip; that means we have to compute its top/left/width ourselves and
  // re-place on scroll/resize while open. Flip above the summary if the
  // viewport doesn't have room below.
  const placeTagPanel = () => {
    if (!tagSummary || !tagPanel) return
    const rect = tagSummary.getBoundingClientRect()
    const gap = 2
    const viewportMargin = 8
    // Size the panel to its content, but never narrower than the summary and
    // never wider than the viewport. Without this, the panel was locked to
    // rect.width and long tag names were ellipsized.
    tagPanel.style.width = ""
    tagPanel.style.minWidth = `${rect.width}px`
    tagPanel.style.maxWidth = `${window.innerWidth - viewportMargin * 2}px`
    const panelWidth = tagPanel.offsetWidth
    const panelHeight = tagPanel.offsetHeight
    const spaceBelow = window.innerHeight - rect.bottom
    const top =
      spaceBelow >= panelHeight + gap || rect.top < panelHeight + gap
        ? rect.bottom + gap
        : rect.top - panelHeight - gap
    // Shift left when a content-wider panel would overflow the right edge.
    const maxLeft = window.innerWidth - panelWidth - viewportMargin
    const left = Math.max(viewportMargin, Math.min(rect.left, maxLeft))
    tagPanel.style.top = `${top}px`
    tagPanel.style.left = `${left}px`
  }
  let openCycle: AbortController | null = null
  signal.addEventListener("abort", () => openCycle?.abort())
  tagContainer?.addEventListener(
    "toggle",
    () => {
      openCycle?.abort()
      if (!tagContainer.open) {
        openCycle = null
        return
      }
      placeTagPanel()
      tagSearch?.focus()
      openCycle = new AbortController()
      const openSignal = openCycle.signal
      window.addEventListener("scroll", placeTagPanel, {
        capture: true,
        passive: true,
        signal: openSignal,
      })
      window.addEventListener("resize", placeTagPanel, { signal: openSignal })
    },
    { signal },
  )
  urlInput?.addEventListener("input", applyFilters, { signal })
  if (tagContainer) {
    document.addEventListener(
      "pointerdown",
      (e) => {
        if (!tagContainer.open) return
        if (e.target instanceof Node && tagContainer.contains(e.target)) return
        tagContainer.open = false
      },
      { signal },
    )
  }
  window.addCleanup(() => ac.abort())

  applyFilters()
}

document.addEventListener("nav", () => {
  const view = document.querySelector<HTMLElement>(".database-view")
  if (view) bind(view)
  previousPath = window.location.pathname
})
