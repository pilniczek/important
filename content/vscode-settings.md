---
title: VSCode setup
tags:
  - IDE
  - Configuration
  - GIT
type: How To
section: Main
releaseDate: 2026-09-29
---

Settings, snippets and auto-run on open. Folders open through Remote-WSL, see [[claude-code-environment|Claude Code environment]].

## Extensions

See [[vscode-extensions|VSCode Extensions]].

## Snippets

Create with **File** → **Preferences** → **Configure Snippets**; syntax in the [snippets docs](https://code.visualstudio.com/docs/editing/userdefinedsnippets), [snippet-generator.app](https://snippet-generator.app/) builds the `body` array. Files in use: [[vscode-snippets-fe-utils|FE utils]], [[vscode-snippets-react|React]].

## Auto-run on open

A primary checkout opens → Git Graph and a `git sync` terminal tab, about 5 s later (`auto-run-command`'s built-in delay). Worktrees, non-repos and empty windows get nothing. Claude never auto-starts; `ctrl+alt+c` opens it.

```jsonc
{
  "auto-run-command.rules": [
    { "condition": "hasFile: .git/HEAD", "command": "git-graph.view" },
    { "condition": "hasFile: .git/HEAD", "command": "terminals.runTerminals" },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "git sync",
      "cwd": "${workspaceFolder}",
      "commands": ["git sync"],
      "autorun": true,
      "focus": false,
    },
  ],
}
```

Remote settings hold an identical copy.

- **Why `auto-run-command`** - Terminals Manager's own `autorun` reads only `.vscode/terminals.json`; `terminals.runTerminals` runs the global terminals.
- **Why `.git/HEAD`** - `hasFile` is a workspace search, so `.git` must be unhidden (`files.exclude`). A worktree's `.git` is a file, so worktrees skip both rules and [[git-sync#Main checkout only|git sync]] never runs there.
- **One command per entry** - Terminals Manager types commands ~200 ms after open, while `bash -i` still sources `~/.bashrc`; a second line gets swallowed. Chain with `;` if needed.
- `focus: false`, `workbench.startupEditor: "none"` and `window.restoreWindows: "all"` keep Git Graph in front.

### Claude on demand

`keybindings.json` (`Ctrl+Shift+P` → "Preferences: Open Keyboard Shortcuts (JSON)"):

```jsonc
{
  "key": "ctrl+alt+c",
  "command": "runCommands",
  "args": {
    "commands": [
      "workbench.action.createTerminalEditor",
      {
        "command": "workbench.action.terminal.sendSequence",
        "args": { "text": "claude\r" },
      },
    ],
  },
}
```

One chord opens a terminal tab in the editor area and types `claude`; the trailing `\r` submits it.

## settings.json (raw)

Live user `settings.json`, minus Postman temp paths, SonarQube URL replaced.

<!-- prettier-ignore -->
```jsonc
{
  "editor.accessibilitySupport": "off",
  "editor.fontLigatures": true,
  "editor.fontWeight": "100",
  "editor.inlineSuggest.enabled": true,
  "editor.insertSpaces": false,
  "editor.mouseWheelZoom": true,
  "editor.multiCursorModifier": "ctrlCmd",
  "editor.renderWhitespace": "boundary",
  "editor.rulers": [120, 100],
  "editor.smoothScrolling": true,
  "editor.snippetSuggestions": "bottom",
  "editor.suggest.showWords": false,
  "editor.tabSize": 2,
  "editor.unicodeHighlight.nonBasicASCII": false,
  "editor.wordWrap": "off",
  "explorer.confirmDelete": false,
  "explorer.sortOrder": "type",
  "files.associations": {
    "*.latte": "html",
    "*.svg": "html",
  },
  "files.eol": "\n",
  "files.exclude": {
    "**/*.linaria.css": true,
    "**/.DS_Store": true,
    "**/.cache": true,
    "**/.git": false, // needed for auto-run-command.rules -> git-graph.view
    "**/.hg": true,
    "**/.idea": true,
    "**/.svn": true,
    "**/CVS": true,
    //"**/dist": true,
    //"**/node_modules": true,
    "**/schema.graphql": true,
  },
  "files.insertFinalNewline": false,
  "git.branchSortOrder": "alphabetically",
  "git.confirmSync": false,
  "git.mergeEditor": false,
  "git.openRepositoryInParentFolders": "never",
  "git.suggestSmartCommit": false,
  "gitlens.hovers.currentLine.over": "line",
  "gitlens.views.formats.commits.description": "${agoOrDateShort}",
  "gitmoji.outputType": "emoji",
  "javascript.preferences.importModuleSpecifier": "non-relative",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "markdown.preview.openMarkdownLinks": "inEditor",
  "redhat.telemetry.enabled": false,
  "search.useIgnoreFiles": true,
  "security.workspace.trust.untrustedFiles": "open",
  "telemetry.telemetryLevel": "off",
  "terminal.integrated.enableMultiLinePasteWarning": "never",
  "terminal.integrated.scrollback": 10000,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "window.restoreWindows": "all",
  "workbench.editor.highlightModifiedTabs": true,
  "diffEditor.maxComputationTime": 0,
  "gitlens.views.commits.showBranchComparison": false,
  "gitlens.views.commits.pullRequests.enabled": false,
  "gitlens.views.commits.files.layout": "tree",
  "gitlens.views.formats.commits.label": "${message}",
  "remote.autoForwardPortsSource": "hybrid",
  "editor.formatOnSave": true,
  "editor.unicodeHighlight.invisibleCharacters": false,
  "editor.unicodeHighlight.ambiguousCharacters": false,
  "terminal.integrated.defaultProfile.windows": "Command Prompt",
  "diffEditor.ignoreTrimWhitespace": false,
  "cSpell.blockCheckingWhenLineLengthGreaterThan": 100000,
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "sonarlint.disableTelemetry": true,
  "sonarlint.automaticAnalysis": true,
  "sonarlint.connectedMode.connections.sonarqube": [
    {
      "serverUrl": "https://sonarqube.example.com",
      "connectionId": "https-sonarqube-example-com",
    },
  ],
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "sonarlint.focusOnNewCode": true,
  "workbench.startupEditor": "none",
  "task.allowAutomaticTasks": "on",
  "auto-run-command.rules": [
    {
      "condition": "hasFile: .git/HEAD",
      "command": "git-graph.view", // needs files.exclude -> git
    },
    {
      // .git/HEAD exists only in a PRIMARY checkout (a linked worktree's .git is a file,
      // not a dir), so this fires exactly ONCE — from the main project, never per worktree
      // window. The launcher script below then enumerates `git worktree list` and opens one
      // Claude terminal for main AND each worktree. Also skips non-git folders.
      "condition": "hasFile: .git/HEAD",
      "command": "terminals.runTerminals",
    },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "git sync",
      "cwd": "${workspaceFolder}",
      "commands": ["git sync"],
      "autorun": true,
      "focus": false,
    },
  ],
  "terminal.integrated.defaultLocation": "editor",
  "terminal.integrated.mouseWheelScrollSensitivity": 3,
  "github.copilot.nextEditSuggestions.extendedRange": true,
  "github.copilot.chat.notebook.enhancedNextEditSuggestions.enabled": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".claude/rules": true,
    "~/.copilot/instructions": true,
    "~/.claude/rules": true,
  },
  "yaml.disableSchemaDetection": [
    "azure-pipelines.yml",
    "azure-pipelines.yaml",
  ],
  "claudeCode.preferredLocation": "panel",
  //"claudeCode.useTerminal": true,
}
```

---

Related: [[claude-code-environment|Claude Code environment]] · [[git-sync|Sync the default branch]] · [[configuration-example|Configuration Example]] · [[vscode-snippets-fe-utils|Snippets - FE utils]] · [[vscode-snippets-react|Snippets - React]]
