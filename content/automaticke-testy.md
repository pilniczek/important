---
title: Automatické testy
tags:
  - Testing
type:
  - How To
---

**Udělá se jednou**:
Spouštění unit testů v CI
Spouštění system testů v CI
Uploadovani screenshotů v CI
Specter nasazeni ja 

**Musi se delat porad**:
Unit testy ja a tomas
System testy Adam Pechar
Integrace automatizace do dalšího projektu

**Proces testovani by mel zahrnovat Unit testy, System testy a visuální regresivní testy**

Unit testy by měli odhalit přibližně 70% chyb. Testují, zdali jednotlivé komponenty použité v rámci webu fungují správně a nemělo by být potřeba pro jejich spuštění žádný emulátor/simulátor, tudíž by neměl být problém je spouštět lokálně. Psal by je především Tadeáš Musil a Tomáš Pilnaj. Použitý framework by byl Jest a jsdom, více zde [https://reactjs.org/docs/testing.html](https://reactjs.org/docs/testing.html)

System testy by měli odhalit přibližně 20% chyb. Testují vybrané (typické) chování uživatele, zdali je uživatel schopen docílit požadované události. Tester by měl být schopen najít právě typická workflows uživatele, popsat je a zároveň přepsat do scriptu, který přesně workflow zreprodukuje. K tomu je již potřeba emulátor a není nutné system testy spouštět lokálně. System testy by psal Adam Pechar. Použitý framework by byl headless chromium, Jest a puppeteer, více zde [https://jestjs.io/docs/en/puppeteer](https://jestjs.io/docs/en/puppeteer)

Visuální regresivní testy by měli odhalit přibližně 10% chyb (zbývající). Testují, zdali na webu nedošlo k nechtěným změnám, tím způsobem, že porovnávají screenshoty obrazovek před a po provedení změn. Odhalené změny samozřejmě nemusejí nutně znamenat chybu, a proto zde musí ještě existovat role, která změnu potvrdí nebo vyvrátí. Tuto roli by zastával právě Adam Pechar, který by tak určil na základě Issue v gitlabu. Screenshoty se budou vytvářet v rámci běžících System testů a rozhodnutí, kdy a co vše se má "vyfotit" bude ponecháno autorovi System testů. Vzhledem k principu fungování jsou použité frameworky stejné jako u System testů, avšak navíc přibývá porovnávání rozdílů a jejich potvrzení/vyvrácení, proto by sloužil nástroj Specter a do jisté míry i Merge Requesty v gitlabu.

Celý proces testování bude v první řadě automatizován v rámci Gitlab CI. To vyžaduje počáteční úsilí navíc, které se již později nemusí opakovat a jehož výsledek bude znovu použitelný. Jde především o napsaní .gitlab-ci.yml scriptu, v kterém přibudou kroky inicializujicí Jest a spuštění Unit testů, headless chrome a spuštění puppeteer a nahrávání výsledných screenshotů do Specter. Specter je z malé části již připraven ne však dokončen, zde se jedná opět o jednorázovou práci se znovu použitelností.

Unit, System a Visuální testy budou spouštěny na všech větvích (feature/*, dev a master). Budou však rozděleny do kategorií @smallTest, @mediumTest a @largeTest. Malé budou spouštěny na feature/*, střední na dev a velké na master. Velikost určuje autor testu. 

**Poznámka**

Vizualne regresivni testy si musi spustit i vyvojar lokalne, aby si pred odevzdanim prace overil, ze jeho metoda splneni zadani nema neocekavane vedlejsi efekty. V tomto lokalnim modu ovsem jen vyscreenuji stav stranky po uplnem nacteni. Zaroven neni potreba testovat kazdou stranku, ale bude stacit otestovat "typove" stranky - podle sablon.

## NICE TO HAVE

**Code quality**

Mame nasazeny nastroj, kontrolujici kvalitu kodu, ale uz na jeho vystup nebere nikdo ohled. To by se melo zmenit. Vystupem nastroje je ciselna hodnota jak moc se kod zlepsil/zhorsil, na zaklade ktere je mozne nastavit hranici pod kterou se kod nebude mergovat do devu (cilove vetve).

Dale mame k dispozici i eslint report, se kterým by se také mohlo pracovat.

**Performance**

Stejne tak se nam aktualne generuje lighthouse report, ktery moc casto neresime... pritom by opet melo platit, ze pri zpracovani zadani by se report nemel zhorsit o vic, nez nejakou domluvenou hodnotu. 

**Search conzole**

Někdo by měl checkovat a dávat ke zpracování errory ze search konzole
