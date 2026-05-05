---
title: Breakpointy
tags:
  - Basics
type:
  - Tutorial / How To
---

## Jak a kolik

Rozložení breakpointů je obecně [řešeno v tomto článku](https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/#tip-1-get-your-breakpoints-right) a měli bychom je nastavovat v tomto duchu.

Celé používání breakpointů je zastřešeno tím, že nakonec je potřeba přidávat breakpointy dle toho, "kde se to jak rozbíjí".

Výsledkem je, že neexistuje breakpoint, na kterém se celý design překlopí z desktop na mobil verzi.

**TIP:** Lze pracovat s **jednotkami *rem*** a *em* v kombinaci s *vw* tak, že se komponenty při změně šířky okna budou zmenšovat/zvětšovat (scale, pseudo "zoom in/out"). Tím se dá efektivně pracovat s počtem breakpointů (nebude jich potřeba tolik). V tokovém případě je dobré použít i fluidní typografii.

## **non-MUI**

Každý breakpoint je definován dvěma hodnotami (např. "od" a "do"). Kdybychom to nedělali, nastane při definování pravidel *od nějaké hodnoty* a *do nějaké hodnoty* situace, kdy se na breakpointu *nějaké hodnota* aplikují pravidla z obou intervalů ("od" i "do"). Nestačí nám tedy např. 800px, potřebujeme 799px (interval "do" nějaké hodnoty) a 800px (interval "od" nějaké hodnoty). Tím docílíme konzistentního designu jak na hodnotě 799px, tak na hodnotě 800px.

---
