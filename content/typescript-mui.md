---
title: Typescript with MUI
tags:
  - Typescript
  - Material UI
type:
  - How To
---

## How to type "sx" prop in custom components?

Don't import SxProps like this!

`import { SxProps } from "@mui/system";`

SxProps imported from `@mui/system` don't inherit MUI custom types and custom variables.

The right solution is to extend sx props from the MUI component (in most cases the root component of the custom component). Example below:

`interface CustomComponentProps extends PaperProps`

```jsx
interface CustomComponentProps extends PaperProps { ... }

function CustomComponent({...}}: CustomComponentProps): JSX.Element {
	return (
		<Paper sx={{...}}>
		{...}
		</Paper>
	)
}
```

## Type custom components variants and custom theme variables

[https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants](https://mui.com/material-ui/customization/theme-components/#creating-new-component-variants)

[https://mui.com/material-ui/customization/theming/#custom-variables](https://mui.com/material-ui/customization/theming/#custom-variables)

You need to have `theme.tsx` to write custom types in the MUI theme, so don't use `gatsby-theme-material-ui` plugin which supports only `theme.js`.

Create own `<ThemeProvider theme={theme}>` where `theme` variable is imported from `theme.tsx` file.

## Extend MUI

[https://jameskolean.tech/post/2020-07-30-quick-tip-materialui-typescript/](https://jameskolean.tech/post/2020-07-30-quick-tip-materialui-typescript/)
