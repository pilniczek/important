---
title: Configs 4 Linting
tags:
  - Linting
type:
  - How To
---

Place each config into the root of the project.

## .eslintrc

```jsx
{
  "root": true,
  "globals": {
    "graphql": true,
    "document": true,
    "window": true,
    "IntersectionObserver": true,
    "Sentry": true
  },
  "extends": [
    "next/core-web-vitals",
    "prettier"
  ],
  "plugins": [
    "react-hooks",
    "react",
    "unused-imports",
    "simple-import-sort",
    "mui",
    "json-format",
    "@typescript-eslint"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": [
      "./tsconfig.json"
    ]
  },
  "rules": {
    "@typescript-eslint/no-unsafe-return": "error",
    "react-hooks/exhaustive-deps": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-curly-brace-presence": [
      1,
      {
        "props": "never",
        "children": "never",
        "propElementValues": "always"
      }
    ],
    "no-tabs": "off",
    "simple-import-sort/exports": "error",
    "simple-import-sort/imports": "error",
    "unused-imports/no-unused-imports": "error",
    "mui/sort-sx-keys": "error",
    "max-len": [
      1,
      {
        "ignoreComments": true,
        "ignoreUrls": true,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true,
        "code": 100,
        "tabWidth": 1
      }
    ],
    "no-console": [
      "error",
      {
        "allow": [
          "warn",
          "error"
        ]
      }
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "json/sort-package-json": "pro"
  }
}
```

## .prettierrc

```jsx
{
  "printWidth": 100,
  "tabWidth": 1,
  "singleQuote": false,
  "bracketSpacing": true,
  "semi": true,
  "bracketSameLine": false,
  "useTabs": true,
  "trailingComma": "all",
  "overrides": [
    {
      "files": ["**/*.json", "**/*.yml", "**/.*", "**/*.md"],
      "options": {
        "useTabs": false,
        "tabWidth": 2
      }
    }
  ]
}
```

## .eslintignore .prettierignore

```jsx
**/.vscode/**/*
**/node_modules/**/*
**/.cache/**/*
**/public/**/*
**/static/**/*
**/fonts/**/*
**/images/**/*
**/typescript-fetch/**/*
./**/package-lock.json
./**/package.json
swagger.json
update-swagger.bat

tsconfig.json
README.md
**/.*
**/*.d.ts

apis/*
models/*
openapi2graphql
.openapi-generator-ignore
index.ts
openapitools.json
runtime.ts
.openapi-generator/*
src/data/*
```
