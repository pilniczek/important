---
title: Browserlist
tags:
  - Architecture
  - QA
type:
  - How To
---

[[browserlist-browserlistrc-example|.browserlistrc Example]]

---

Aktualizace na základě GA zatím řešit nebudeme

Aktualizace `npx browserslist@latest --update-db` se nastaví tak, aby se děla při buildu

Primárním odrazovým můstkem musí být podporované prohlížeče gatsbym.
Sekundárně to můžeme lehce okleštit.

```jsx
not dead
not op_mini all
not ie
last 2 versions
>= 1% in CZ
```
