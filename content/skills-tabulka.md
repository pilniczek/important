---
title: 'FE: Dovednosti'
tags:
  - Team
  - Skill
type:
  - People
---

Stack info: JavaScript, React, TypeScript, Next.js (App router), react-query / TanStack Query, react-hook-form, yup, HTML, CSS, Eslint, Figma, Vite, Playwright.

**Sloupce:**

- **Důležitost** — 1 (nice-to-have) až 3 (kritická). Platí pro obojí.
- **Umím** — ✓ / ✗.

**Priorita rozvoje** = `Důležitost (firma) × Důležitost (já)`. Rozsah 1–9. Počítá se jen pro ✗ řádky. Seřazené sestupně = top of list je společný cíl firmy i devu.

## Markup

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. HTML standardní atributy** | `Image má alt`. Důležité na veřejných webech, ne na interních appkách. `onClick` na všech elementech. | 3 | | |
| **2. React JSX** | Nepoužívá se `class`, ale `className`. Navíc `key`, když se jedná o seznam. | 3 | | |
| **3. HTML5 prvky** | `dialog`, `picture`, `source`, `details`. | | | |
| **4. Accessibility (WCAG)** | aria, keyboard navigation, alt; testování klávesnicí a screen readery. | | | |
| **5. Speciální atributy** | `data-*` (např. `data-testid`, atributy pro analytiku či custom binding). | 1 | | |
| **6. Speciální značky / nástroje** | open graph / twitter cards, GA/GTM/Hotjar, … | 1 | | |
| **7. Metadata a strojová čitelnost** | strukturovaná data ([Google FAQ docs](https://developers.google.com/search/docs/data-types/faqpage)), microdata ([schema.org](https://schema.org/docs/gs.html)). *Otázka: Co bys udělal pro zlepšení strojové čitelnosti webu?* | 1 | | |
| **8. Meta & SEO basics** | meta tagy, hierarchie nadpisů, sémantické značky. | | | |

## Styling (CSS)

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Flexbox** | Layout pomocí flexboxu, základní primitiva pro vytvoření layoutu. | 3 | | |
| **2. CSS Grid (basics)** | `grid areas`, základní použití CSS grid. | 3 | | |
| **3. Pokročilý Grid** | `auto-fit`, `auto-fill`, `minmax`, `subgrid`. | 3 | | |
| **4. Responzivita** | Alespoň dvě z: flexbox, media queries, grid. | 3 | | |
| **5. CSSinJS** | Pracoval jsi v CSSinJS? Zmíní: props jako values, zapouzdření. | 3 | | |
| **6. Izolace CSSinJS komponent** | Jak zařídit, aby změna CSS jedné komponenty neovlivnila jinou (i když sdílí třídy). | 2 | | |
| **7. Runtime vs non-runtime CSSinJS** | Rozdíl a dopad na uživatele. | 1 | | |
| **8. ITCSS** | Řeší rozsah účinnosti cssek; zahrnuje i Atomic design. | 2 | | |
| **9. BEM** | Naming konvence (block / element / modifikátor). | 1 | | |
| **10. Cross-browser kompatibilita** | Alespoň dvě: caniuse, lambdatest, browserstack, autoprefixer, polyfill. | 3 | | |
| **11. Optimalizace** | Jak zjistíš, že máš CSSka napsaná neoptimálně? Příklad neefektivního CSS selectoru (hvězdička). | 2 | | |
| **12. `:has`** | CSS selektor `:has`. | | | |
| **13. Container queries** | Responsive design založený na velikosti kontejneru. | | | |
| **14. Custom `@function`** | Vlastní CSS funkce. | | | |
| **15. Definice & použití CSS proměnných** | `--foo`, `var()`. | | | |
| **16. Theme přes CSS proměnné** | theme (spacing, colors), škálování. | | | |
| **17. Runtime úprava CSS proměnných** | JS změna stylu přes CSS proměnné. | | | |
| **18. CSS animace** | `transitions`, `transform`, `keyframe`, SVG animace, framer-motion; kdy už musí na JS. | 1 | | |
| **19. Page transitions** | Animované přechody mezi stránkami. | | | |
| **20. Material UI** | MUI i bez dokumentace (`theme`, components, custom props; vazba na ITCSS). | 1 | | |
| **21. Bootstrap** | Stačí s dokumentací (počítáme, že junior nemusí dát všechno). | 1 | | |
| **22. Tailwind** | Stačí s dokumentací (počítáme, že junior nemusí dát všechno). | 1 | | |

## JavaScript

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. ECMAScript standards** | Různé verze a že potřebuje Babel pro nejnovější funkce. | 2 | | |
| **2. Promises** | `async`/`await`, queue, `Promise.all` / `Promise.allSettled`. | | | |
| **3. async vs paralelismus** | Rozdíl mezi async a paralelismem. | | | |
| **4. Call stack** | JavaScript call stack. | | | |
| **5. Task queue** | Task queue v event loopu. | | | |
| **6. Microtask queue** | Microtask queue v event loopu. | | | |
| **7. Event loop** | JavaScript event loop, jak funguje. | | | |
| **8. WebWorkers** | Kdy a jak použít WebWorkers (background processing). | | | |
| **9. ServiceWorkers** | Kdy a jak použít ServiceWorkers (offline, push, caching). | | | |
| **10. localStorage / sessionStorage** | Lifetime, scope, ~5MB limit. | | | |
| **11. Cookies** | `Set-Cookie`, expirace, domain, scope. | | | |
| **12. Cookie security** | `HttpOnly`, `Secure`, `SameSite`. | | | |
| **13. IntersectionObserver** | Sledování viditelnosti elementu (lazy loading, infinite scroll). | | | |
| **14. MutationObserver** | Sledování změn v DOM. | | | |
| **15. ResizeObserver** | Sledování velikosti elementu. | | | |
| **16. Module systems** | ESM / CJS / UMD / AMD; default vs named exports. | | | |
| **17. Dynamic import** | `import()`, lazy chunks. | | | |
| **18. Breakpointy v DevTools** | Set, conditional, logpoint breakpoints v browser DevTools. | | | |
| **19. Breakpointy v IDE** | VSCode JS Debug a podobné. | | | |
| **20. `debugger` statement** | Kdy se hodí `debugger` statement v kódu. | | | |
| **21. Sourcemapy** | Konfigurace, rozumět produkčnímu stacktrace. | | | |

## React

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. useEffect** | Řeší 3 life cycle: `didMount`, `didUpdate`, `Unmount`. | 3 | | |
| **2. Hooks** | Odproštění stavové logiky od UI. `useId`, `useReducer`, `use`, `useOptimistic`. *Nice-to-have: Co se používalo před hooks?* | 3 | | |
| **3. useRef vs `getElementsBy*`** | Proč `useRef` místo `getElementsBy*`? | 3 | | |
| **4. Lifting state up vs passing props** | Rozdíl mezi *Lifting state up* a *Pass component to child*. Zmíní React Context. | 3 | | |
| **5. HOC** | LIBOVOLNOU komponentu rozšířit o nějakou vlastnost. | 2 | | |
| **6. React Portals** | Ví, k čemu to je (nemusel použít). | 1 | | |
| **7. Nové React features** | React compiler, Suspense. | | | |
| **8. Data fetching** | react-query / SWR, caching, invalidace; rozdíl oproti `fetch` přímo. | | | |
| **9. Server Components** | Kdy use case, hranice client/server. | | | |
| **10. Zustand** | Použití Zustand pro state management. | | | |
| **11. Redux** | Použití Redux pro state management. | | | |
| **12. Recoil** | Použití Recoil pro state management. | | | |
| **13. Jotai** | Použití Jotai pro state management. | | | |
| **14. Context jako state management** | Kdy stačí Context, kdy už ne. | | | |
| **15. Form library (RHF / Final Form)** | react-hook-form, Final Form. | | | |
| **16. Schéma validace (zod / yup)** | Validační schémata. | | | |
| **17. Cross-field validace** | Validace pole na základě hodnoty v jiném poli. | | | |
| **18. Hydratation** | Princip hydratace, kdy se spouští, kdy se rozbije. | | | |
| **19. SSR / SSG / ISR** | Rozdíly mezi rendering strategiemi. | | | |
| **20. App router vs Page router** | Rozdíly a kdy co použít. | | | |
| **21. Internationalization** | i18n, next-intl / react-intl, napojení na translation manager. | | | |

## TypeScript

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. TS basics** | Validní důvody, proč použít TS. Types, interface, union, intersection, enum. Kontroverze kolem `enum`. | 2 | | |
| **2. TS advanced** | Generics, mapped/conditional types. | 2 | | |
| **3. TS utility types** | `Partial`, `Pick`, `Omit`, atd. | 2 | | |
| **4. tsconfig** | `target`, `strict`, `paths`, alias. | 2 | | |
| **5. Řešil jsi typovost i jinak? Jak?** | Alternativní přístupy k typování (JSDoc, PropTypes…). | | | |

## Git

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Synchronizace** | `clone`, `pull`, `push`, `fetch`. | 3 | | |
| **2. Větvení** | `branch`, `merge`. | 3 | | |
| **3. Rebase** | `git rebase`. | 3 | | |
| **4. Úprava historie** | `commit --amend`, squash. | 3 | | |
| **5. Conventional commits** | Commit message konvence. | 3 | | |
| **6. Bitbucket** | Issues, merge, atd. (Settings nemusí do hloubky.) | 3 | | |
| **7. GitHub** | Issues, merge, atd. (Settings nemusí do hloubky.) | 3 | | |
| **8. GitLab** | Issues, merge, atd. (Settings nemusí do hloubky.) | 3 | | |
| **9. Azure DevOps** | Issues, merge, atd. (Settings nemusí do hloubky.) | 3 | | |
| **10. Extended: řešení konfliktů** | `git rebase -i`, message conventions, branch management, team development. | 2 | | |

## Práce s API

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Formulování / posílání requestu** | Základní hlavičky: `User-Agent`, `Content-Type`. Query params, body, headers. | 1 | | |
| **2. HTTP/1 vs HTTP/2** | TCP spojení, server push. | | | |
| **3. API knihovna** | Fetch API nebo Axios; způsob přijímání/odesílání requestů. | 1 | | |
| **4. Autorizace vůči API** | basic, digest, oauth, JWT token, refresh token, opaque token. Rozdíl autorizace vs autentizace. | 1 | | |
| **5. GraphQL** | query, mutation, fragments, subscriptions; pro a proti vs REST. | | | |
| **6. WebSocket** | Obousměrná komunikace, signalR, reconnecting strategy. | | | |
| **7. Klasická pagination** | page / size / offset. | | | |
| **8. Infinite scroll** | Načítání dalších dat při scrollování. | | | |
| **9. Filtering & sorting přes URL params** | Sdílitelný stav filtrů přes URL. | | | |
| **10. Základní upload** | FormData, multipart. | | | |
| **11. Chunkování velkých souborů** | Upload po částech. | | | |
| **12. Progress bar** | XHR / fetch s reporting průběhu uploadu. | | | |
| **13. Swagger / OpenAPI generátor** | Vygenerovat kód, upravit konfiguraci. | | | |

## Nástroje, prostředí a workflow

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Node + npm** | Základní práce s Node a npm. | | | |
| **2. nvm** | Správa více verzí Node. | | | |
| **3. Linting (ESLint, Prettier)** | Konfigurace lint nástrojů, i v pipelines. | | | |
| **4. husky** | Git hooks (pre-commit, pre-push); spouštění linterů a testů před commitem. | | | |
| **5. SSH** | SSH klíče, konfigurace. | | | |
| **6. package.json** | deps, devDeps, scripts, version. | | | |
| **7. Založit projekt dle specifikace** | (Specifikace je WIP.) | | | |
| **8. React DevTools + browser DevTools** | Debugging. | | | |
| **9. Lighthouse / web vitals (měření)** | Lighthouse, web vitals; navrhnout akční kroky na základě dat. | | | |
| **10. React profiler (profiling)** | Profiling React aplikací. | | | |
| **11. React compiler** | Bez memoization — compiler ji řeší. | | | |
| **12. Automatizovaný error reporting (Sentry)** | Nastavit. | | | |
| **13. Incident na produkčním prostředí** | Zareagovat (WIP). | | | |
| **14. Figma** | Vykopíruje, co potřebuje. | | | |
| **15. Dokumentace** | readme, wiki, Notion. &#91;[[asking-questions-that-show-and-tell#Teamwork\|TW5]]&#93; | | | |
| **16. Build tools** | Vite, Webpack; bundling, dev server, HMR. | | | |
| **17. Monorepo workflows** | monorepo vs multirepo, microfrontends. | | | |
| **18. Docker** | Kontejnerizace; WSL. | | | |
| **19. Měření bundle size** | Bundle analyzer, source-map-explorer. | | | |
| **20. Code splitting / lazy loading** | Rozdělení bundlu na menší kusy. | | | |
| **21. Tree shaking** | Eliminace nepoužitého kódu při buildu. | | | |

## Code quality, security a testování

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Clean code practices** | KISS, DRY, SOLID, struktura projektu; self-descriptive code místo komentářů. | | | |
| **2. Refactoring** | Kdy a jak; bezpečné refactor patterns. | | | |
| **3. Code review** | Chápat kód (FAKT TEN KÓD CHÁPE), ne jen scrollovat diff; podívat se na vybuilděnou verzi; navrhovat lepší řešení místo komentování blbostí; checklisty/templaty. &#91;[[asking-questions-that-show-and-tell#Teamwork\|TW5]]&#93; | | | |
| **4. Psát / generovat testy** | Cypress, Jest, Vitest, Playwright. | | | |
| **5. Unit, integrační a end-to-end testy** | Rozdíl mezi unit, component a UI / E2E testy. | 1 | | |
| **6. Mockování dat** | Užitečné pro simulování výchozího stavu; nástroje typu postman/insomnia/tweak; mock server (např. vite mock server). | 1 | | |
| **7. Security basics** | XSS, CSRF, CORS, sanitizace, escape; client vs server validace. | | | |
| **8. SonarQube** | Code quality / security scanner; napojení na pipeline. | | | |
| **9. JFrog** | Artifact repository / security scanner. | | | |

## Doplňková témata

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. PWA** | Alespoň 3 vlastnosti z: offline, notifikace, vyhledatelnost, Service Worker, soubor Manifest. Update strategy, custom ikony. iOS PWA podpora horší než Android. | 2 | | |
| **2. Mapy, geolokace** | markery, adresy, souřadnice, custom skin (např. Google Maps). | | | |
| **3. NPM packages** | Vytvoření vlastního balíčku, publikace, FE standardy. | | | |
| **4. AI ve vývoji** | agents, Copilot, Claude Code, vibe coding, agent standards, vlastní utility a automatizace. &#91;[[asking-questions-that-show-and-tell#Motivation\|Mot3]]&#93; | | | |
| **5. Komunikace s nativní mobilní app** | Jak z webu dostat uživatele do nativní appky (Web Intents). | 1 | | |

## Sebeřízení

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Umí říct „nevím"** | Nesnaží se mlžit / vymýšlet odpověď. &#91;[[asking-questions-that-show-and-tell#Lessons learned\|LL1]]&#93; | | | |
| **2. Umí říct „posral jsem to" a popsat proč** | Už se ti někdy stalo, že se ti něco nepovedlo? Schopen sebekritiky. &#91;[[asking-questions-that-show-and-tell#Lessons learned\|LL1]], [[asking-questions-that-show-and-tell#Lessons learned\|LL2]], [[asking-questions-that-show-and-tell#Teamwork\|TW3]]&#93; | | | |
| **3. Rozhodnutí založená na datech** | Kdybys nás chtěl přesvědčit o nové technologii, jak bys to udělal? Přijde s daty/články, není hádavý a tvrdohlavý. &#91;[[asking-questions-that-show-and-tell#The most important\|MI2]]&#93; | | | |
| **4. Aktivní osobní rozvoj** | Sám se rozvíjí, zajímá se o nové technologie. &#91;[[asking-questions-that-show-and-tell#Professionalism\|Prof2]], [[asking-questions-that-show-and-tell#Motivation\|Mot3]]&#93; | | | |
| **5. Přizpůsobení se změnám / novým technologiím** | &#91;[[asking-questions-that-show-and-tell#Professionalism\|Prof3]], [[asking-questions-that-show-and-tell#Lessons learned\|LL3]]&#93; | | | |

## Spolupráce

| Skill | Detail | Důležitost (firma) | Umím | Důležitost (já) |
|---|---|---|---|---|
| **1. Programování v páru** | Už jsi někdy zkoušel párové programování v pozici vysvětlujícího? Říká si o paircoding / konzultaci u věcí, u kterých si není jistý. Umí se podívat do dokumentace dřív, než se zeptá. &#91;[[asking-questions-that-show-and-tell#Teamwork\|TW2]], [[asking-questions-that-show-and-tell#Teamwork\|TW4]], [[asking-questions-that-show-and-tell#Teamwork\|TW5]]&#93; | | | |
| **2. Odprezentovat znalost více lidem (meeting)** | &#91;[[asking-questions-that-show-and-tell#Communication\|Comm1]], [[asking-questions-that-show-and-tell#Teamwork\|TW5]]&#93; | | | |
| **3. Blogový příspěvek** | Napsal jsi nějaký? &#91;[[asking-questions-that-show-and-tell#Communication\|Comm1]], [[asking-questions-that-show-and-tell#Teamwork\|TW5]]&#93; | | | |
| **4. Podá zpětnou vazbu / ozve se** | (Dokáže nám dát zpětnou vazbu třeba na proběhlý pohovor.) &#91;[[asking-questions-that-show-and-tell#Teamwork\|TW6]]&#93; | | | |
| **5. Přijme zpětnou vazbu** | (Hodnotitelné nejdřív v rámci zkušební doby.) &#91;[[asking-questions-that-show-and-tell#Teamwork\|TW6]]&#93; | | | |
| **6. estimace** | Primitivní příklad problému (toggle button reagující na API, hover/active stavy, použití knihovny s úpravou barev) + popsat proces rozhodování. Obecně plánovat (v závislosti na senioritě). &#91;[[asking-questions-that-show-and-tell#Self-management\|SM1]]&#93; | 3 | | |
| **7. Informuje o překročení estimace** | Když zjistíš, že nestíháš estimaci, informuješ raději product managera (než togglování). Včas informuje o tom, že nestíhá. &#91;[[asking-questions-that-show-and-tell#Lessons learned\|LL2]], [[asking-questions-that-show-and-tell#Teamwork\|TW3]]&#93; | | | |
| **8. Včas řeší volna / dovolené** | &#91;[[asking-questions-that-show-and-tell#Self-management\|SM1]]&#93; | | | |
| **9. Řeší nejasná zadání** | Vnímá výhody/nevýhody obou extrémů: přehnané dotazování PMka vs špatné zpracování úkolu. Zná / chce znát širší kontext, rozpozná konfliktní zadání, programuje řešení odpovídající potřebám. &#91;[[asking-questions-that-show-and-tell#Communication\|Comm2]]&#93; | | | |
| **10. Veřejně obhájí svůj názor** | &#91;[[asking-questions-that-show-and-tell#Communication\|Comm2]]&#93; | | | |
| **11. Vedení lidí** | Už jsi vedl nějaké lidi? &#91;[[asking-questions-that-show-and-tell#Professionalism\|Prof2]], [[asking-questions-that-show-and-tell#Teamwork\|TW2]], [[asking-questions-that-show-and-tell#Teamwork\|TW4]]&#93; | | | |
