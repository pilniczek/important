---
title: "CSS - setup & ITCSS [non-MUI]"
tags:
  - Basics
  - CSS
type: Tutorial / How To
---

Výchozí ideou je ITCSS popsané [zde](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/).

## Globální styly

Na projektu je globální stylopis (třeba `globalCss.tsx`)

Podle ITCSS je toto úroveň **GENERIC**, **ELEMENTS** a **UTILITIES**.

Obsahuje:

- normalizaci/reset
- fonty
- customizaci gatsby wrapper markupu, pokud to layout projektu potřebuje (`#page-wrap`,`#___gatsby` a tak)
- utility třídy

(Už je asi jedno, jestli dáte vše do jednoho souboru, nebo to rozdělíte a v globálním souboru budou jen importy - záleží na rozsahu.)

## Custom nástroje

Na projektu je soubor `utils.tsx`. Vzhledem k tomu, že ve stylopisech můžeme používat JS funkce, tak tento soubor poskytuje utility funkce nejen pro javascript, ale i pro styly.

Podle ITCSS jde o úroveň **TOOLS**.

## Nastavování barevné palety, množiny breakpointů...

V `src/components` je soubor `style.tsx` s potřebnými nastaveními.

Podle ITCSS jde o úroveň **SETTINGS**.

---

**DŮLEŽITÁ POZNÁMKA**: spousta souborů je "rozfrcaná" po různých adresářích... ty tři výše zmíněné úrovně klidně na projektu dejte někam na logické místo a pohromadě.

---

## Styly komponent

Dřív byly psané jako kombinace CSSinJS a BEM, avšak byl ustanoven odklon od BEM (byť místy je jeho použití pořád smysluplné) a snažíme se používat styly primárně přes linaria `style`.

Co to znamená:

- Customizace komponenty často není přes classu `component--custom`, ale pomocí předané proměnné. Třeba jako `${(props) => props.inputWidth};` nebo `background: ${(props) => props.isOpen ? c.light1stLevel : c.white};`.
- A vlastně spoustu dalších zajímavých věcí, viz [dokumentace](https://github.com/callstack/linaria/blob/master/docs/BASICS.md).

Styly komponent jsou vždycky v adresáři s komponentou.

Aby se daly styly rozumně reusovat bez neočekávaných vedlejších efektů, měly by se styly importovat jen v adresáři a podadresářích.

```
components->**alert**
					|  ->styles.tsx (export alert styles)
          |  ->index.tsx (import alert styles and/or ../component/styles)
          |  ->**aVariant**
          |     ->styles.tsx (export aVariant styles)
					|			->index.tsx (import alert, aVariant styles and/or ../component/styles)
          |
          ->**banner**
					|	 ->styles.tsx (export banner styles)
					|	 ->index.tsx (import banner styles  and/or ../component/styles)
          |              (do NOT import alert styles!)
          |              (do NOT import aVariant styles!)
					->styles.tsx

```

Takto by měly být v rámci ITCSS obhospodařeny poslední, zatím nezmíněné, úrovně **OBJECTS** a **ELEMENTS**.

---

**DALŠÍ DŮLEŽITÁ POZNÁMKA**: Tady popisuji ideál, ke kterému se nejvíce blížíme na jablotroním projektu. Čili při customizaci existujících projektů... no, je to tam trošku smutné a chaotičtější, než to tady popisuji.

---

## Zdroje

ITCSS: [https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)

Linaria: [https://github.com/callstack/linaria/blob/master/docs/BASICS.md](https://github.com/callstack/linaria/blob/master/docs/BASICS.md)
