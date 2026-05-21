---
title: Storybook Alternatives
tags:
  - Testing
  - QA
type:
  - Tool
---

Dosti alternativních řešení je bohužel opuštěno a nevím zda chceme používat package, na který se již X let nesáhlo. Každopádně zde jsou nějaké alternativy co jsem našel a proč jdou/nejdou použít.

- React cosmos
    - [https://github.com/react-cosmos/rfcs/issues/17](https://github.com/react-cosmos/rfcs/issues/17)
    - TLDR: Gatsby má vlastní upravený Webpack config a bylo by složité to zprovoznit. Neříkám že nemožné, ale také ne triviální.
- Docz
    - [https://www.docz.site/](https://www.docz.site/)
    - Neřeší problém Storybooku, musíme pořád vytvářet další soubor. Je to asi ale nejlehčí alternativa, jelikož je to MDX-based systém.
- Carte Blanche
    - [https://github.com/carteb/carte-blanche](https://github.com/carteb/carte-blanche)
    - Byl by idální, ale bohužel je neudržovaný a i autor nedoporučuje ho používat.
- React Bluekit
    - [https://www.npmjs.com/package/react-bluekit](https://www.npmjs.com/package/react-bluekit)
    - Další ideální kandidát. Bohužel 5 let od poslední verze (0.4.4) a neprochází dependency check na npmjs.com
- React Styleguide Editor
    - [https://github.com/pocotan001/react-styleguide-generator](https://github.com/pocotan001/react-styleguide-generator)
    - Poslední update 2017 a je to archivováno na githubu
    - Navíc je to znova složité jako Storybook
- AirBnB react-sketchapp
    - [https://github.com/airbnb/react-sketchapp](https://github.com/airbnb/react-sketchapp)
    - Nepodařilo se zprovoznit jediný example. Takže nevím jak moc bude dobrý. Jinak vypadá celkem nadějně, ale možná bude zase stejně složitý jako storybook.
