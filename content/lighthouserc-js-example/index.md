---
title: lighthouserc.js — config & project-type rules
tags:
  - Testing
  - Accessibility
type:
  - Tutorial / How To
---

## Full example

```jsx
module.exports = {
  ci: {
    collect: {
      settings: {
        onlyCategories: ["performance", "accessibility", "best-practices"],
        maxWaitForLoad: 15000,
        chromeFlags: "--headless --no-sandbox",
      },
      staticDistDir: "./public",
      autodiscoverUrlBlocklist: [
        "http://localhost/_gatsby/slices/_gatsby-scripts-1.html",
      ],
      maxAutodiscoverUrls: 5,
    },
    assert: {
      assertions: {
        "categories:performance": [
          "warn",
          { minScore: 0.55, aggregationMethod: "median" },
        ],
        "categories:accessibility": [
          "warn",
          { minScore: 0.88, aggregationMethod: "median" },
        ],
        "categories:best-practices": [
          "warn",
          { minScore: 0.86, aggregationMethod: "median" },
        ],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

## Project-type decisions

What you keep, drop, or loosen in `lighthouserc.js` depends on the project type.

### B2B (backoffice / intranet)

- "backoffice"
- není veřejně dostupný
- skrytý za loginem nebo dostupný jen v místní síti / intranet
- nepotřebuje SEO optimalizaci ani konfiguraci
- **first load** nemusí být hyperoptimalizovaný, neboť se nepředpokládá mnoho unikátních návštěcníků
- **accessibility** také nemusí být extra optimální, neboť existuje kontrola nad uživateli a jejich zařízeními (nicméně z pohledu businessu klienta může vyplývat, že naopak bude potřeby vysoká míra optimalizace)

**Lze zahodit:**

```
'categories:seo': [
],
'categories:pwa': [
],
```

**Lze částečně okleštit:**

```
'categories:performance': [
],
'categories:accessibility': [
],
```

### B2C (e-commerce / portal / presentation)

- přísné nastavení s vysokými nároky na scoring

**Lze zahodit:**

```
'categories:pwa': [
],
```
