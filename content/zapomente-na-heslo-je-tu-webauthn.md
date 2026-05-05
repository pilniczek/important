---
title: "Zapomeňte na heslo, je tu WebAuthn!"
tags:
  - Auth
type:
  - Course
---

V dnešní době se čím dál více rozšiřují phishing útoky. Každý určitě dostal od banky upozornění, aby si dával pozor na podvodné emaily a klamné stránky, které od nich budou chtít přístupové údaje.

## Co nebo kdo je FIDO?

FIDO, celým názvem Fido alliance, je uskupení několika společností podporujících WebAuthn a jiné protokoly.

Fido má nejnovější protokol FIDO2, který je podporovaný řadou prohlížečů a různých autentizačních platforem.

### Jak WebAuthn funguje

Hesla se přesto ještě úplně nezbavíme. Základem je mít standardní uživatelský účet s heslem, který spárujeme s autentikátorem, třeba otiskem prstu, FaceID, atp.

Poté, co se uživatel přihlásí jménem a heslem, snažíme se ho různými způsoby namotivovat k přidání druhé možnosti přihlášení třeba otiskem prstu a to třeba v nastavení profilu nebo informací na domovské stránce. Uživatel, který se tak rozhodne, bude vyzván k vybrání autentikátoru, což pro zopakování může být otisk prstu, FaceID, USB klíčenka a další. Autentikátor vytvoří zabezpečený pár veřejného a soukromého klíče, koncept ověřený několika desetiletími praxe. Pouze veřejný klíč se zaregistruje na serveru. Od té doby si při přihlašování může vybrat zda použije heslo nebo otisk prstu a věřím, že každý raději využije rychlé přiložení prstu, než-li opisování hesla. Chcete-li se do problematiky ponořit hlouběji, neváhejte pokračovat ve čtení.

Co dělá z FIDO2 protokolu něco, co je více imuní vůči phishing útokům a útokům odposloucháváním, je to, že se neposílají žádná hesla mezi serverem a klientem, tudíž není co poslouchat. Navíc pokud dojdeme na špatnou doménu a doména nám pošle dotaz na získání přístupu, tak se ani nenabídne možnost se přihlásit, jelikož je doména uložena při ukládání naší privátní části klíče a kontroluje se při dotazu.

Další důležitý faktor, který chrání náš přihlašovací klíč, je to, že se náš privátní klíč neposílá přes internet, ale pouze se splňuje úkol (challange), který nám poslal server a náš autentikátor ho ověří a potvrdí. Serveru se tak pošle hotový úkol a ověření od autentikátoru, že jsme to opravdu my.

Výhodou zároveň je, že tento způsob zároveň funguje jakožto dvoufázové ověřování. Protože dokazujeme, že jsme to my a zároveň že máme nějaké zařízení, které vlastníme, ať již to je mobil, na který známe heslo nebo USB ověřovač.

## Co přesně je WebAuthn?

WebAuthn je nový standard pro autentizaci uživatele. Je vydán organizací W3C, která ho spravuje a má k němu oficiální [dokumentaci](https://www.w3.org/TR/2019/REC-webauthn-1-20190304/). Navíc je součástí FIDO2 specifikace, která umožňuje přihlašování bez použití hesla.

Umožňuje uživatelům přihlásit se pomocí autentikátorů třetích stran. Mezi tyto autentikátory patří například biometrický senzor na Androidu, TouchID nebo FaceID na iOS, Windows Hello nebo třeba i USB klíčenky.

Podpora WebAuthn je rozšířená ve všech Chromium based prohlížečích ale i Firefoxu a Safari [https://caniuse.com/webauthn](https://caniuse.com/webauthn).

WebAuthn je vlastně jenom rozšíření již existující technologie pro ukládání hesel. Tato technologie ukládá přihlašovací údaje do prohlížeče. Každý jsme se s ní již určitě setkali, je to vyskakovací okénko, které se nás ptá zda chceme uložit heslo.

![[zapomente-na-heslo-je-tu-webauthn-Untitled.webp]]

### Registrace otisku prstu

Vytvoření hesla po přihlášení má vícero kroků, pojďme si je projít.

1. Server pošle 3 věci
    1. challange
    2. informace uživateli
    3. informace o své straně (doména atd.)
    
    1.5 - Provede se zpracování na straně klienta / prohlížeče
    
2. Do autentikátoru přijde dotaz s informacemi
    1. ID strany, která chce informace
    2. infomace uživateli
    3. informace o straně serveru
    4. clientDataHash - hash vygenerovaný prohlížečem na základě dat od serveru
3. Autentikátor ověří uživatele
    1. ověří uživatele
    2. vytvoří nový klíčový pár
    3. vytvoří svědectví - to znamená, že garantuje správnost uživatele
4. Autentikátor pošle prohlížeči
    1. veřejný klíč
    2. id přihlašovacích údajů
    3. svědectví
5. Prohlížeč zpracuje tyto informace a pošle je zakódované zpátky na server
6. Server si vše zvaliduje a když něco nesedí, tak ví, že se buď něco nepovedlo nebo že se někdo snaží útočit

![[zapomente-na-heslo-je-tu-webauthn-Untitled-1.webp]]

Zdrojem obrázku je oficiální flow z [w3.org](https://www.w3.org/TR/2019/REC-webauthn-1-20190304/images/webauthn-registration-flow-01.svg).

### Přihlášení otiskem prstu

Pokud se chceme přihlásit, tak je způsob velice podobný, ale je posíláno méně informací, protože klient již nějaké informace má a nepotřebuje je znova.

1. Server pošle challange
    
    1.5 - Provede se zpracování na straně klienta / prohlížeče
    
2. Do autentikátoru přijde dotaz s informacemi
    1. ID strany která chce informace
    2. clientDataHash - hash vygenerovaný porhlížečem na základě dat od serveru
3. Autentikátor oveří uživatele
    1. ověří uživatele
    2. vytvoří svědectví - to znamená, že garantuje správnost uživatele
4. Autentikátor pošle prohlížeči
    1. objekt s daty o autentikatoru
    2. podpis
5. Prohlížeč zpracuje informace o klientu a pošle je zakódované na server spolu s daty o autentikatoru a podpisem
6. Server si vše zvaliduje a když něco nesedí, tak ví, že se buď něco nepovedlo nebo že se někdo snaží útočit

![[zapomente-na-heslo-je-tu-webauthn-Untitled-2.webp]]

Zdrojem obrázku je oficiální flow z [w3.org](https://www.w3.org/TR/2019/REC-webauthn-1-20190304/images/webauthn-authentication-flow-01.svg).

Obě flows je jednoduché naimplementovat pomocí knihovny [https://simplewebauthn.dev/](https://simplewebauthn.dev/).

## Závěr

Technologie pro přihlašování bez hesla je obecně dobrá a je dobré ji viděť dostupnou pro širší veřejnost. To, že si člověk nebude muset pamatovat tolik hesel, je prospěšné, ale má to svoje úskalí pro vývojáře. Především pochopení nové technologie, což znamená, že to potrvá nějakou dobu, než uvidíme tento způsob přihlašování jako běžnou praxi.

Používání kryptografické bezpečnosti je značný pokrok, který ztěžuje možnosti útoku. To však neznamená, že to je neprůstřelná technologie a nenajdou se způsoby, jak ji obejít. A čím širší bude její rozšíření, tím častěji se budou útočníci ji snažit prolomit.

To, že se tato technologie standardizuje, je velice dobrá věc. Díky tomu se totiž dost možná omezí phishingové útoky nebo útoky využívající k přihlášení hesla uniklá z jiných stránek, což je problémem především pro uživatele, kteří mají na několik služeb stejné heslo.

Lidé na tuto technologii nejsou zvyklí, ale to se bude časem měnit a je jenom na vývojářích, jak rychle ji budou implementovat. Takže standardní způsob přihlášení pomocí hesla zda ještě nějakou dobu bude.
