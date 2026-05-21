---
title: "Technical Debt"
tags:
  - Basics
  - Architecture
  - Concept
  - Charts
type: Approach
section: Main
releaseDate: 2026-06-23
cssclasses:
  - tech-debt-curve
---

**Technical debt** is the accumulated cost of the shortcuts, skipped refactors, improper reviews and so on.

The clearest way to see it is to plot two things against time:

1. How **responsive** the system is to change (green, you want it _high_).
2. The **cost of change** (orange, you want it _low_).

```mermaid
%%{init: {"themeVariables": {"xyChart": {"backgroundColor": "transparent", "plotColorPalette": "#3a6814, #8a4a14, #3a6814, #8a4a14, #1f5294"}}, "xyChart": {"height": 250, "xAxis": {"showTick": false}, "yAxis": {"showLabel": false, "showTick": false}}}}%%
xychart-beta
    x-axis "Time" ["​", "​​", "​​​", "​​​​", "​​​​​", "​​​​​​", "​​​​​​​", "​​​​​​​​", "​​​​​​​​​", "​​​​​​​​​​", "​​​​​​​​​​​", "​​​​​​​​​​​​", "​​​​​​​​​​​​​", "​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​​​​​", "​​​​​​​​​​​​​​​​​​​​​"]
    y-axis "low → high" 0 --> 105
    line [98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98, 98]
    line [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    line [97.4, 96.9, 96.3, 95.2, 93.4, 90.6, 86.4, 80.3, 71.9, 61.4, 49.5, 37.6, 27.1, 18.7, 12.6, 8.4, 5.6, 3.8, 2.7, 2.1, 1.6]
    line [1.6, 2.1, 2.7, 3.8, 5.6, 8.4, 12.6, 18.7, 27.1, 37.6, 49.5, 61.4, 71.9, 80.3, 86.4, 90.6, 93.4, 95.2, 96.3, 96.9, 97.4]
    bar [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61.4, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```

|  |  |
| --- | --- |
| 🟩 **Responsiveness** | reality - decays as debt builds (Optimal responsiveness dashed) |
| 🟧 **Cost of change** | reality - climbs as debt builds (Optimal cost of change dashed) |
| 🟦 **Technical-debt** | one moment in time - the gap represents the debt |

**The crossover** - where the two bold lines meet, cost of change overtakes responsiveness. The system fights you more than it helps.

**The takeaway** - debt compounds, it doesn't grow steadily, it accelerates: each shortcut makes the next change harder, which invites more shortcuts.
