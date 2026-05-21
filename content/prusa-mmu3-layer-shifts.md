---
title: Resolving layer shifts in MMU3 multi-material printing
tags:
  - 3D Print
  - Prusa
  - MMU3
type: How To
section: Utilities
releaseDate: 2026-05-30
url: https://forum.prusa3d.com/forum/original-prusa-i3-mmu3-assembly-and-first-prints-troubleshooting/layer-shifts-after-installing-mmu3/
---

## Causes identified in the thread

- Nozzle hitting a blob on the wipe/purge tower
- Belt tension loss
- Nozzle temperature too high
- Wide temperature spread between loaded filaments
- Corrupted or custom PrusaSlicer profiles

## What to do

1. Run belt tuning and re-tension the belts
2. Lower the nozzle temperature (keep all loaded filaments at a similar temperature)
3. In PrusaSlicer, increase the wipe-tower purge-line spacing (300%)
4. Lower wipe-tower flow / purge volumes (less material piles up on the tower)
5. Start from clean, stock filament profiles (Reinstall PrusaSlicer)
6. Update the printer firmware
7. Keep filament dry and the feed path clear
8. Re-check the mechanical basics (belt pulleys and grub screws, stepper motor current, and overall frame/mechanical integrity)

## Tips beyond original thread

- **Z-lift G-code workaround** — lift the nozzle so it hops over the tower instead of clipping a blob. Add a custom G-code line such as `G1 Z{min(layer_z+15,max_print_height)} F3000` to raise Z by 15 mm. Source: Prusa forum — [Wipe tower causes layer shift](https://forum.prusa3d.com/forum/prusa-core-one-how-do-i-print-this-printing-help/wipe-tower-causes-layer-shift/).
- **"Extra flow for purging" setting** — defaults to `250%` under Print Settings → Multiple Extruders → Wipe Tower in PrusaSlicer; lowering it is another knob to reduce over-purge and the resulting blob. Source: PrusaSlicer GitHub — [Wipe tower blob crash mitigation (issue #14784)](https://github.com/prusa3d/PrusaSlicer/issues/14784).
