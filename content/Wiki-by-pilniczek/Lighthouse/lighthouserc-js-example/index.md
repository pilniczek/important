---
title: lighthouserc.js example
---

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
