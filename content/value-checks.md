---
title: Value checks
tags:
  - JS
type:
  - How To
---

```jsx
const value1 = false;
const value2 = 0;
const value3 = "";
const value4 = NaN;

console.log(!!value1); // false
console.log(value1 != null); // true

console.log(!!value2); // false
console.log(value2 != null); // true

console.log(!!value3); // false
console.log(value3 != null); // true

console.log(!!value4); // false
console.log(value4 != null); // true
```
