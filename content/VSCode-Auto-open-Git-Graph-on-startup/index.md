---
title: "VSCode: Auto-open Git Graph on startup"
tags:
  - IDE
type: Tutorial / How To
---

1. Open `settings.json` (Ctrl+Shift+P → "Preferences: Open User Settings (JSON)")
2. Add `"workbench.startupEditor": "none"` to disable Welcome tab
3. Add `"window.restoreWindows": "all"` to restore previous session
4. Install extension **Auto Run Command** (`gabrielgrinberg.auto-run-command`)
5. Add to `settings.json`:
    
    ```jsx
    "auto-run-command.rules": [
      {
        "condition": "always",
        "command": "git-graph.view"
      }
    ]
    ```
    
6. Restart VSCode to verify Git Graph opens automatically

**Required extensions:** `mhutchie.git-graph`, `gabrielgrinberg.auto-run-command`
