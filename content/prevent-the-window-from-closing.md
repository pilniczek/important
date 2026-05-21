---
title: Prevent the window from closing
tags:
  - JS
type:
  - How To
url: "https://stackoverflow.com/questions/33460489/prevent-window-close"
---

```jsx
window.onbeforeunload = function (e) {
  var message = "Your confirmation message goes here.",
  e = e || window.event;

  if (e) {
  e.returnValue = message;
  }

  return message;
};
```
