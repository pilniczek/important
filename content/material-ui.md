---
title: Material UI
tags:
  - Material UI
type:
  - Tool
---

**docs:** [https://v4.mui.com/components/box/](https://v4.mui.com/components/box/)

**example project:** [https://github.com/mui/material-ui/tree/master/examples/gatsby](https://github.com/mui/material-ui/tree/master/examples/gatsby)

[[mui-palette|MUI Palette]]

---

## Why

We use MUI for its rich component library which saves us a ton of time during development. Specially on large-scale projects.

## Custom global setup

located in `\src\gatsby-theme-material-ui-top-layout`.

The folder contains:

- `designColors.js` - copy of colors from Figma
- `palette.js` - [MUI palettes](https://mui.com/customization/palette/) mixed from designColors
- `typography.js` - typography definitions
- `theme.js` - [customize](https://mui.com/material-ui/customization/theming/) the [default theme](https://mui.com/customization/default-theme/)

---

## Component customizations

Made via `sx` prop. [https://mui.com/system/the-sx-prop/](https://mui.com/system/the-sx-prop/)

Or via `theme`.

Avoid `style` prop.

Using `className` is allowed only in specific cases.

---

## TIPS

**SX** prop is typed! `import { SxProps } from "@mui/system";`

**Spacings** MUST start with zero `[0, 2, 4, 8, ...]` - pls never make the `[2, 4, 8, ...]` mistake again!

Always **add icons to the storybook,** please!

Description of font source which MUI uses —- >    https://github.com/fontsource/fontsource

 

List of all fonts which font source has — > [https://github.com/fontsource/fontsource/tree/main/fonts/google](https://github.com/fontsource/fontsource/tree/main/fonts/google)

## Why we use MUI instead of React-Bootstrap?

1. MUI has more components than React-Bootstrap (for example Datepicker )
2. MUI uses sx property for styling components, React-Bootstrap uses the style property. It can be a problem when u will reuse ‘custom’ classes.
3. React-Bootstrap doesn't have a source map.
4. In React-Bootstrap components are less changeable than in MUI.
