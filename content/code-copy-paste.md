---
title: Code copy paste
tags:
  - IDE
type:
  - How To
---

When you copy paste some imports from one directory level into different level you realise that you need to remove or add some “../” because you are in different level. We decide this behaviour is annoying and we like to resolve this.

### Solution 1.

Use your smart IDE. Some IDE can automatically add imports into new file based on original file because IDE know all files directory level. Just copy part of code (no part with imports) and **IDE do the magic** instead of you.

[WebStorm](https://www.jetbrains.com/help/idea/creating-and-optimizing-imports.html#automatically-add-import-statements)

[VSCode](https://marketplace.visualstudio.com/items?itemName=stringham.copy-with-imports)

### Solution 2.

In most cases you can avoid to need adding imports. You can tell nodejs to think that big part of code is in libraries by setting up npm or yarn. Just use **workspaces**. All components are in one library and every imports are imported from this library instead of folder. In the end imports are from libraries without relative paths. Add this part of code into root package.json and init almost empty new package.json in folder `./src/components/` 

```jsx
"workspaces": ["./src/components"]
```

This should do the basic `init` and also add a new workspace into the root `package.json`.

`npm init -w ./src/components`

## Combine

Do not worry to use both solutions. Both can solve just some cases.
