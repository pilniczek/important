---
title: Šablona nacenění projektu (zatím DAS)
---

```jsx
TLDR: Teď je tu DAS, templatu z toho zpětně udělá Tomáš
```

## Zatím 54,5 MD na FE s CMS

### General

**Deployment projektu: 5MD**

**Setup projektu: 5MD**

Next, Staging Vercel, Strapi + DB connection, GitLab + CI/CD

**Příprava UI tématu: 2MD**

paleta, spacingy, typografie, atp. + komunikace s design housem

**Layouty a reusované komponenty: 1,5MD**

header, footer, atp.

**Napojení na analytiky: 0.5MD - 2MD**

GA/GTM/HotJar…

### Specific

**Napojení existující backend/CRM:** (*do obecné šablony dát 4MD*) na DAS **0MD**, protože sjednavač a formuláře budou nejspíš přes iframe

### **CMS**

**Blog: 4MD (5MD edit)**

seznam článků, editaci, smazání, wysiwyg, role uživatelů

**Preview článků: 1MD - 3MD**

se styly odladěnými podle produkce

**Správa neblogového obsahu: 5MD**

**Správa nových landing pages: 10MD??**

**Web “Právo pro všechny”: NEUMÍME VYHODNOTIT**

~~Návrh řešení je napojit Strapi na existující DB s obsahem práva pro všechny. Do samotného webu právo pro všechny by se nijak nezasahovalo.~~

~~Strapi se neumí napojit na dvě db. Napojení na existující DB nelze vyřešit. (Nenapojíme nový admin na starou DB.)~~

~~Nevyhneme se ted;y migraci na stejnou DB, jakou bude využívat D.A.S.~~

**Jaká je motivace pro migraci práva pro všechny? Jak má vypadat výsledek?**

**Napojení existujícího sjednavače: 2MD**

Iframy, řešení komunikace mezi iframem a D.A.. webem, odhad zahrnuje naší implementaci a komunikaci se správci sjednavače.

### Rozsah webu - počet stránek - 274

22 nejsou články (2 unikátní typy stránek)

v mapě několik stránek chybí (cca +5 unikátních typů stránek)

- musíme nařezat šablony pro 8 unikátních stránek
- homepage (nejsložitější) cc 3MD s napojením na CMS
- ostatní cca 2.5MD na stránku s napojením na CMS

**tvorba šablon s napojením na CMS odhadem 20 MD**

<aside>
🚫 Data jsou sebrána z https://www.das.cz/sitemap.xml. v seznamu se objevuje example.com nejspíš proto, že někdo udělal chybu v konfiguraci.

https://example.com/nase-sluzby/podnikatele/specialni/skoly-skolky/
[https://www.das.cz/nase-sluzby/podnikatele/specialni/skoly-skolky/](https://www.das.cz/nase-sluzby/podnikatele/specialni/skoly-skolky/)

</aside>

https://example.com/nase-sluzby/soukrome/zamestnanec/

https://example.com/nase-sluzby/soukrome/balicky/rodina/

https://example.com/nase-sluzby/soukrome/balicky/partner/

https://example.com/nase-sluzby/soukrome/balicky/single/

https://example.com/nase-sluzby/soukrome/balicky/single-plus/

https://example.com/nase-sluzby/soukrome/balicky/senior/

https://example.com/nase-sluzby/soukrome/balicky/ridic-plus/

https://example.com/nase-sluzby/podnikatele/podnikatel/

https://example.com/nase-sluzby/podnikatele/specialni/lekar/

https://example.com/nase-sluzby/podnikatele/specialni/skoly-skolky/

https://example.com/nase-sluzby/podnikatele/specialni/obec/

https://example.com/nase-sluzby/podnikatele/specialni/sportovec/

https://example.com/nase-sluzby/podnikatele/specialni/myslivec/

https://example.com/nase-sluzby/soukrome/pravni-poradenstvi-do-kapsy/

https://example.com/nase-sluzby/podnikatele/specialni/bezpecnostni-a-ozbrojene-slozky/

https://example.com/nase-sluzby/podnikatele/poradenstvi-pro-podnikatele/

https://example.com/online/formular/balicek-rodina/

https://example.com/online/formular/balicek-partner/

https://example.com/online/formular/balicek-single/

https://example.com/online/formular/balicek-single-plus/

https://example.com/online/formular/balicek-senior/

https://example.com/online/formular/balicek-ridic-plus/

https://example.com/clanky/traktorum-pry-taky-obcas-prirozene-dojde-stava/

https://example.com/clanky/prave-rameno-pry-bude-nejaka-levota/

https://example.com/clanky/zahradni-houpacka-pry-neni-lunapark/

https://example.com/clanky/ze-sberatele-zbrani-by-si-pry-nikdy-nevystrelil/

https://example.com/clanky/kdyby-pry-tolik-nesetrila-mohla-si-usetrit-potize/

https://example.com/clanky/ridic-kamionu-je-pry-beztak-stale-jednou-nohou-ve-vezeni/

https://example.com/clanky/kdyby-pry-jezdil-s-autoatlasem-navigaci-by-mu-neukradli/

https://example.com/clanky/ve-svych-aukcich-pry-ma-tak-akorat-hokej/

https://example.com/clanky/neprovedena-prace-je-pry-take-prace/

https://example.com/clanky/srna-pry-neni-zadny-myslivecky-domaci-mazlicek/

https://example.com/clanky/sedacka-pry-neni-zadna-trampolina/

https://example.com/clanky/za-chybu-v-eurech-pry-neuvidi-ani-korunu/

https://example.com/clanky/ve-sve-firme-pry-muze-zamestnavat-koho-chce/

https://example.com/clanky/stiznosti-pacientky-ma-pry-plne-zuby/

https://example.com/clanky/kdyz-pry-platil-jednou-muze-platit-porad/

https://example.com/clanky/urok-na-sporeni-pry-snizi-zcela-zdarma/

https://example.com/clanky/dobrou-pojistovnu-pry-nikdo-na-kolena-nedostane/

https://example.com/clanky/svedci-pry-do-nehody-nemaji-co-mluvit/

https://example.com/clanky/aspon-si-pry-z-dovolene-odvezl-nejake-zazitky/

https://example.com/clanky/duchodci-pry-nemaji-narok/

https://example.com/clanky/nehoda-bmw-pry-rozhodne-neni-nahoda/

https://example.com/clanky/za-chyby-se-pry-plati-i-kdyz-nejsou-vase/

https://example.com/clanky/s-marihuanou-by-se-pry-tolik-nemracil/

https://example.com/clanky/pokuty-se-pry-platit-nemusi/

https://example.com/clanky/za-nemoc-z-povolani-pry-zamestnavatel-nemuze/

https://example.com/clanky/oprava-pry-stejne-nema-cenu-tak-jakapak-nahrada-skody/

https://example.com/clanky/na-dodavateli-pry-nezalezi-hlavni-je-zaplacena-faktura/

https://example.com/clanky/dluhy-pry-maji-zustat-v-rodine/

https://example.com/clanky/vymol-na-silnici-jste-pry-meli-cekat/

https://example.com/clanky/posledne-mel-pry-moc-velke-oci/

https://example.com/clanky/dobrymi-skutky-pry-jeste-nikdo-nezbohatl/

https://example.com/clanky/druhou-jakost-pry-koupil-na-vlastni-nebezpeci/

https://example.com/clanky/s-paseraky-se-pry-nesmlouva/

https://example.com/clanky/ve-statni-sprave-uz-pry-dalsich-kvalitnich-lidi-netreba/

https://example.com/clanky/na-bagr-pry-nemel-sahat-kdyz-s-nim-neumi-zachazet/

https://example.com/clanky/padesat-svedku-si-pry-muze-sehnat-kde-kdo/

https://example.com/clanky/fakturu-za-opravu-at-pry-zaplati-ten-kdo-ho-naboural/

https://example.com/clanky/pri-jizde-mhd-se-pry-netelefonuje/

https://example.com/clanky/seznam-pry-neni-na-seznamu/

https://example.com/clanky/vzdyt-ma-pry-jeste-druhy-vajecnik/

https://example.com/clanky/at-v-tom-pry-nedela-madarsky-gulas/

https://example.com/clanky/pry-do-devitice-vseho-dobreho/

https://example.com/clanky/tezka-noha-se-ridicum-v-zahranici-prodrazi/

https://example.com/clanky/leta-pratelstvi-jsou-pry-vic-nez-mzda/

https://example.com/clanky/par-decibelu-pry-party-nedela/

https://example.com/clanky/par-kapek-pry-neni-na-skodu/

https://example.com/clanky/vadu-herni-konzole-mel-pry-odhalit-pred-rozbalenim/

https://example.com/clanky/dve-poskozena-auta-se-pry-rovnaji-jedno-jako-nove/

https://example.com/clanky/invalida-si-pry-vystaci-s-malem/

https://example.com/clanky/nehodou-se-pry-vuz-zhodnoti/

https://example.com/clanky/pozar-letadla-pry-neni-duvod-ke-zruseni-dovolene/

https://example.com/clanky/sterk-se-pry-proste-jen-tak-vznesl/

https://example.com/clanky/vina-mu-pry-koukala-z-oci/

https://example.com/clanky/vyse-plneni-se-pry-strili-od-boku/

https://example.com/clanky/s-dobre-nalozenym-vozem-by-se-pry-nic-nestalo/

https://example.com/clanky/dieselgate-ii-ridici-kamionu-by-si-podvadeni-s-emisemi-meli-radeji-rozmyslet/

https://example.com/clanky/zmeny-pravni-upravy-registru-vozidel/

https://example.com/clanky/zimni-bunda-pry-na-mraz-nepatri/

https://example.com/clanky/aspon-se-pry-na-motorce-v-zime-otuzi/

https://example.com/clanky/pojistne-podminky-pry-stejne-nikdo-necte/

https://example.com/clanky/hvezdicky-jsou-pry-ciste-orientacni/

https://example.com/clanky/kdo-pry-rekne-a-nemusi-uz-rikat-b/

https://example.com/clanky/poslednicci-se-pry-vlakem-nesvezou/

https://example.com/clanky/polstar-pry-meli-sprchovat-na-sucho/

https://example.com/clanky/zada-vam-kryjeme-i-na-horach/

https://example.com/clanky/jak-spravne-na-reklamace/

https://example.com/clanky/jak-se-branit-neopravnene-exekuci/

https://example.com/clanky/dobrovolny-dar-je-pry-povinnost/

https://example.com/clanky/reklamace-je-pry-silna-kava/

https://example.com/clanky/tezky-uraz-smesne-penize/

https://example.com/clanky/z-nemocnice-rovnou-k-soudu/

https://example.com/clanky/pry-alespon-zkusili-jestli-treba-nezaplati/

https://example.com/clanky/vady-sice-nema-zato-nefunguje/

https://example.com/clanky/kdyby-pry-byval-byl-bedlivejsi/

https://example.com/clanky/cesta-ke-spravedlnosti-muze-byt-dlouha/

https://example.com/clanky/pry-proc-platit-opravu-kdyz-to-bylo-stare/

https://example.com/clanky/pry-mel-byt-rad-ze-dostane-alespon-neco/

https://example.com/clanky/sliby-chyby-cestovni-kancelar-ostrouhala/

https://example.com/clanky/spoluvlastnik-uz-vas-neobejde/

https://example.com/clanky/auto-bez-povinneho-ruceni-radeji-ne/

https://example.com/clanky/pry-za-chybu-muze-pocasi/

https://example.com/clanky/mela-pry-predpokladat-ze-si-znici-auto/

https://example.com/clanky/pokuta-od-elektrarny-byla-doslova-sok/

https://example.com/clanky/na-prirodu-muzeme-byt-kratci-na-pojistovny-ale-ne/

https://example.com/clanky/pry-muze-byt-rada-ze-ji-vyplata-vubec-nekdy-dojde/

https://example.com/clanky/pry-kdyz-ma-dovolenou-tak-ma-cas/

https://example.com/clanky/spravedlive-i-v-tezkych-chvilich/

https://example.com/clanky/mobilni-vek-mobilni-potize/

https://example.com/clanky/stan-s-vlastni-koupelnou/

https://example.com/clanky/prace-je-malo-vem-si-neplacene-volno/

https://example.com/clanky/kolo-bez-duse-auto-bez-kola/

https://example.com/clanky/zadna-nadbytecnost-lakomec-to-je/

https://example.com/clanky/odpovidala-jste-pomalu-takze-nic-nedostanete/

https://example.com/clanky/prisli-jsme-tomu-na-kloub/

https://example.com/clanky/prilis-drahe-zverinove-hody/

https://example.com/clanky/pry-nevidi-zadny-duvod-platit-kdyz-nic-nepodepsal/

https://example.com/clanky/dira-v-silnici-dira-v-rozpoctu-ne/

https://example.com/clanky/stret-vozidla-se-zveri-zakladni-pravidla-a-naroky/

https://example.com/clanky/povinna-vybava-od-1102018-jednoduse-a-prehledne/

https://example.com/clanky/nelegalni-migranti-nocni-mura-nejen-dopravcu/

https://example.com/clanky/bez-placeni-by-to-neslo/

https://example.com/clanky/nemuzu-za-to-ze-mate-hloupe-dite/

https://example.com/clanky/ridic-nakladaku-v-nesnazich/

https://example.com/clanky/tuna-a-pul-nepojizdnych-starosti/

https://example.com/clanky/lezet-neni-od-slova-lhat/

https://example.com/clanky/mel-platit-i-kdyz-nemel-za-co/

https://example.com/clanky/koupe-vozidla-se-stocenym-tachometrem-jak-se-branit/

https://example.com/clanky/stav-bodoveho-konta-z-pohodli-domova/

https://example.com/clanky/pruzkum-petina-cechu-loni-vyuzila-pravnich-sluzeb-tretina-netusi-kolik-stoji/

https://example.com/clanky/povinna-dovolena-bez-penez/

https://example.com/clanky/pry-ten-kocarek-vystavovali-slunecnimu-svitu/

https://example.com/clanky/jazykova-bariera-prolomena/

https://example.com/clanky/zadny-mobil-tam-nebyl-a-ta-castka-taky-nesouhlasi/

https://example.com/clanky/v-pravnim-sporu-se-uz-ocitl-kazdy-treti-cech-muzi-casteji-nez-zeny/

https://example.com/clanky/klickovana-s-pojistovnou/

https://example.com/clanky/pri-reklamaci-si-dobre-vsimei/

https://example.com/clanky/eurolicence-a-europokuta/

https://example.com/clanky/dobry-truhlar-spatny-vymahac/

https://example.com/clanky/kdyz-je-dovolena-spise-za-trest/

https://example.com/clanky/posezeni-na-dlouhe-lokte/

https://example.com/clanky/mimoradna-opatreni-a-rozhodnuti-ke-covid-19/

https://example.com/clanky/mimoradna-opatreni-zavreni-skol/

https://example.com/clanky/mimoradna-opatreni-dopravci/

https://example.com/clanky/sireni-koronaviru-trestny-cin/

https://example.com/clanky/karantena-na-uzemi-cr-co-smime-a-nesmime/

https://example.com/clanky/aktualni-deni-o-koronaviru-a-danova-opatreni-na-podporu-zamestnavatelu/

https://example.com/clanky/zakaz-reexportu-leku-do-zahranici-i-moznost-vedlejsich-vydelku-pro-cleny-bezpecnostnich-slozek/

https://example.com/clanky/vlada-schvalila-zakaz-vychazeni-bez-ochrany-nosu-a-ust/

https://example.com/clanky/pracovnepravni-souvislosti-spojene-s-covid-19/

https://example.com/clanky/ochranna-opatreni-pro-podnikatele-a-pomoc-statu/

https://example.com/clanky/prodlouzeni-omezeni-pohybu-dalsi-kroky-na-podporu-zamestnavatelu-a-dalsi-opatreni/

https://example.com/clanky/koronavirus-a-skolstvi-jak-pandemie-ovlivni-chod-skol-maturity-a-prijimaci-zkousky/

https://example.com/clanky/nova-opatreni-v-nouzovem-stavu/

https://example.com/clanky/epidemie-koronaviru-davky-ulevy-pujcky/

https://example.com/clanky/aktualizace-programu-antivirus-kurzarbeit/

https://example.com/clanky/aktualni-situace-vlada-predlozi-parlamentu-balik-zakonu-na-pomoc-s-koronavirem/

https://example.com/clanky/aktualni-situace-vlada-predlozi-parlamentu-balik-zakonu-na-pomoc-s-koronavirem/

https://example.com/clanky/aktualizace-mimoradnych-opatreni/

https://example.com/clanky/osvc-maji-narok-na-25-tisic-korun/

https://example.com/clanky/aktualne-jak-je-to-v-soucasne-dobe-s-omezenim-volneho-pohybu-a-kdo-ma-vyjimku-na-pouzivani-ochrannych-pomucek/

https://example.com/clanky/vlada-ma-plan-az-do-cervna/

https://example.com/clanky/nejcastejsi-otazky-a-odpovedi-ohledne-kompenzacniho-bonusu-pro-osvc/

https://example.com/clanky/uvolnovani-vladnich-opatreni-a-podminky-noveho-provozu/

https://example.com/clanky/aktualne-dopad-sars-cov-2-na-odvetvi-cestovniho-ruchu/

https://example.com/clanky/nouzovy-stav-bude-v-ceske-republice-trvat-pouze-do-17-kvetna/

https://example.com/clanky/nemci-zprisnuji-pravidla-dopravniho-provozu-ridici-si-za-sve-prohresky-priplati/

https://example.com/clanky/zivnostnikova-nocni-mura/

https://example.com/clanky/kdyz-pojistovna-nechce-platit/

https://example.com/clanky/nejrychlejsi-italske-prazdniny-v-koprivach/

https://example.com/clanky/zatoulane-francouzske-pokuty/

https://example.com/clanky/pokazena-snaha-o-navrat-do-stastneho-detstvi/

https://example.com/clanky/ztraceny-parkovaci-listek/

https://example.com/clanky/dvakrat-zrusene-havarijni-pojisteni/

https://example.com/clanky/kaminek-a-rozbite-celni-sklo/

https://example.com/clanky/dopravni-patalie-na-nemecke-dalnici/

https://example.com/clanky/ve-dvou-se-to-lepe-tahne/

https://example.com/clanky/nekonecny-boj-se-zdravotni-pojistovnou/

https://example.com/clanky/spinavy-trik-vychytraleho-prodejce/

https://example.com/clanky/zkazene-zimni-radovanky/

https://example.com/clanky/nemile-vanocni-prekvapeni/

https://example.com/clanky/necekana-klicka-ve-smlouve/

https://example.com/clanky/ve-sparech-nebankovni-pujcky/

https://example.com/clanky/cesta-do-hlubin-reditelovy-duse/

https://example.com/clanky/pretahovana-s-cestovni-kancelari/

https://example.com/clanky/patalie-ridicu-na-nemeckych-hranicich/

https://example.com/clanky/pekelny-upis-do-energeticke-aukce/

https://example.com/clanky/ve-spatny-cas-na-spatnem-miste/

https://example.com/clanky/trvale-nasledky-urazu-bez-kompenzace/

https://example.com/clanky/stesti-preje-pripravenemu/

https://example.com/clanky/zpropadene-auticko-na-ovladani/

https://example.com/clanky/pretahovana-s-pojistovnou/

https://example.com/clanky/ridke-vlasy-hole-nestesti/

https://example.com/clanky/nestesti-nechodi-po-horach-ale-po-lidech/

https://example.com/clanky/srdecna-omluva-od-pojistovny/

https://example.com/clanky/nestastny-sraz-motorkaru/

https://example.com/clanky/dvakrat-vykradeny-kamion/

https://example.com/clanky/pravni-boj-s-pojistovnou/

https://example.com/clanky/nepovedena-cesta-do-nepalu/

https://example.com/clanky/priplatek-za-zdemolovane-auto/

https://example.com/clanky/na-kazdeho-neplatice-jednou-dojde/

https://example.com/clanky/koukej-tady-je-zelena-karta/

https://example.com/clanky/trikrat-opravovana-televize/

https://example.com/clanky/reditel-versus-starosta/

https://example.com/clanky/pozdni-reklamace-se-stastnym-koncem/

https://example.com/clanky/koupenemu-koni-na-jazyk-nehled/

https://example.com/clanky/cervene-ruze-nosi-smulu/

https://example.com/clanky/nelitostna-madarska-policie/

https://example.com/clanky/podivame-se-tomu-na-zoubek/

https://example.com/clanky/svatba-neni-jen-radost-ale-take-starost/

https://example.com/clanky/zkazeny-vylet-do-delfinaria/

https://example.com/clanky/cisty-vzduch-je-nad-zlato/

https://example.com/clanky/hlavne-co-nejvic-usetrit/

https://example.com/clanky/odtah-za-vsechny-prachy/

https://example.com/clanky/zanovni-tablet-a-vykutaleny-prodejce/

https://example.com/clanky/spory-se-nemusi-proplachtit/

https://example.com/clanky/jak-likvidace-auta-malem-zlikvidovala-sveho-majitele/

https://example.com/clanky/invalidita-bez-naroku-na-kompenzaci/

https://example.com/clanky/nejen-bunda-muze-zahrat/

https://example.com/clanky/oblek-pro-kazdou-prilezitost/

https://example.com/clanky/co-by-to-bylo-za-letni-drink-bez-ledu/

https://example.com/clanky/roztomily-kukuc-nedela-hodneho-psa/

https://example.com/clanky/nepovedene-vanoce-v-dubaji/

https://example.com/clanky/kdyz-vam-zapali-strechu-nad-hlavou/

https://example.com/clanky/neverte-vsemu-co-vam-remeslnici-slibi/

https://example.com/clanky/nepovedena-oprava-notebooku/

https://example.com/clanky/hlucna-palubni-deska-zvyknete-si/

https://example.com/clanky/jak-jsme-zachranili-dovolenou/

https://example.com/clanky/jiny-kraj-jine-dopravni-predpisy/

https://example.com/clanky/das-vysavac-vsech-problemu/

https://example.com/clanky/nespolehlivi-remeslnici/

https://example.com/clanky/kde-je-hranice-spravedlnosti/

https://example.com/clanky/nevydareny-vylet-do-vidne/

https://example.com/clanky/nespravne-podana-reklamace/

https://example.com/clanky/italske-prazdniny-s-polskym-kamionem/

https://example.com/clanky/kazdy-milimetr-se-pocita/

https://example.com/clanky/ponekud-komplikovanejsi-sousede/

https://example.com/clanky/z-obeda-rovnou-k-zubari/

https://example.com/clanky/nebezpecne-liberecke-chodniky/

https://example.com/clanky/s-pedagogy-nejsou-zerty/

https://example.com/clanky/kdyz-si-to-pojistovna-rozmysli/

https://example.com/clanky/partak-ktery-je-s-vami-u-kazdeho-kroku/

https://example.com/clanky/sliby-jsou-od-toho-aby-se-plnily/

https://example.com/clanky/kdyz-se-rekonstrukce-zvrtne/

https://example.com/clanky/muj-syn-omylem-objednal-drahe-predplatne/

https://example.com/clanky/solarni-panely-versus-pamatkari/

https://example.com/clanky/jak-sousedi-chteli-zakazat-pronajem-na-airbnb/

https://example.com/clanky/21-porouchany-spotrebic/

https://example.com/clanky/pojistovna-ktera-pro-udrzeni-klientu-udela-cokoliv/

https://example.com/clanky/co-delat-kdyz-vam-neporadek-na-silnici-poskodi-auto/

https://example.com/clanky/chci-to-co-jsem-si-objednal/

https://example.com/clanky/jeden-preklep-a-penize-jsou-fuc/

https://example.com/clanky/kdyz-vas-dodavatel-ze-dne-na-den-odrizne-od-elektriny/

https://example.com/clanky/kdyz-po-mne-pojistovna-chtela-zpetne-zaplatit-270000-kc/

https://example.com/clanky/milionovy-podvod-v-autobazaru/

https://example.com/clanky/hon-na-pronajem-zahradky/

https://example.com/clanky/srazka-se-stokilovym-jelenem/

https://example.com/clanky/pohledavka-se-13letym-zpozdenim/

https://example.com/clanky/idealni-partnerka-na-klic/

https://example.com/clanky/boj-s-vetrnymi-mlyny-pojistovny/

https://example.com/clanky/asistencni-sluzba-ktera-vam-pri-odtahu-odre-auto/

https://example.com/clanky/dluhy-se-maji-platit-nebo-nemusi/

https://example.com/clanky/vychytrala-pojistovna-mazlicku/

https://example.com/clanky/kdo-by-nemel-rad-firemni-darky/

https://example.com/clanky/dvojnasobne-zklamani-fanynky-justina-biebera/

https://example.com/clanky/kruty-navrat-do-reality/

https://example.com/clanky/na-rozmazane-videni-si-zvyknete/

https://example.com/clanky/pulka-objednavky-hole-nestesti/

https://example.com/clanky/kdyz-vam-pojistovna-sebere-vase-jistoty/

https://example.com/clanky/jak-resit-narok-na-skodu-bez-dukazu/

https://example.com/clanky/ponicena-zasilka-za-17000-kc/

https://example.com/clanky/smejdi-21-stoleti-a-nekale-obchodni-praktiky/

https://example.com/reseni-stiznosti-a-whistleblowing/
