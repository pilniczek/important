---
title: VSCode Linting on save
---

Add the .vscode folder to the root of the project and insert custom settings.

## settings.json

```jsx
{
  "editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
  "editor.formatOnPaste": false, // required 
  "editor.formatOnType": false, // required
  "editor.formatOnSave": true, // optional 
  "editor.formatOnSaveMode": "file", // required to format on save
}
```

## Extension

[https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint)
