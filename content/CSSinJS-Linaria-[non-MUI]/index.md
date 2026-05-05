---
archived: true
title: Linaria [non-MUI]
tags:
  - CSS
type: Tool
---

## Proč

Používáme [Linaria](https://github.com/callstack/linaria). Důvodem je, že **styly generuje v build time**, nikoli v runtime, což má velice **pozitivní performance** dopad. Implementujeme pomocí [Gatsby pluginu](https://github.com/silvenon/gatsby-plugin-linaria).

## Jak

Ve většině případů preferujeme používání `styled` před `css`.

**Je důležité mít na paměti, co vznikne kompilací.** Chceme vygenerovaného kódu co nejméně. Takže string interpolation pro sdílené kódu používáme výjimečně. Další příklady:

Nevhodně (string interpolation):

```
const styledIcon = `
	border-radius: 999999999px;
`;
export const Armed = styled.svg`
	background-color: ${areaStateColors.Armed};
	${styledIcon}
`;
export const Off = styled.svg`
	background-color: ${areaStateColors.Off};
	${styledIcon}
`;
// následuje spousta variant něčeho, co má různé barvy, ale pořád stejné radiusy

**KOMPILACE**

.Armed_ap5z4s7 {
  background-color: #FD3D3D;
  border-radius: 999999999px;
}
.Off_o1t5hwdv {
  background-color: #919EAB;
  border-radius: 999999999px;
}
// následuje spousta variant něčeho, co má různé barvy, ale pořád stejné radiusy

**JSX**

<Off />
```

Lepší (`css`):

```
export const styledIcons = css`
	border-radius: 999999999px;
`;
export const maintenance = css`
	background-color: ${areaStateColors.Maintenance};
`;
export const disarmed = css`
	background-color: ${areaStateColors.Disarmed};
`;

**KOMPILACE**

.styledIcons_swhb0r0 {
  border-radius: 999999999px;
}
.disarmed_dp5z4s7 {
  background-color: #27BF4D;
}
.maintenance_m1t5hwdv {
  background-color: #919EAB;
}
// následuje spousta variant něčeho, co má různé barvy, radius se definuje jednou a pak se prosdílí.

**JSX**

<svg className={'${maintenance} ${styledIcons}'} />
```

Ještě lepší je kombinace s předchozím a vytvořit `<StyledIcon className={maintenance}>`.

A úplně nejlepší (`styled`):

```
export const StyledIcons = styled.svg`
	border-radius: 999999999px;
`;
export const Off = styled(StyledIcons)`
	background-color: ${areaStateColors.Off};
`;
export const Armed = styled(StyledIcons)`
	background-color: ${areaStateColors.Armed};
`;

**KOMPILACE**

.styledIcons_swhb0r0 {
  border-radius: 999999999px;
}
.Off_o1o5zse8.StyledIcons_swhb0r0 {
  background-color: #919EAB;
}
.Armed_a1h3k7ej.StyledIcons_swhb0r0 {
  background-color: #FD3D3D;
}

**JSX**

<Off />
```
