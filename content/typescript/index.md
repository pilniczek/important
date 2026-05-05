---
title: Typescript
tags:
  - Typescript
type:
  - Tool
---

**docs:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)

---

## Why

We want to prevent future bugs and make code easier to understand. And that is where types play their role.

---

## Status

Writing types is not mandatory [in 2022]. For now.

IDE must highlight missing types.

Pipeline and pre-commit hook do not check missing types.

The optimal TS/Eslint configuration still needs to be finished.

---

**At the beginning of training is important to type PROPS and RETURNED VALUE. Other types are “nice to have”.**

**We do not need to write types in storybook stories.**

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

Other examples (just because you can doesn't mean you should): [https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/function_components/)

## Interface vs type

[https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
