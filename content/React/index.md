---
title: React
tags:
  - React
type: Tool
---

**docs:** [https://reactjs.org/docs/getting-started.html](https://reactjs.org/docs/getting-started.html)

---

## State management

The component state is handled by the `useState` hook [described here](https://reactjs.org/docs/hooks-state.html). 

“Global state” is solved via [hooks](https://reactjs.org/docs/hooks-reference.html) and [context](https://reactjs.org/docs/context.html). Most of the contexts are situated in `gatsby-shared.js` in the `wrapRootElement` function [described here](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapRootElement).

You can also create context on a different level (as the [MUI Tab component](https://mui.com/material-ui/react-tabs/) does) but we do not do this very often.

If the **storybook** is included in the project, you will have to add these contexts to `preview.js` as part of the `decorators`.

---

## Debugging

It is sometimes necessary to use a web browser console extension. [https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

---

## Components

We use functional components, not objects.

It is common to have one component per file. (With TS type definition.)

---

## Expected usage example

```jsx
import Box, { BoxProps } from "@mui/material/Box";

export interface ComponentProps extends BoxProps {
	myProp: string;
	children: React.ReactNode;
}

const Component = ({myProp, children, ...rest}: ComponentProps): JSX.Element => {
	return (
		<Box {...rest}>
			<div>{myProp}</div>
			<div>{children}</div>
		</Box>
	)
}

export default Component
```
