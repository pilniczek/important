---
title: GraphQL
---

**docs:** [https://graphql.org/code/#javascript](https://graphql.org/code/#javascript)

**Gatsby docs:** [https://www.gatsbyjs.com/docs/tutorial/part-4/](https://www.gatsbyjs.com/docs/tutorial/part-4/)

---

## Why

We need GraphQL to unlock the full power of Gatsby. GraphQL is used for querying content there.

We also use GraphQL for API communication. Regardless if the API has QraphQL or REST endpoint.

---

## Main ideas

**Each component can (and should) query exactly the fields it requires to render, with no superfluous data sent over the network.**

[https://www.apollographql.com/docs/react/data/operation-best-practices/#query-only-the-data-you-need-where-you-need-it](https://www.apollographql.com/docs/react/data/operation-best-practices/#query-only-the-data-you-need-where-you-need-it)

Main advantage is that you load only what you need. In the other hand it requires lots of magic in resolvers.

---

## Build and Runtime data loading

You can load some data in build time (npm run build) and different i runtime. At the build time we loading data using Static queries which is under full control of Gatsby. In other hand at run time you are not able to load data using Gatsby but you need to load them using any front end javascript client for example Apollo.

---

## Experience from project

Na projektu tvorby klientského portálu jsme se rozhodli využít knihovnu Apollo Client. V komponentách jsme psali Graphql dotazy, takže komponenty dostávali přesně jen ty data, které potřebovali. Narazili jsme však na několik zádrhelů, které nám časem hrozně překáželi až jsme byli nakonec nuceni Apollo Client nahradit React Query. Nejde o obecnou pravdu, že bychom tím pádem Graphql používat nechtěli, ale jde o specifikou situaci. **Není vhodné používat Apollo Client když máte pouze klasický REST backend**. Je potřeba:

- Napsat vlastní graphql schéma popisující data chodící z BE proto aby se mohl generovat Typescript pro dotazy. Dá se ruční psaní obejít tím, že schéma nějak vygeneruješ ze swagger.json
- Když se spustí dva dotazy na jedné stránce, které se ptají na stejný detail produktu, nastane řada potíží, které je třeba řešit.
    - Custom resolver se zavolá dvakrát, což spustí dva síťové dotazy. Apollo nebatchne tyto dvě provolání custom resolverů, což bylo pro mě velké překvapení. Batch je možné si udělat sám přes Data Loaders.
    - Data Loaders mají vlastní cache, kterou automaticky využívají. Apollo má také svojí cache. Nechceme aby byli používány obě, proto je nutné hned po načtení dat Data Loader vyčistit.
    - Data Loadery je třeba použít pouze když jsou dotazy paralelní, když jsou sériové, není třeba, ale následující dvě odrážky platí stejně.
    - Apollo výsledek každého dotazu na detail produktu zapisuje do cache (zapisuje tam výsledek dotazu, nikoli celý vrácený objekt) a tím jak jsou dotazy na sobě úplně nezávislé, nastane taková zajímavá, pro mě nečekaná a zbytečná věc. Dotaz A zapíše svou část do cache, pak přijde zápis části z dotazu B, který však by default **přepíše** a tím **odstraní** celou část z dotazu A. Hook useQuery pro dotaz A to pochopí tak, že se podívá do cache, jak se změnila data, uvidí že data které před chvílí zapsal chybí. Nechá tedy znovu vyvolat custom resolver aby mu data sehnal, ten je v pohodě znova sežene spuštěním nového REST dotazu. Apollo znovu zapíše data z A do cache tím že **přepíše a odstraní** to co si zapsal useQuery B. Tím se uzavírá nekonečná smyčka která vyprovokuje B znovu spustit dotaz a znovu odstranit data Áčku.
    Celá tahle sranda má řešení v přepsání defaultního chování Apollo cache, jaké máme možnosti je možné zjistit zde [https://www.apollographql.com/docs/react/caching/cache-field-behavior](https://www.apollographql.com/docs/react/caching/cache-field-behavior). První zápis Áčka zapíše tak jako předtím, Béčko se již zachová trochu jinak, z cache vytáhne co tam našlo od Áčka a mergne a zapíše do cache. Hook useQuery od Áčka je sice notifikován, že se data v cache replacenuly, vezme si je tedy a tím se kruh roztrhl, protože nemá důvod nic do cache zapisovat.
    Všechno tohle mergování je třeba psát a může být opravdu komplexní, když jde o pole objektů.
    - Custom resolvery musejí vyplňovat objektům navíc propertu, která Apollu řekne o jaký objekt vůbec jde, jestli product, profil, transakci, apod.. Jde o propertu `___typename`. Je to logické, tím že vracíme v custom resolveru nějaký objekt vůbec Apollu neříkáme, jaké má schéma, to on ani nikde neví a to schéma právě tvoříme v resolverech… soubor schema.graphql totiž **není vůbec nijak propojen s Apollo** ani to není možné, ten máme jen pro generování typescriptu.
- Dotazům na seznamy které jde filtrovat a stránkovat (třeba seznam transakcí) je třeba věnovat speciální péči jinak nebudou správně brány z cache a každá změna filtru, speciálně ta kterou jsme již někdy nastavili a čekali, že se nám načte okamžitě z cache.
- Návratový typ useQuery popisuje, že properta `data` je typu `TData | undefined` takže je třeba explicitně psát podmínku `if(result.data)` aby nám neřval typescript
