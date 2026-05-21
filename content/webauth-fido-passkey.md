---
title: WebAuth/FIDO/passkey
tags:
  - Auth
type:
  - Course
---

# WebAuth

Also WebAuthn is a web standard published by W3C and is a core component of the FIDO2 project of the FIDO alliance. The goal of this project is to standardize an interface for the authentication of users using public-key cryptography. Using this type of authentication it is far more harder to impossible to use phishing attacks to get user passwords.

![[webauth-fido-passkey-Untitled.webp]]

WebAuthn has more parts to it, but those following are more important than others:

- client (WebAuthn Client) - a browser that supports the WebAuthn API
- Web application - an application running on a client that uses the WebAuthn API to interact with credentials
- credentials (Public Key Credential) - a pair of public and private cryptographic keys that are associated with the user account
- authenticator (Authenticator) - a device or program - creates user credentials and signs requests from the relying party with these credentials (another name is an electronic key)
- the verifier (WebAuthn Relying Party) — a web server — stores the public key associated with the user account, checks the correctness of signing its requests with the private key stored in the authenticator.

WebAuthn provides phishing protection by using key-pairs. This means that we can not login with same key-pair using multiple devices, as the private key (stored on local device) is not shared between them. And the public key is stored on the server.

Second part of phishing protection is done by storing domain for which the key is supposed to work. We can not use a key on another origin. But because big web applications usually have more sub-domains, we can have shared same suffix. For example we can have email[.google.c](http://email.seznam.cz)om and [calendar.google.com](http://calendar.google.com) which has google.com as common suffix, so we include it in the credentials making

```jsx
const credential = await navigator.credentials.create({
    publicKey: {
        rp: {
            name: 'Google.com Group',
            id: 'google.com',
        },
        ...,
    },
});
```

For password-less authentication to work it must be supported by all 3 parties, that means by

- Server
- Browser
    - Google Chrome 67 or higher
    - Microsoft Edge 85 or higher
    - Safari 14 or higher
- Device
    - An Android device, preferably with a biometric sensor
    - An iPhone or iPad with Touch ID or Face ID on iOS 14 or higher
    - A MacBook Pro or Air with Touch ID on macOS Big Sur or higher
    - Windows 10 19H1 or higher with Windows Hello set up

For more in-depth information on how it works and how to implement it visit [here on medium.com](https://medium.com/webauthnworks/introduction-to-webauthn-api-5fd1fb46c285#16e8).

More sources:

- [https://developers.google.com/codelabs/webauthn-reauth#0](https://developers.google.com/codelabs/webauthn-reauth#0)
- [https://www.loginradius.com/blog/identity/webauth-secures-user-login/](https://www.loginradius.com/blog/identity/webauth-secures-user-login/)
- [https://www.youtube.com/watch?v=8ren54IMSf4&ab_channel=GoogleChromeDevelopers](https://www.youtube.com/watch?v=8ren54IMSf4&ab_channel=GoogleChromeDevelopers)

# FIDO

Fido alliance is a consortium that develops open source protocols for secure authentication. It was established in 2013 and now has over hundred members. FIDO has three protocols, UAF, U2F, and FIDO2.

### FIDO2

Is a new modern protocol which contains core specifications WebAuthn (client) and CTAP (auth API)

Again, for more information go to [medium.com](https://medium.com/webauthnworks/introduction-to-webauthn-api-5fd1fb46c285#16e8)

### Library

[https://simplewebauthn.dev/](https://simplewebauthn.dev/)

# PassKey

Is Apple standard similar to FIDO and WebAuthn. It is essentially the same concept and technology for signing in. Unlike FIDO or WebAuthn it is only available on Apple devices so far, and Google is still developing its Android implementation and said it will be available by the end of 2022 for developer testing.

It is still a relatively new feature so there is not much information about it as of now.

[https://developer.apple.com/passkeys/](https://developer.apple.com/passkeys/)

[https://developer.apple.com/documentation/authenticationservices/public-private_key_authentication/supporting_passkeys](https://developer.apple.com/documentation/authenticationservices/public-private_key_authentication/supporting_passkeys)

[https://www.cnet.com/tech/mobile/its-time-to-learn-about-passkeys-the-no-password-login-tech/](https://www.cnet.com/tech/mobile/its-time-to-learn-about-passkeys-the-no-password-login-tech/)
