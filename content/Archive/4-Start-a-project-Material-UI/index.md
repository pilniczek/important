---
title: 4. Start a project - Material UI
---

<aside>
💡 [https://mui.com/material-ui/getting-started/installation/](https://mui.com/material-ui/guides/nextjs/)

</aside>

<aside>
<img src="4%20Start%20a%20project%20-%20Material%20UI/logo-48x48.png" alt="4%20Start%20a%20project%20-%20Material%20UI/logo-48x48.png" width="40px" /> Use emotion, not styled components

</aside>

## Installation

`npm install @mui/material @emotion/react @emotion/styled` 

`npm install @mui/material-nextjs @emotion/cache @emotion/server`

## Resources

`src/theme`

Here should be theme.ts with all customizations and the mirror of the palette (designColors.ts) from the design.

A good practice is to split the theme to:

- palette.ts
- typography.ts
- spacing.ts

In theme files include `“use client”` at the top of the file

## Baseline

Do not forget to set up a `MuiCssBaseline`.

Provider should be located in RootLayout (../app/layout)

Wrap the provider with `AppRouterCacheProvider` to prevent SSR style tags on each request

![Untitled](Untitled.png)
