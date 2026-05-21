---
title: DRY
tags:
  - Basics
  - Principles
type:
  - Approach
---

A teď něco obecného:

Všímám si, že na projektech často k reusabilitě přistupujeme tak, že vyrábíme kód, který je hard to debug/change.To vzniká tak, že:

1. napíšu jednoúčelovou věc (což jako výchozí stav může být valid),
2. doplním tam nějaké ify a přepoužiju to jinde,
3. doplním tam nějaké ify a přepoužiju to ještě jinde,
4. ...

po pár iteracích je to v hellu, protože při debugu jedné featury procházím kód pro X featur. Podle mě (hádám) to vzniká proto, že to člověk dělá s mindsetem nastaveným na "dědičnost". A možná i s mindsetem "nechci abstrakci".

---

Přitom by lepším řešením bylo:

1. napíšu jednoúčelovou věc (což jako výchozí stav může být valid),
2. místo ifů věc "rozeberu" na reusovatelné části, ty použiju jak v původní implementaci, tak v nově napsané komponentě,
3. buď poladím reusabilitu a/nebo rovnou píšu novou věc z reusovaných komponent,

po několika iteracích mi vznikne X různých featur, kde každá přepoužívá Y různých věcí. A když něco debuguju, ani nepotkám kód, který se danného problému netýká.Přičemž tento přístup nepřepoužije 100% implementace, ale třeba 90%. Protože v průběhu implementace musíš přemýšlet, která reusabilita kód udělá přehlednější a která ho naopak udělá nesrozumitelnějším. (Kdysi jsem četl cool článek o tom, jak vývojáři s až náboženským fanatismem hrotí DRY, ale přitom nepřemýšlí, jestli skutečně plní svůj účel = usnadňuje budoucí editaci kódu)
