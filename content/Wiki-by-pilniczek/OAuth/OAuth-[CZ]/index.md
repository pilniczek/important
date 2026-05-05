---
title: OAuth [CZ]
---

### OAuth: **otevřený autorizační protokol poskytující třetí straně omezený přístup k chráněným uživatelským datům bez nutnosti poskytnout této třetí straně přihlašovací údaje uživatele.**

V roce 2010 se objevil protokol OAuth 2.0, jehož poslední verze byla publikována v říjnu 2012.

OAuth 2.0 je autorizační protokol umožňující aplikaci získat přístup k datům uživatele ze služby třetí strany. Díky tomuto protokolu nemusíte svěřit přihlašovací údaje uživatele této aplikaci. Další výhodou je, že můžete omezit přístupová práva.

Jak funguje OAuth 2.0:

OAuth 2.0 je založen na základních webových technologiích: HTTP requestech, redirectech, atd. Proto je jeho použití možné na všech platformách s přístupem k internetu a prohlížeči (webové stránky, mobilní i desktopové aplikace, pluginy prohlížeče…).

Rozdíly mezi OAuth a OAuth 2.0:

**Jednoduchost**

Nová verze nemá masivní podpisová schémata, počet requestů potřebných k autorizaci byl zredukován.

Obecné scháma, jak funguje aplikace s OAuth:
- získání authorizace
- přístup k chráněným datům

Výsledkem autorizace je získání access tokenu - přístupového klíče (obvykle sada znaků), který umožní přístup k chráněným datům. Klasicky k nim přistupujeme přes HTTPS…

The result of authorization is an access token - a certain key (usually just a set of characters), providing of which is a pass to protected resources. In the simplest case, they are accessed via HTTPS, indicated in the headers or as one of the parameters of the received access token.

Existují různé autorizační metody/flow.

## **Authorization Code Flow**

V případě server-side aplikace mohu vyměnit autorizační logiku za práci s autorizačním tokenem a samotnou autorizaci nechat na třetí straně.

## **Authorization Code Flow s Proof Key for Code Exchange (PKCE)**

Během autentikace mohou aplikace využít Authorization Code Flow a k tomu vyžadovat dodatečnou vrstvu zabezpečení. Tou je Proof Key for Code Exchange (PKCE).

## **Implicit Flow s formulářovým Postem**

Jako alternativu ke Code Flow OAuth 2.0 poskytuje Implicit Flow, která je určena pro veřejné klienty nebo aplikace, které nejsou schopny přihlašovací údaje zabezpečit. Aplikace tak potřebuje k autentikaci jen token ID.

Tato metoda **není** best practice.

## **Hybrid Flow**

Aplikace schopné zabezpečit přihlašovací údaje mohou využít Hybrid Flow, která kombinuje Authorization Code Flow a Implicit Flow s formulářovým postem. Aplikace má přístup k ID tokenu a přístup k access a refresh tokenu. To může být užitečné v situacích, kdy vaše aplikace potřebuje okamžitě získat přístup k informacím o uživateli, ale získání přístupu k chráněným datům má dojít až později.

## **Client Credentials Flow**

S aplikacemi typu machine-to-machine (M2M), např. CLI, daemoni nebo back-end služby, ověřujete a autorizuje aplikaci spíše než uživatele. V tomto případě nedávají typické metody ověřování (jako je uživatelské jméno a heslo) smysl. Místo toho M2M aplikace používají Client Credentials Flow (definovaný v OAuth 2.0 RFC 6749, část 4.4).

## **Device Authorization Flow**

Zařízení s omezeným uživatelským vstupem (např. nemá klávesnici) neověřuje uživatele přímo. Místo toho požádá uživatele, aby přešel na odkaz na svém počítači nebo smartphonu a autorizoval zařízení. Tím se vyhne potížím na zařízeních bez možnosti jednoduchého zadání textu. Aplikace k tomu používají Device Authorization Flow (od OAuth 2.0).

## **Resource Owner Password Flow**

Ačkoli to nelze doporučit, vysoce důvěryhodné aplikace mohou používatResource Owner Password Flow, které vyžaduje, aby uživatelé poskytli přihlašovací údaje (uživatelské jméno a heslo). Resource Owner Password Flow by se měl používat pouze když nelze použít flow založené na přesměrování (jako [**Authorization Code Flow**](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow)).

**Rozdíl mezi OAuth a OpenID**

OAuth je **autorizační** protokol, který umožňuje udělovat práva k použití například API služby. Práva jsou definována tokenem (jedinečným identifikátorem). Token může být pro různé uživatele stejný. Případně může mít jeden uživatel k dispozici různé tokeny.

OpenID je **autentizační** nástroj využívající tento systém. Můžete si tak ověřit, že uživatel je přesně ten, za koho se vydává. Jaké akce může uživatel autentizovaný pomocí OpenID provádět, určuje strana provádějící autentizaci.

PKCE FLOW příklad: [https://www.oauth.com/oauth2-servers/server-side-apps/example-flow/](https://www.oauth.com/oauth2-servers/server-side-apps/example-flow/)

Flows: [https://auth0.com/docs/get-started/authentication-and-authorization-flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow)

Kterou OAuth 2.0 Metodu si mám vybrat? ****[https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use#i-have-an-application-that-needs-to-talk-to-different-resource-servers](https://auth0.com/docs/get-started/authentication-and-authorization-flow/which-oauth-2-0-flow-should-i-use#i-have-an-application-that-needs-to-talk-to-different-resource-servers)

---

# FIREBASE **Autentikace**

**Firebase může poskytnout backendovou část pro vaši aplikaci (úložiště dat, ověřování uživatelů, statické hostování atd.).**

## **Funkce**

- Real-time databáze – Firebase spravuje JSONy a všichni připojení uživatelé dostávají aktualizace při každé změně v reálném čase.
- Autentikace – Můžeme použít anonym, heslo nebo jiné „sociální“ ověření.
- Hosting – Aplikace lze nasadit přes zabezpečené připojení na servery Firebase.

## Výhody

- Je jednoduchý a uživatelsky přívětivý. Není potřeba složitá konfigurace.
- Data v reálném čase, což znamená, že každá změna automaticky aktualizuje připojené klienty.
- Jednoduchý ovládací panel.

## Limity

Bezplatný tarif Firebase je omezen na 50 připojení a 100 MB úložiště.

### Step-by-step nastavení

1. Vytvořit účet.
2. Přes “get started “ [zde](https://firebase.google.com/) dojít k “add project“
3. “Google Analytics” - pokud jsou potřeba
4. Vyberte ověřovací flow/metodu, kterou chcete použít.

### Example (login and password ):

```
const email = "myemail@email.com";
const password = "mypassword";

firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
   console.log(error.code);
   console.log(error.message);
});
```

Můžeme zkontrolovat Firebase Dashboard a zjistit, jestli je uživatel vytvořen.

![Untitled](../Untitled.jpeg)

## Přihlášení

Proces přihlášení je v podstatě stejný. Používáme  `signInWithEmailAndPassword(email, password)`.

```
const email = "myemail@email.com";
const password = "mypassword";

firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
   console.log(error.code);
   console.log(error.message);
});
```

## Odhlášení

A nakonec se můžeme odhlásit pomocí `signOut()` metodou. 

```
firebase.auth().signOut().then(function() {
   console.log("Logged out!")
}, function(error) {
   console.log(error.code);
   console.log(error.message);
});
```

### **Firebase – Google Authentication**

![Untitled](../Untitled.png)

HTML příklad:

```
<button onclick = "googleSignin()">Google Signin</button>
<button onclick = "googleSignout()">Google Signout</button>
```

Vytvoříme funkce přihlášení a odhlášení.

Použijeme  `signInWithPopup()` a `signOut()` metody.

```
const provider = new firebase.auth.GoogleAuthProvider();

function googleSignin() {
   firebase.auth()

   .signInWithPopup(provider).then(function(result) {
      const token = result.credential.accessToken;
      const user = result.user;

      console.log(token)
      console.log(user)
   }).catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.log(error.code)
      console.log(error.message)
   });
}

function googleSignout() {
   firebase.auth().signOut()

   .then(function() {
      console.log('Signout Succesfull')
   }, function(error) {
      console.log('Signout Failed')
   });
}
```

### Firebase - Anonymní autentizace

Můžeme použít `signInAnonymously()` jako příklad.

```
firebase.auth().signInAnonymously()
.then(function() {
   console.log('Logged in as Anonymous!')

   }).catch(function(error) {
   const errorCode = error.code;
   const errorMessage = error.message;
   console.log(errorCode);
   console.log(errorMessage);
});
```

Firebase **Authentication** Video Tutorial 

[https://www.youtube.com/watch?v=PKwu15ldZ7k&t=2939s&ab_channel=WebDevSimplified](https://www.youtube.com/watch?v=PKwu15ldZ7k&t=2939s&ab_channel=WebDevSimplified) 

Firebase **Authentication Docs**

[https://firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)

[https://firebase.google.com/docs/auth/web/start](https://firebase.google.com/docs/auth/web/start)

Project with Firebase Authentication 

[https://github.com/LitaHavr/Auth-Firebase](https://github.com/LitaHavr/Auth-Firebase)
