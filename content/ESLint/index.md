---
title: ESLint
tags:
  - Linting
type: Tool
---

**docs:** [https://eslint.org/docs/user-guide/getting-started](https://eslint.org/docs/user-guide/getting-started)

---

## Why

A unified code style is easier to understand and maintain.

It protects developers from reviewing useless git changes. (For example `tab` vs `space` changes.)

It protects developers from useless conflicts during a merge or a rebase. (For example, adding/removing import at the end of list of all imports.)

---

## Status

Compliance with rules is mandatory.

IDE must highlight the wrong code style.

IDE must fix the wrong code style automatically on save.

Pipeline and pre-commit hook check the code style.

When you try to make a commit with non-compliant changes, the pre-commit hook will stop the commit, the pipeline will fail.

---

### Lintování .json souborů

Lze nastavit, aby se lintovaly i `.json` a `.xxxrc` JSON soubory pomocí Eslint pluginu [eslint-plugin-json-format](https://www.npmjs.com/package/eslint-plugin-json-format).

### Automatické řazení importů

Lze nastavit, aby se sortovaly importy v `.js` souborech, řešení pomocí ESLint pluginu [eslint-plugin-simple-import-sort](https://www.npmjs.com/package/eslint-plugin-simple-import-sort).

### Automatické mazání nepoužitých importů

Lze nastavit, aby se odmazávaly nepoužité importy, řešení pomocí ESLint pluginu [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports).

### Automatické řazení CSS vlastnostní v MUI sx propertě

Lze vyřešit pomocí pluginu [https://www.npmjs.com/package/eslint-plugin-mui/v/0.1.0](https://www.npmjs.com/package/eslint-plugin-mui/v/0.1.0)

### Cypress lint

Lze nastavit, aby se lintovaly i soubory s Cypress testy, řešení pomocí pluginu [eslint-plugin-cypress](https://www.npmjs.com/package/eslint-plugin-cypress).

### Typescript lint

Since Gatsby natively supports TypeScript, you can change files from `.js` to `.tsx` at any point to start adding types... TypeScript integration is supported through automatically including `gatsby-plugin-typescript` however this solution has its limitations. It allows **Gatsby to build TS and TSX files but does not run type-checking by default.

**!!!** To fix this add `plugin:@typescript-eslint/recommended-requiring-type-checking` into `extends` in `.eslintrc`.  

This solution however comes with one disadvantage. Because the ESLint error report is tightly connected with the gatsby build process, all TS errors are now shown also in the gatsby build console and what’s more, due to these TS errors the builds are failing constantly. This behavior is a pain in the ass in situations when you are just prototyping something and can’t see the result of your work unless you fix all your TS errors. This is happening because `gatsby-plugin-eslint` presence in the `plugins` section of your `gatsby-config.js`. If you delete `gatsby-plugin-eslint` from the `plugins` array and under the declaration of this array you add something like this:

`if (process.env.NODE_ENV !== "development")
    plugins.push("gatsby-plugin-eslint");`

the errors which are causing the fail of the build will be now present only in production environment.

---

## Husky pre-commit hook

### Kontrola ESLint chyb

Lze nastavit, aby nešlo provést commit obsahující ESLint chyby, řešeno pomocí balíčku [lint-staged](https://www.npmjs.com/package/lint-staged).

### Řazení "scripts" v package.json

Lze nastavit, aby se sortovaly automaticky scripts v `package.json` podle abecedy, řešeno pomocí npm balíčku [sort-npm-scripts](https://www.npmjs.com/package/sort-npm-scripts)

### Code quality degradace

Vzniká follow-up issue, proto aby se nedostatky nehromadili. Nedodržování tohoto procesu povede k neudržitelnosti linter reportu.

---

---

## **Troubleshooting**

**"ParserOptions.project" has been set for @typescript-eslint/parser**

This error message is displayed for every file which is not a part of `include` array in `tsconfig.json`.

Solution: Don´t forget to add all your TS files which you are linting into this array: 

`"include": ["./src/**/***",** "cypress*/**/*", "gatsby-**.ts", "gatsby-*.tsx"]`
