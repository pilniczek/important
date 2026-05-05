---
title: CSSinJS
tags:
  - Basics
  - CSS
  - JS
type:
  - Tutorial / How To
  - Archived
---

[Linaria [non-MUI]](../cssinjs-linaria-non-mui/index.md)

[Emotion [MUI]](../cssinjs-emotion-mui/index.md)

## Proč

1. Na existujících projektech nám CSS-in-JS automaticky zajišťuje ochranu proti kolizím pojmenování CSS tříd. (CSS Modules to svedou taky, ale člověk musí vědět, jak na to. CSS-in-JS to dělá samo.) Sice se snažíme psát podle BEM, což by mělo tento problém řešit... ale i za sebe mohu říct, že mi občas "ujede ruka". Navíc třeba Appparade a Synetech, postavené na starší codebase (ještě než jsem nastoupil) rozhodně BEM nedodržují a tam bych se bál refactoringu. (Vytvoření performance testu tohoto řešení by znamenalo ručně překontrolovat kolize.)
2. CSS-in-JS zajištujě dead code elimination. CSS-in-JS by-default nepoužije styly komponent, které nepoužíváš (s odstraněním komponenty ti v projektu nezůstanou zapomenutá její CSS). (Vytvoření performance testu tohoto řešení by znamenalo ručně překontrolovat, jestli se nepoužívá CSS nějaké nepoužité komponenty.)
3. Vzhledem k tomu, že CSS-in-JS poskytuje vyšší provázanost CSS/JS/HTML (či jak to lépe popsat), není problém by-default používat jednou definovanou sadu proměnných jak v JS, tak v CSS. Výhodu to má při komplikovanějších animacích a výjimečných use-case responzivního chování.
4. Linaria (nebo jiná no-runtime CSS-in-JS knihovna) běží při buildu. Do browseru tak jde jen CSS. Vzhledem k tomu, že řešíme JS problémy `Minimize main-thread work` a `Reduce JavaScript execution time`, tak nám (S)CSS neposkytuje oproti no-runtime CSS-in-JS přidanou hodnotu na straně výkonu JS. Maximálně dosáhneme toho, že no-runtime CSS-in-JS servíruje CSS jinak, než (S)CSS a ladili bychom pak performance někde jinde, než máme problém.
5. Když jsem se díval, jak se skládají/dědí/komponují/extendují CSS v CSSModules, nebyl jsem z toho moc moudrý... U SCSS z toho moudrý sice jsem, ale u large-scale projektu jsem SCSS nikdy nepoužil a trochu se toho bojím. Považuji za jednoduché, čitelné a přímočasré používat

    ```
    const StyledFamily = styled.div`
        ...someCSS
    `
    ```

    někde dále pak

    ```
    const StyledSon = styled(StyledFamily)`
        ...moreCSS
    `
    ```

    přičemž v kódu pak není problém najít `<StyledFamily/>` i `<StyledSon>` a komponovat to dle potřeb tak, že `<StyledFamily/>` i `<StyledSon/>` obaluje různé markupy...

Také považuji za příjemné a efektivní komponovat CSS jako JSX. Codebase je unifikovaná, je to "pořád to samé dokola". Zjednodušuje to orientaci. A vývojáři to nedává možnost jít "jinou cestou".

**TODO**

Jak pracovat se specificitou, když nedokážeme garantovat pořadí ve výsledném buildu?
