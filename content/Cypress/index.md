---
archived: true
title: Cypress
tags:
  - Testing
type: Tool
---

## Targetování testovaných prvků

Používáme atributy `data-test` pro [targetování elementů](https://docs.cypress.io/guides/references/best-practices#Selecting-Elements) na obrazovce

Atributy `data-test` nesmí do produkce, Babel config se upraví přes [https://www.npmjs.com/package/babel-plugin-jsx-remove-data-test-id](https://www.npmjs.com/package/babel-plugin-jsx-remove-data-test-id).

Na různých projektech se produkce od devu může lišit různě!

## Spouštění testů

### Developer a Tester

Viz package.json `*"test-ui"*: "./node_modules/.bin/cypress run",` - tedy `npm run test-ui`.

Může si je spustit kdokoli manuálně.

Může se spustit v pre-commit hooku (husky).

Pokud vývojáři neprojde test, opraví si kód nebo pushne a napíše do merge requestu, proč se to tak má mergnout.

Pokud testerovi neprojde test, zkontroluje merge request. Pokud tam není vysvětleno, proč může test failnout, vrátí práci vývojáři.

### Pipeline

Viz .gitlab-ci.yml `- CYPRESS_REPORTER="junit" npm run test-ui --record --parallel --browser chrome --group "UI - Chrome"`

Zároveň je možnost v detailu pipeline stáhnout proces testu jako `artifacts` z `cypress/videos/` a `cypress/screenshots/`

Výsledek testu nesmí bránit mergnutí (failnutí testu vyhazuje warning).

Pokud se merguje s warningem, je potřeba do merge requestu napsat vysvětlení a zložit follow-up issue pro vyřešené danného warningu.

## Konfigurace testu

Command line příkaz `cypress run` lze konfigurovat třemi způsoby:

1. konfigurační soubor `cypress.json`,
2. [parametry](https://docs.cypress.io/guides/guides/command-line#Options) za příkazem,
3. ENVIRONMENT VARIABLES.

Pokud vytvoříte soubor `cypress.json` VŠECHNY parametry za příkazem jsou ignorovány, i ty, které v konfiguračním souboru vůbec nejsou.

Ref.:

- [https://docs.cypress.io/guides/guides/command-line#Options](https://docs.cypress.io/guides/guides/command-line#Options)
