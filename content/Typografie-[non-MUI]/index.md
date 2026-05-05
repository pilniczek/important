---
title: Typografie [non-MUI]
tags:
  - Basics
type: Approach
---

### Definuji CSS classes dle grafiky a ty předávám elementům

Tohle jen v rámci utility classes, ne jako hlavní stylovací nástroj. Některé komponenty potřebují třeba tag H3 vykreslovat (aby "se tvářil") jako tag H2. [ITCSS vrstva UTILITIES]

### Definuji sadu komponent obsahující CSS pravidla dle grafiky

Pokud by nějaká komponenta měla být ověšena spoustou utility classes (nebo projekt utility classes nemá), můžu customizaci komponenty vyřešit takto. Opět nejde o hlavní stylovací nástroj. [ITCSS vrstva COMPONENTS]

### Definuji obecnou typografii dle grafiky (jako sadu mixin).

Ano. V globálním stylopisu jím nadefinujeme defaultní CSS hodnoty podle tagů. [ITCSS vrstva GENERIC]
