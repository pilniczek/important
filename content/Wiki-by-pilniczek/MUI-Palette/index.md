---
title: MUI Palette
tags:
  - Material UI
type: Tool
---

Design nemusí používat stejnou logiku používání barev, jakou používá MUI. Je tedy potřeba namapovat logiku designu na logiku MUI. To má dva rozměry:

### 1. Design používá víc stupňů barvy než MUI

MUI - 3 stupně

```jsx
primary: {
	light: "",
	main: "",
	dark: ""
}
```

Design - třeba 5 stupňů

```jsx
primary: {
	ultraLight: "", // MUI s tímto neumí pracovat
	light: "",
	main: "",
	dark: "",
	ultraDark: "", // MUI s tímto neumí pracovat
},
```

### 2. Design používá jinou logiku seskupování barev

Komponentám pak nelze poskytovat např. **primary** paletu, ale musí se jim připravit paleta na míru.

(Může se stát, že takových custom palet bude hodně, protože design může mít hodně jinou logiku používání barev.)

```jsx
customPaletteName: {
	light: "light odstín primární barvy",
	main: "dark odstín primární barvy",
	dark: "černá",
}
```

### Výsledná paleta

Když spojíme oba rozměry dohromady, znamená to vytvořit JS objekt barev podle logiky designu a v palette.js ho použít pro vytváření nových palet, kterým bude MUI “rozumět”.

**designColors.js**

```jsx
export const orange = { // toto je ten "objekt barev podle logiky designu"
	"000": "#FFF7EE",
	100: "#F6BF80",
	300: "#EE7F00",
	500: "#EA650D",
	700: "#E64415",
};
```

**palette.js**

```jsx
import { orange } from "./designColors";

const palette = {
	primary: {
		light: orange["300"],
		main: orange["500"],
		dark: orange["700"],
		contrastText: "#ffffff",
	},
	...
}
```

**theme.js**

```jsx
import palette from "./palette";

const theme = createTheme({
	...
	palette,
	...
}
```
