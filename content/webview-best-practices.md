---
title: WebView best practices
tags:
  - WebView
type:
  - How To
  - Archived
---

## The Big One:

> 💡 Do the authorization/login process in the wrapper, not on the web.

---

## Communication web-wrapper

You need to communicate with iOS and AND wrapper. Each platform has its way how to achieve it.

Both ways use `window` or `document` as “communication channel”.

---

You can see an example of how to call a function provided by native wrapper.

iOS Example

`window.webkit.messageHandlers.openInNativeBrowser.postMessage(*value*);`

AND Example

`window.Android.openLink(*value*);`

---

You can use it as an environmental check:

`export *const* isAndroid = (*w*: *any*): *boolean* *=>* *w*.Android !== undefined;`

---

## Error handling

Webview can not handle all errors - for example, the wrapper handles a missing internet connection.
