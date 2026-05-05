---
title: Gatsby
---

**docs:** [https://www.gatsbyjs.com/docs/](https://www.gatsbyjs.com/docs/)

[[DEPRECATED] Start a project - Gatsby](../%5BDEPRECATED%5D-Start-a-project-Gatsby/index.md)

[Gatsby Plugins](../Gatsby-Plugins/index.md)

[Gatsby Trailing Slash](../Gatsby-Trailing-Slash/index.md)

[Gatsby Configurable File Routing](../Gatsby-Configurable-File-Routing/index.md)

---

## Why

We use Gatsby because it is a static site generator. It means pre-rendered HTML in build time.

And for its rich plugin library which saves us a ton of time during development.

Plugins solve issues as:

- image optimization,
- JSON/markdown resourcing,
- generating sitemap.
- out-of-the-box typescript integration
- static site generator

Or it can be customized for creating a PWA.

---

## Custom setup

We often create `gatsby-shared.js` at the root of the project. That file contains code shared between `gatsby-browser.js` and `gatsby-ssr.js`. 

The `gatsby-node.js` is strongly customized per project. We do not use any predefined setup. 

---

## Plugins

We currently do not have any predefined plugin lists based on the type of project.

## Build X develop

`npm run develop` (nebo build) spustí nejdřív JS v konzoli, který “poskládá” web. z něj se informace (console.logy) nedostanou do runtime - do prohlížeče. Musíte je hledat v konzoli.
