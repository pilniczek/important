---
title: Barevná paleta
tags:
  - Basics
type:
  - Approach
---

## Odvozování barev

Funkce pro manipulaci s barvami (lighten, darken, opacity, ...) prakticky nepoužíváme na žádné úrovni (paleta, komponenta, ...).

## Průhlednost

Pokud v designu najdeme barvu, kde použití průhlednosti vypadá jako nesmysl/omyl, ideálně se přeptáme grafika, jestli se nespletl. (Typicky nesmyslné nadužívání barev s průhledností jsou šedé jednopixelové rámečky, které vzniknou spojením černé s průhledností a bílého pozadí. Věci až takto jasné můžeme upravit sami.)

## Sub-palety

Pro množiny komponent nevytváříme sub-palety, všude importujeme globální paletu a používáme barvy přímo z ní.

## Velikost palety

Pokud máme od grafika na projektu něco jako bílou barvu v sedmi variantách - na základě nastavené průhlednosti, taky se přeptáme, zda nejde o omyl. To samé třeba u deseti odstínů oranžové. Vlastnosti displejů i lidského oka nejsou tak dokonalé a tak jednotné, aby se takové drobné rozdíly daly poznat a vývojářům to zesložiťuje práci.

## Názvosloví

Barvy se snažíme pojmenovávat podle jejich účelu (primary, error) nikoli vzhledu (red, green).

## MUI paleta

[[mui-palette|here]]
