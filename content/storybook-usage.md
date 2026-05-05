---
title: Storybook Usage
tags:
  - Testing
  - QA
type:
  - How To
---

For component like this.

```jsx
import Box, { BoxProps } from "@mui/material/Box";

export interface ComponentProps extends BoxProps {
	myProp: string;
	children: React.ReactNode;
	bg: "red" | "blue" | "green"
}

const Component = ({myProp, children, bg, ...rest}: ComponentProps): JSX.Element => {
	return (
		<Box {...rest}>
			<Box sx={{bg: color}}>{myProp}</Box>
			<Box>{children}</Box>
		</Box>
	)
}

export default Component
```

The story can look like.

```jsx
import React from 'react';
import ComponentName from './';

export default {
  title: "Category/ComponentName", // create it to specified place in stories tree
	argTypes: { // optional
		bg: { // any prop can be specified, useful for sets of possible values
			options: ["red", "blue", "green"], // set of predefined values
			control: { type: "select" }, // the method of setting a predefined value
		},
	},
};

const Template = args => <ComponentName {...args} />;

export const RichChildren = Template.bind({});

const sharedArgs = { // define shared args if needed to prevent code duplicities
  myProp: "Label text",
	bg: "red", // default bg settings
}

RichChildren.args = {
	...sharedArgs,
	children: <Box sx={{p: 4, color: "magenta"}}>some long text</Box>,
};

export const TextChildren = Template.bind({});

TextChildren.args = {
	...sharedArgs,
	children: "Just a text children",
};

```
