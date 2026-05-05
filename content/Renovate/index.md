---
title: Renovate
tags:
  - NPM
type: Tool
---

# Popis problému:

Na projektu většinou nainstalujeme jednu verzi knihovny a poté na ni již nesaháme. Verze ale časem ztrácí podporu a mohou v ní být nalezeny nějaké chyby, ať už kritické nebo ne.

GitHub pro toto má nativní řešení pomocí [Dependabot](https://github.com/dependabot). To však na GitLab není.

Existují wrappery Dependabot, které ho přidávají do GitLabu, ale to není nejlepší řešení.

# Řešení problému

K tomuto přichází na světlo [Renovate](https://docs.renovatebot.com/). To je opensource alternativa pro Dependabot nasaditelná na jakémkoliv prostředí.

Renovate se tedy do přidat do projektu dvěma způsoby.

1. Jeden centrální repozitář a bot, který běží nad vším, k čemu má přístup.
2. Bot a nastavení v každém repozitáři zvlášť.

Zprovoznění obou variant je velice podobné. Jediný rozdíl je v tom, jaký access token se vytvoří a jak se upravuje nastavení pro daný repozitář a kdo může přidávat a odebírat repozitáře. Plus první způsob nevyžaduje bot účet.

Obecně doporučení je první způsob.

## Každý repozitář zvlášť

do repozitáře přidáme 2 soubory a 1 pipeline.

Soubory: 

`config.js`

```jsx
module.exports = {
    endpoint: "",
    platform: "gitlab",
    persistRepoData: true,
    "$schema": "https://docs.renovatebot.com/renovate-schema.json",
    onboardingConfig: {
        extends: [
            "config:recommended"
        ],
    },
    autodiscover: true,
    onboarding: false
};
```

`renovate.json`

```jsx
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "packageRules": [
    {
      "depTypeList": [ "devDependencies", "require-dev" ],
      "updateTypes": [ "patch", "minor", "digest"],
      "groupName": "devDependencies (non-major)"
    }
  ],
  "extends": [
    "config:base",
    ":preserveSemverRanges",
    ":dependencyDashboard",
    ":rebaseStalePrs",
    ":enableVulnerabilityAlertsWithLabel('security')",
    "group:recommended"
  ]
}

```

- První soubor říká nastavení pro renovate. Seznam dostupné konfigurace je dostupný zde: [https://docs.renovatebot.com/config-overview/](https://docs.renovatebot.com/config-overview/)
- Je zde konfigurované základní nastavení, které se netýká samotného kontrolování repozitáře.
- Druhý soubor říká jaké schéma se má používat a jaké jsou nastavení pro kontrolu repozitáře.

Další věc je pipeline, která poběží pravidelně v intervalech, (nastaví se později)

`gitlab-ci.yml`:

```jsx
renovate:
  stage: repo_check
  image: renovate/renovate:latest
  variables:
    RENOVATE_OPTIMIZE_FOR_DISABLED: "true"
    RENOVATE_REPOSITORY_CACHE: "true"
    LOG_LEVEL: debug
  cache:
    key: ${CI_COMMIT_REF_SLUG}-renovate
    paths:
      - $CI_PROJECT_DIR/renovate
  resource_group: production
  only:
    - schedules
  script:
    - renovate --token $RENOVATE_TOKEN $RENOVATE_EXTRA_FLAGS
```

- Stage je `repo_check`, takže to běží stejně jako třeba fixup check. Není to však tak důležité.

`$RENOVATE_TOKEN`

- vyžaduje příslušnou roli pro úpravu CI/CD variables a vytváření access tokenů
1. Jdeme do repozitářových `Settings → Access Tokens` a vytvoříme nový token s rolí alespoň `developer` a 3 scopes
    - api
    - read_api
    - write_repository
2. Zkopírujeme token
3. Jdeme do `Settings → CI/CD -> Variables`  a přidáme variable `RENOVATE_TOKEN` s hodnotou tokenu z kroku 2

Nakonec přidáme opakovatelné spouštění pipeline

- jdeme do `Build → Pipeline schedules → New schedule`
- zde si zadefinujeme jak často a kdy má renovate běžet
- **POZOR!!!!!** Renovate beží pouze nad `default branch` takže buď nad `main` nebo `dev`  podle nastavení projektu.
    - defualt branch se tedy musí vybrat v seznamu nad jakou branch má tento schedule běžet
    - pokud chceme otestovat, tak musí být výše vytvořené soubory v default branch
- pipeline se dá spustit i manuálně pokud chceme testovat

Ještě se dají nastavit Release notes z GitHub, ale to nevím jak zprovoznit bez bot accountu, který se toto snaží eliminovat.

## Centrální repozitář

Tento přístup má výhodu oproti předchozímu řešení, repozitář s pipeline je jenom jeden.

Ale zase bot se bude spouštět nad všemi repozitářemi, nad kterými může.

Toto vyžaduje, aby byl vytvořen repozitář s předchozími soubory a vším ostatním stejně až na token. Token musí být vytvořen tak, aby poskytoval práva ke všem repozitářům, nad kterými chceme pouštět Renovate.

Konfigurace pro jednotlivé repozitáře se pak dá dodat do každého repozitáře zvlášť tak, že přidáme do daného repozitáře `renovate.json`

```jsx
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "path/to/config/repo",
    ...overwrites
  ]
}
```

a pouze upravíme extends. Pozor, toto však jenom sjednocuje dané konfigurace — něco jako eslint, takže pokud něco chceme vypnout, musí se to explicitně vypnout pokud to něco jiného povolilo.

## Shrnutí

Jsou zde popsány 2 způsoby, jak nastavit Renovate. Doporučení Tomáše Pilnaje je první způsob. Za mě je první způsob také lepší. Sice je to více kopírování a porušování DRY, ale druhý způsob zase vyžaduje více administrace od někoho, kdo může přidávat lidi do projektů a bot account v gitlabu.
