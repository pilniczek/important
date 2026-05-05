---
title: Lighthouse
tags:
  - Testing
  - QA
type:
  - Tool
---

**Nástroj pro běh v CL/pipelině:**

[https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md)

[[lighthouserc-js-example|lighthouserc.js example]]

## Spouštění reportů

### Developer a Tester

Viz package.json `"lighthouse": "lhci autorun",` - tedy `npm run` lighthouse.

Může si je spustit kdokoli manuálně.

Může se spustit v pre-commit hooku (husky).

Pokud vývojáři spadne report pod akceptovatelnou hranici, opraví si kód nebo pushne a napíše do merge requestu, proč se to tak má mergnout.

Pokud testerovi spadne report pod akceptovatelnou hranici, zkontroluje merge request. Pokud tam není vysvětleno, proč může test failnout, vrátí práci vývojáři.

### Pipeline

Viz .gitlab-ci.yml `- npm run lighthouse`

Zároveň je možnost v detailu pipeline stáhnout report.

Výsledek reportu nesmí bránit mergnutí (failnutí testu vyhazuje warning).

Pokud se merguje s warningem, je potřeba do merge requestu napsat vysvětlení a zložit follow-up issue pro vyřešené danného warningu.

## Nastavení dle typu projektu

Rozlišujeme primárně 2 typy projektů:

[B2C Project](B2C-Project/index.md)

[B2B Project](B2B-Project/index.md)

## Možnosti nastavení

1. na základě auditu konkurence
2. na základě statistik [https://httparchive.org/](https://httparchive.org/)

### Audit konkurence

Navrhnout ideální skóre třeba jako průměr konkurenčních projektů. Nemusí se jednat vždy o průměr, stačí čísla předložit klientovi nebo PMku a ať si sami řeknou. Když jim to bude jedno určíme si výpočet sami na základě čísel konkurence.

### Statistiky httparchive

Nastavení by mohlo být zhruba *“vezmu lighthouse analýzy nad mnoha weby a pokusím se umístit mezi 10% nejlepších. (To se mi od oka zdá dostatečně dobré, ale zároveň ne šibeniční.) Přičemž méně důležité atributy budu cilit mezi 25% nejlepších.”*

![[lighthouse-score.webp]]

Hlavní zdroj: [https://www.tunetheweb.com/blog/what-do-lighthouse-scores-look-like-across-the-web/](https://www.tunetheweb.com/blog/what-do-lighthouse-scores-look-like-across-the-web/)

Tedy:

```jsx
assert: {
	assertions: {
		// always important metrics
		'categories:best-practices': [
			'warn',
			{ minScore: 0.86, aggregationMethod: 'median' },
		],
		// B2B less important metrics
		'categories:performance': [
			'warn',
			{ minScore: 0.55, aggregationMethod: 'median' },
		],
		'categories:accessibility': [
			'warn',
			{ minScore: 0.88, aggregationMethod: 'median' },
		],
	},
},
```

Přičemž:

Dá se diskutovat o aggregationMethod. Často jsem viděl používání `pessimistic`, ale median se mi zdá v pohodě.

[https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#aggregation-methods](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#aggregation-methods)

Taky by se dalo diskutovat o `numberOfRuns`. `5` se mi od oka zdá jako OK.

![[lighthouse-ngnt.jpg]]

Co mě překvalipo, že `performance` stačí 55, aby se člověk dostal do nejlepší čtvrtiny. Pocitově myslím, že bychom měli chtít víc.

### Dosah

- local-scale (ČR)
- international-scale

**Nastavení hranic international-scale budeme diskutovat, až takový projekt budeme dělat.**

### PWA

Cokoli z výše uvedeného může být navíc PWA, pak se musí přidat PWA konfig.

**Nastavení hranic testu budeme diskutovat, až PWA budeme dělat.**

### Jak skóre modifikovat

- minScore
- aggregationMethod

**Nechceme customizovat `aggregationMethod`, chceme customizovat `minScore`?**
