---
title: Článek - Formátování kódu
tags:
  - Linting
type: Article
url: "https://www.megumethod.com/blog/same-code-formatting-across-team"
---

<aside>
💡 **Jak udržujeme ve webovém oddělení stejné formátování kódu napříč týmem?**

</aside>

Dodržování jednotného formátování a code quality pravidel v kódu by mělo být standardem v každém vývojářském týmu. Podívejte se, jak přistupujeme k tomuto problému v našem webové oddělení.

## Úvod

Určitě se vám už někdy stalo, že jste si pullnuli z repositáře kód, udělali v něm změnu, soubor uložili a při pohledu na diff jste se zhrozili, jak to, že celý soubor svítí zeleně, když jste přeci změnili jen jeden řádek. Zrovna tak jste se ve stejné situaci mohli ocitnout, když jste naopak dělali code review jinému vývojáři, který takový divoký diff úspěšně vyignoroval a změnu pushnul.

Tyto přešlapy bývají dle mého názoru často chybně připisovány většinou juniornímu vývojáři, který není (v nadsázce) dostatečně osvícený, aby věděl, jak má mít nastavený svůj stroj, aby se podobným situacím vyhnul. To je ale chybný přístup. Primární příčina těchto problémů tkví úplně někde jinde a sice v tom, že projekt není dostatečně robustně nastaven tak, aby si poradil s rozdílnými prostředími, ve kterých jednotliví vývojáři pracují, respektive aby pokud možno odchytával tyto chyby ještě před tím, než jsou pushnuté do repositáře, ale o tom až dále.

## Kde vznikají nejčastěji problémy?

### 1. CRLF vs LF

Jak se říká *“first things first”*. Častou příčinou vzniku nechtěných diffů mohou být totiž i jen nesjednocené konce řádků.

Ve zkratce jde o to, že Linux a MacOS používají pro označení nového řádku kontrolní (neviditelný) znak LF, Windows však znak CRLF. Přestože v IDE vývojář rozdíl mezi souborem uloženým jako LF a CRLF prakticky nepozná, Git ano. Pokud jsou tak do Gitu nahrány dva stejné soubory, ale každý s jinými kontrolními znaky pro konce řádků, vyhodnotí je jako diff.

Existuje pár způsobů, jak se s tímto problémem vypořádat. Nebudu popisovat všechny z nich, rád ale popíšu řešení, které používáme na projektech v Synetechu.

### Řešení

Nespoléháme na správné nastavení Gitu u vývojáře. V projektu máme soubor `.gitattributes` a v něm `* text=auto eol=lf`. Toto řešení spolehlivě zajistí, aby byly do repositáře puštěny pouze konce řádků typu LF.

### 2. ESLint, Prettier

Další častou příčinou vzniku nechtěných diffů může být špatně nastavená práce s ESLintem a Prettierem. Toto je bohužel opět další velice široké téma, takže se pokusím jen stručně vysvětlit základní problém.

### Prettier

Prettier slouží k vynucení stejných formátovacích pravidel pro soubory napříč vývojáři, a tak by se na první pohled mohlo zdát, že pokud je Prettier na projektu nakonfigurován, nemůže se stát, že by např. jeden vývojář používal na konci řádku středníky a druhý nikoliv. Bohužel se to ale stát může. Může i tak opravdu dojít k situaci, kdy jeden vývojář pushne do repositáře např. nový soubor, kde všude používá středníky na konci řádků a o X commitů dále přijde druhý vývojář se svojí úpravou a všechny středníky odmaže. Výsledný diff je zbytečný a hlavně nenese žádnou hodnotnou informaci a vůbec by tak neměl být součástí Git historie.

Tento problém vzniká pouze z jediného důvodu. Vývojář nespustil `prettier --write`, příkaz který dané soubory *“normalizuje”* (formátuje do stejného tvaru). Spousta vývojářů spouští tento příkaz pomocí IDE, které automaticky po uložení souboru soubor zformátuje. Tuto funkcionalitu však většinou v IDE zajišťuje nějaký plugin. V případě VSCode se jedná o plugin *“ESLint”* (https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), WebStorm má pak ESLint integrovaný bez nutnosti instalace pluginu, přesto se musí správně nakonfigurovat (https://www.jetbrains.com/help/webstorm/eslint.html). Pokud vývojář ESLint v IDE nemá nebo ho má špatně nastavený (např. nemá nastaveno, aby se automaticky spouštěl formát po uložení souboru), formát neproběhne a po pushi se dostane nezformátovaný kód do repositáře.

### ESLint

ESLint slouží spíše než k sjednocení formátování (byť i taková pravidla umí kontrolovat: https://prettier.io/docs/en/integrating-with-linters.html) k hlídání tzv. *“code quality rules”*. Např. může kontrolovat, zda nemáte v kódu nějaký mrtvý kód (nevyužité proměnné), zbytečný kód (console logy, alerty) apod. Přehled všech pravidel, které ESLint umí kontrolovat můžete nalézt zde: https://eslint.org/docs/rules/#layout-formatting. Asi si dokážete představit, co se stane, když jeden vývojář kód lintuje a druhý ne. Dojde úplně ke stejnému problému jako v případě Prettieru, jen na jiné úrovni. Důvody pro push nelintovaného kódu do repositáře mohou být např. tyto:

1. ESLint lze integrovat s Prettierem (https://prettier.io/docs/en/integrating-with-linters.html). Některé formy integrace ESLintu však nutí některé vývojáře, aby ESLint plugin v IDE dobrovolně zakázali. Např. pokud necháte Prettier errory hlásit pomocí ESLintu. V tomto případě se totiž velice pravděpodobně dostanete do situace, kdy se už během psaní kódu dopouštíte nějakých formátovacích chyb a IDE vám tyto chyby obratem podtrhává a zbavíte se jich až po uložení souboru. Když Vám toto chování vadí, plugin si prostě zakážete a provádíte autofix až v konzoli (`eslint --fix`), na což můžete čas od času lehce zapomenout.
2. Výkon. ESLint je oproti Prettieru pomalejší, a tak v některých situacích může trvat autofix i v řádu sekund, tím spíš, pokud děláte na nějakém slabším stroji. V tomto případě opět raději vypínáte autofix v IDE a spouštíte autofix command manuálně v konzoli, což opět vytváří prostor pro to, že tento command zapomenete někdy spustit.
3. Vývojář může pushnout do repositáře ESLint chyby, i pokud má nastavený autofix ESLint chyb ve svém IDE či pokud spouští zodpovědně manuální autofix souborů před commitem `eslint --fix` v konzoli. Ne všechny ESLint chyby jsou totiž (narozdíl od Prettier chyb) autofixnutelné. Existují i chyby, které musí vývojář opravit manuálně. Pokud toto neudělá a vyignoruje ESLint hlášky, opět klidně může do repositáře pustit nezlintovaný kód.

### Řešení

Když jsme hledali v Synetechu nějaké robustní řešení, které by totálně eliminovalo výše uvedené problémy, napadlo nás okamžitě, že by bylo dobré spouštět např. nějaký pre-commit hook, který by mohl provádět potřebné prettier/eslint error checky, takže by nebylo vývojáři dovoleno vytvořit commit, dokud by neměl správně zformátovaný/zlintovaný kód.

Problém však je, že pre-commit hooky nejsou součástí remote repositáře, ale existují jen na úrovni lokálního repositáře, takže nelze uložit do repositáře informaci o tom, jaké pre-commit hooky se mají spouštět a nelze tak pre-commit hook rozdistrubuovat mezi ostatní vývojáře.

### Husky

Naštěstí existuje balíček Husky (https://typicode.github.io/husky). Tento balíček umí podle konfiguračního souboru (který lze verzovat), pre-commit hooky vytvořit u každého vývojáře na lokální úrovni.

Pomocí Huskyho tak pak jde např. nastavit, aby se jako pre-commit hook spouštěl např. příkaz `eslint --fix`. Problém je, že pokud budete spouštět tento příkaz s parametrem pro všechny JS soubory, kontrolujete zbytečně soubory v celém repositáři, což není efektivní. Husky však nemá informaci o tom, které soubory chcete commitnout (které soubory se nachází ve stage area). Zde přichází na pomoc další balíček.

### lint-staged

Lint-staged umí spouštět skripty pouze pro staged soubory. V pre-commit hooku tak pak není potřeba spouštět napřímo `eslint --fix`, ale lze spouštět `lint-staged` skript, který obsahuje `eslint --fix` (nebo jakýkoliv jiný check) jako parametr.

*Pozn. Pro ještě lepší výkonnost lze spouštět příkaz `eslint --fix` navíc s parametrem `--cache`, který kontroluje jen změněné soubory od posledního spuštění tohoto příkazu.*

### Setup script

Už tedy víme, které nástroje nám pomohou k lintování/formátování kódu pomocí pre-commit hooku. Jelikož byly tyto informace ale zatím jen kusé, pokusím se vysvětlit ještě trochu více do hloubky, jak vlastně v praxi nakonfigurovat tyto nástroje na reálném projektu.

`husky` i `lint-staged` jdou konfigurovat každý zvlášť a ručně, k tomu již je konec konců napsáno dost v dokumentaci (https://www.npmjs.com/package/husky, https://github.com/okonet/lint-staged). Zajímavé však ale je, že existují i scripty, které většinu konfigurace udělají za vás. V Synetechu využíváme pro urychlení setupu projektu tento skript `npx mrm@2 lint-staged`, který ve stručnosti udělá něco takového:

1. Nainstaluje `husky` a `lint-staged`.
2. Přidá do `package.json` `prepare` script, který po prvním `npm i` vygeneruje složku `.husky`, ve které si můžete nadefinovat jakékoliv hooky. Např. pro pre-commit by to byl soubor `pre-commit` s obsahem `npx lint-staged`.

Pro ujasnění doplňuji, jak např. může vypadat `lint-staged` script uvnitř `package.json`.

```
"lint-staged": {
    "{*.js,*.jsx,*.json}": "eslint --cache",
    "{*.js,*.jsx,*.json}": "prettier --write", // pokud nemáte Prettier integrovaný do ESLintu
  }
```

### 99% řešení

Přestože jsem na začátku lákal na to, že toto řešení zajistí, aby se do kódu nedostal žádný nezlintovaný/nezformátovaný kód, nemluvil jsem tak úplně pravdu.

Jak již jste si někdo mohl domyslet, pre-commit hooky začnou fungovat, až jakmile proběhne jejich instalace, což se stane až prvním spuštěním `npm i`. Pokud tedy vývojář naklonuje repositář, neprovede `npm i`, projde mu i commit s problémovým kódem. Naštěstí toto je velice vzácná situace. Vývojář většinou vytváří nějakou změnu, pro kterou potřebuje nejprve nainstalovat balíčky.

Druhý způsob, jak pre-commit hook obejít, je commitovat s flagem `--no-verify`, který pre-commit hook ignoruje a commit normálně projde, což se ale vlastně ve výjímečných situacích nakonec může hodit.

### 100% řešení

Řešení výše lze ještě trochu vylepšit tím, že nastavíte kontrolu chyb i na pipelině. To sice nezabrání vývojáři udělat commit obsahující chyby, nicméně lze tak zabránit, aby se tento commit alespoň nemergnul do hlavní větve (../typicky%20dev/master). Samozřejmě pouze za podmínky, že jsou procházející pipeliny nastaveny jako podmínka pro dokončení merge requestu.

Nastavení takového jobu na GitLab pipelině může vypadat např. takto:

```
eslint:
  stage: test
  script:
    - npx eslint . --ext .js,.jsx,.ts,.tsx
```

### 3. package-lock.json

Poslední věc, která často vytváří zbytečné diffy a které bych se chtěl v tomto článku věnovat je soubor `package-lock.json`.

`package-lock.json` od `npm v7` existuje v novější verzi, tzv. `lockfile v2` (https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#lockfileversion). Tato nová verze lockfilu je sice zpětně kompatibilní s `lockfile v1`, neznamená to však, že když vygenerujete `package-lock.json` pomocí `npm v6`, bude vypadat stejně jako když ho vygenerujete pomocí `npm v8` a to je problém. Pokud máte totiž v týmu vývojáře s rozdílnými verzemi `npm`, každý vytváří `package-lock.json` odlišné struktury a vytváří naprosto zbytečný a dlouhý diff, který většinou informuje pouze o tom, že vývojář vygeneroval lockfile podle jiné specifikace, což je opět věc, která by neměla v Git historii co dělat.

Dovolím si ještě poznamenat, jaké mohou být příčiny toho, že vývojáři mají jinou verzi `npm`.

1. `npm` je balíček instalovaný lokálně na počítači každého vývojáře a jeho defaultně instalovaná verze je závislá na verzi OS, který vývojář používá. Pokud např. vývojář začne používat vyšší verzi OS, může se mu zvýšit i verze `npm`.
2. Některé projekty vyžadují používat určitou verzi `npm`, resp. `node`, které je s `npm` úzce spojeno a to zejeména kvůli závislostem použitých na projektu, které potřebují určitou verzi `node`. Vývojáři, kteří často střídají projekty vyžadující jinou verzi `node`, si pomáhají různými node version managery, z nichž nejznámejší je asi `nvm`, který existuje i ve verzi pro Windows (https://github.com/coreybutler/nvm-windows). Problém je, že mohou lehko ztratit přehled o tom, na jakém projektu potřebují jakou verzi a nebo jednoduše pouze zapomenou při přesunu na druhý projekt verzi `npm` změnit.

### Řešení

Řešením je domluvit se v týmu na tom, v jaké verzi chcete na projektu udržovat `package-lock.json` a podle toho sjednotit verze `npm` mezi vývojáři.

Jakmile jste domluveni, můžete vytvořit konfigurační soubor pro `nvm` `.nvmrc`, který informuje o verzi `node`, která se na projektu používá. Od verze `node` se odvíjí verze `npm`, takže pokud chcete používat na projektu např. `npm v8`, vložili byste do soubou třeba hodnotu `16`, protože `node v16` používá právě `npm v8`. Poté stačí vývojáři před prací na projektu spustit příkaz `nvm` a `nwm` automaticky přepne na node ve verzi uložené v souboru `.nvmrc`.

Správnou verzi `node` lze na projektu dokonce přímo vynutit. Stačí přidat do `.npmrc`:

```
engine-strict=true
```

a do `package.json`:

```
"engines": {
  "npm": ">=8.O.O" // nebo jakákoliv jiná verze
}
```

Zda verzi `npm` přímo vynucovat nebo nebo jen doporučovat už nechám na vašem uvážení.

# K čemu všemu jsme se rozhodili v Synetechu využívat ESLint?

Kromě toho, že v Synetechu využíváme na projektech lintování podle základních ESLint pravidel (https://eslint.org/docs/rules/), našli jsme pro ESLint využití i v dalších use casech:

## Redukce Git konfliktů v importech (autosort importů)

Při týmové práci v Reactu občas narazíte na jeden zajímavý problém. Někdy se stane, že dva vývojáři upravují zároveň stejný soubor a občas oba dva z nich přidají do souboru nový import. Pokud je nový import přidán pomocí našeptávacího menu v IDE, většina IDE tento import zařadí do seznamu importů dle abecedy, což riziko konfliktu importů snižuje. Je totiž pravděpodobné, že každý vývojář přidal nový import na jiné místo v abecedě. Problém nastává ale v těchto případech:

1. Ne každý vývojář musí v IDE používat automatické přidávání používaných importů.
2. Importy, které ještě nebyly v projektu nikdy použity, se nenašeptávají. Typicky jsou to importy obrázků.

V těchto případech většina vývojářů nový import píše ručně a nové importy přidává na konec seznamu doposud definovaných importů. Toto workflow bohužel vytváří zbytečné situace, kdy musíte během konfliktu řešit, který z přidaných importů chcete zachovat, přestože chcete vždy zachovat oba 2.

Tyto situace se však dají redukovat. Existuje totiž ESLint plugin `eslint-plugin-simple-import-sort` (https://www.npmjs.com/package/eslint-plugin-simple-import-sort), který řeší sort importů nezávisle na IDE, takže i pokud vývojář přidá import na konec řádku, po uložení souboru (autofix), se mu automaticky import vloží na správné místo dle abecedy.

Tento přístup tak konflikty v importech redukuje na minimum. Jediná situace, kdy konflikt tak jako tak vznikne, je ta, když je nový import od obou vývojářů zařazen náhodou na stejný řádek (importy mají názvy, které si jsou blízko v abecedě).

*Pozn.: Samozřejmě toto řešení je nejvíc efektivní u větších souborů, respektive u souborů, které mají více importů. U malých souborů s malo importy je stále docela velká šance, že se oba nově přidávané importy trefí na stejné místo v abecedě.*

## Automatické mazání nepoužitých importů

Určitě se vám už někdy stalo, že vám ESLint zahlásil něco jako *“XXX is declared but its value is never read.”*. Tato hláška většinou naznačuje, že jste právě smazali nějakou komponentu, která se v tu chvíli už nenechází na žádném dalším místě v souboru, ale zapomněli jste ji zároveň odmazat také z importů. Toto manuální odmazávání je však nudná a čas konzumující činnost. Naštěstí ESLint disponuje pluginem `eslint-plugin-unused-imports` (https://www.npmjs.com/package/eslint-plugin-unused-imports), který umí odmazání nepoužitého importu zautomatizovat a autofixem po uložení souboru všechny nepotřebné importy automaticky smazat.

# Závěr

Věřím, že k udržitelnému a správnému formátování kódu je potřeba přistupovat z mnoha různých úhlů. My v Synetechu používáme tento setup na posledních několika projektech a zatím se nám osvědčil. Pokud ho měníme, tak většinou už jen přidáváme nová pravidla vztahující se k nějaké technologii použité na projektu, např. Cypress nebo MUI, ale to už by bylo na další článek…
