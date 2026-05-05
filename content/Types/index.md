---
title: Types
tags:
  - Typescript
type: Code / Snippet
---

## MUI

### How to type “sx” prop in custom components?

Don’t import SxProps like this!

`import { SxProps } from "@mui/system";`

SxProps imported from `@mui/system` don’t inherit MUI custom types and custom variables.

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

---

## React

### C**hildren**

- JSX.Element
- ReactNode
- ReactElement

Ref.: [https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement](https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement)

---

### H**ook**

- useState
- useRef
- useContext
- useReducer
- useMemo
- useCallback

Ref.: [https://www.freecodecamp.org/news/react-typescript-how-to-set-up-types-on-hooks/#set-types-on-usecontext](https://www.freecodecamp.org/news/react-typescript-how-to-set-up-types-on-hooks/#set-types-on-usecontext)

---

### **Interface vs type**

[https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)

## Extend MUI

[https://jameskolean.tech/post/2020-07-30-quick-tip-materialui-typescript/](https://jameskolean.tech/post/2020-07-30-quick-tip-materialui-typescript/)
