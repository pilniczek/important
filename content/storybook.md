---
title: Storybook
tags:
  - Testing
  - QA
type:
  - Tool
---

**docs:** [https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/)

**Gatsby docs:** [https://www.gatsbyjs.com/docs/how-to/testing/visual-testing-with-storybook/#writing-stories](https://www.gatsbyjs.com/docs/how-to/testing/visual-testing-with-storybook/#writing-stories)

**inspiration:** 

[[storybook-usage|Usage]]

---

## Why

If you need to develop a (sub)component for specific page but the page does not exist yet.

You can easily understand component props and their values.

You can easily test several component states and their combinations. (Even more helpful if you make changes in existing component.)

You can easily find a component you need and check if it is suitable for the solution of your issue.

---

## Status

It is not possible to display images when you use static GraphQL queries. [https://www.gatsbyjs.com/docs/how-to/testing/visual-testing-with-storybook/#writing-stories](https://www.gatsbyjs.com/docs/how-to/testing/visual-testing-with-storybook/#writing-stories)

We are using a webpack config which prevents storybook from failing. You’ll see common “broken image” UI with alternate text. [https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#alternative_text](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Images_in_HTML#alternative_text)

---

## Where to write

Every component should have its own story in the same folder and should be named `stories.tsx`. In case more components are in the same folder, the naming should be `Component.stories.tsx`. These options are configurable but we mostly use this configuration.

---

## Contexts

If you use a **global react context** (for example in `gatsby-shared.js`) do not forget to included the contexts to `preview.js` as part of the `decorators`.

---

[[storybook-alternatives|Alternatives]]
