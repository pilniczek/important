---
title: VSCode Setup
tags:
  - IDE
type: How To
section: Main
releaseDate: 2026-06-11
---

Current VSCode configuration — `settings.json` (Windows + WSL Remote) and the installed extension list. Snippets live separately in [[vscode-snippets|VSCode Snippets]]; the workspace-open automation (Claude terminal, `git sync`, Git Graph) is in [[vscode-autorun-claude-on-open|Autorun on workspace open]].

## Managing settings & extensions

- **Open the JSON settings**: `Ctrl+Shift+P` → "Preferences: Open User Settings (JSON)".
  For a WSL Remote project, `Ctrl+,` → the **Remote &#91;WSL: &lt;distro&gt;&#93;** tab → the `{}` icon.
- **Export installed extensions**: `code --list-extensions`.
- **Install one**: `code --install-extension <id>`.
- **TIP:** to reinstall the whole set, take the extension list below, prefix each line with
  `code --install-extension `, and paste the block into a terminal.

## settings.json (Windows)

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
  "terminal.integrated.fontSize": 11,
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
  "gitlens.ai.model": "vscode",
  "gitlens.ai.vscode.model": "copilot:gpt-4.1",
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
      "condition": "hasFile: **/*",
      "command": "terminals.runTerminals",
    },
  ],
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "cmd",
      "cwd": "${workspaceFolder}",
      "commands": [
        "start \"\" wt.exe -d \"${workspaceFolder}\" cmd /k claude",
        "git sync",
      ],
      "autorun": true,
      "focus": true,
    },
  ],
  "claudeCode.initialPermissionMode": "plan",
  "claudeCode.preferredLocation": "panel",
  "terminal.integrated.mouseWheelScrollSensitivity": 3,
  "github.copilot.nextEditSuggestions.extendedRange": true,
  "github.copilot.chat.notebook.enhancedNextEditSuggestions.enabled": true,
  "chat.instructionsFilesLocations": {
    ".github/instructions": true,
    ".claude/rules": true,
    "~/.copilot/instructions": true,
    "~/.claude/rules": true,
  },
}
```

>  The `auto-run-command.rules` + `terminals.terminals` blocks drive workspace-open automation — see [[vscode-autorun-claude-on-open|Autorun on workspace open]] for how they work.

## settings.json (WSL Remote)

In the WSL machine settings (`~/.vscode-server/data/Machine/settings.json`). Replace
`<your-windows-user>` with your Windows username:

```jsonc
{
  "terminals.autorun": true,
  "terminals.terminals": [
    {
      "name": "Claude",
      "cwd": "${workspaceFolder}",
      "commands": [
        "/mnt/c/Users/<your-windows-user>/AppData/Local/Microsoft/WindowsApps/wt.exe new-tab wsl.exe --cd ${workspaceFolder} -- bash -ic \"claude\\; exec bash\" ; git sync"
      ],
      "autorun": true,
      "focus": true
    }
  ],
  "github.copilot.nextEditSuggestions.extendedRange": true,
  "github.copilot.chat.notebook.enhancedNextEditSuggestions.enabled": true
}
```

## Extensions

Current `code --list-extensions` output:

```
ambooth.git-rename
anthropic.claude-code
arjun.swagger-viewer
davidanson.vscode-markdownlint
dbaeumer.vscode-eslint
dsznajder.es7-react-js-snippets
eamodio.gitlens
ecmel.vscode-html-css
erickriva.git-watch-vscode-rename
esbenp.prettier-vscode
fabiospampinato.vscode-terminals
gabrielgrinberg.auto-run-command
growthjack.claude-code-usage
christian-kohler.path-intellisense
infeng.vscode-react-typescript
ionutvmi.path-autocomplete
jfrog.jfrog-vscode-extension
jock.svg
kamikillerto.vscode-colorize
kisstkondoros.vscode-gutter-preview
louiswt.regexp-preview
mgmcdermott.vscode-language-babel
mhutchie.git-graph
mikestead.dotenv
ms-azure-devops.azure-pipelines
ms-azuretools.vscode-containers
ms-azuretools.vscode-docker
ms-playwright.playwright
ms-vscode-remote.remote-wsl
ms-vscode.sublime-keybindings
mylesmurphy.prettify-ts
paulmolluzzo.convert-css-in-js
pkosta2006.vscode-cli
postman.postman-for-vscode
redhat.vscode-yaml
seatonjiang.gitmoji-vscode
shd101wyy.markdown-preview-enhanced
sonarsource.sonarlint-vscode
streetsidesoftware.code-spell-checker
tomoki1207.pdf
vercel.turbo-vsc
wallabyjs.quokka-vscode
wix.vscode-import-cost
yoavbls.pretty-ts-errors
```

## Not currently installed (from older setups)

Extensions documented in earlier setups but **not in the current install** — kept here as a
shopping list, not re-added above. Reinstall any with `code --install-extension <id>`:

```
abumalick.vscode-nvm
ajhyndman.vscode-svgo
albymor.increment-selection
Asuka.insertnumbers
attilabuti.vscode-mjml
christian-kohler.npm-intellisense
dagra.jsonschemautils
dakshmiglani.hex-to-rgba
DSKWRK.vscode-generate-getter-setter
dzannotti.vscode-babel-coloring
fabiospampinato.vscode-diff
GitHub.copilot
GitLab.gitlab-workflow
gitpod.gitpod-remote-ssh
gkotas.restore-git-branch-tabs
Gruntfuggly.todo-tree
henoc.svgeditor
JHeilingbrunner.vscode-gnupg-tool
jumpinjackie.vscode-map-preview
kumar-harsh.graphql-for-vscode
mattpocock.ts-error-translator
ms-vscode-remote.remote-containers
ms-vscode-remote.remote-ssh
ms-vscode-remote.remote-ssh-edit
ms-vscode-remote.vscode-remote-extensionpack
ms-vscode.azure-account
ms-vscode.remote-explorer
ms-vscode.remote-server
ms-vscode.vscode-typescript-next
ms-vsliveshare.vsliveshare
ms-vsliveshare.vsliveshare-audio
pmneo.tsimporter
richie5um2.vscode-sort-json
rvest.vs-code-prettier-eslint
Shan.code-settings-sync
steoates.autoimport
Tyriar.sort-lines
wix.glean
wmaurer.change-case
zengxingxin.sort-js-object-keys
```
