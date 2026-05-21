// Single source of truth for the mermaid quadrant chart size (in px).
// Imported by both the build-time renderer (plugins/transformers/ofm.ts) and
// the client re-render script (components/scripts/mermaid.inline.ts), so the
// server pre-render and the theme-toggle re-render can never drift.
// Change this one value to resize quadrant diagrams.
export const DEFAULT_QUADRANT_SIZE = 360
