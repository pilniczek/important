---
title: fixup commity
tags:
  - GIT
type:
  - Tutorial / How To
---

## Prerekvizity

Je nastaveno mergování jenom, pokud jsou pipeline v pořádku. Mergování pouze, pokud jsou vyřešeny všechny komentáře.

Jsou zde dvě dostupná řešení, jedno je řešení pouze na tento daný problém, druhé je více rozšiřitelné a udržitelné.

### Nativní řešení

Toto řešení využivá vlastní script, který kontroluje pomocí regexu všechny commity v aktuálním PR, že neobsahují “Fixup!/fixup!” frázy na začátku commit zprávy.

Script se nachází v souboru `scripts/checkFixup.sh` a je třeba ho zkopírovat.

Ci job je `check_fixup` job v pipeline definici.

Výhod:

- není zde žádná závislost na externí službě

Nevýhody:

- Může to házet False Positive z důvodu toho, že to je vlastní script
- Rozšíření mimo git zprávy je složité

### DangerJs

Toto řešení využívá DangerJs. To je `npm` package, který se nainstaluje buď do projektu, nebo pak globálně v pipeline.

Danger JS home page: [https://danger.systems/js/](https://danger.systems/js/)

Jelikož se spouští jenom v pipeline, tak nemusí být přidaný do `package.json` a jenom se instaluje v pipeline.

Kroky:

1. Zkopírovat `dangerfile.js` do root složky projektu
2. Zkopírovat `danger` job c definici CI

Výhody:

- Lépe udržitelné
- Lépe rozšiřitelné
- Vypisuje se komentář do PR

Nevýhody:

- Závislost na externí službě
