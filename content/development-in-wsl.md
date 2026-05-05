---
title: Development in WSL
tags:
  - WSL
type:
  - How To
---

## configure port forwarding

1. Create a file 「**.wslconfig**」 in 「**C:\Users\<UserName>\**」, the content is as the below,

```
[wsl2]

localhostforwarding=true
```

2. Type 「**Win**」+ 「**R**」，and then Enter 「**cmd**」。

3. Type the command as the below,

```
wsl --shutdown
```

4. **Wait 10 seconds** before starting WSL.

- [*resource*](https://medium.com/@Dylan.Wang/how-to-port-forwarding-from-windows-host-to-wsl2-6889a5a3631c)

## develop

```jsx
./node_modules/.bin/gatsby develop --host=0.0.0.0
```

result like

![[development-in-wsl-Untitled.webp]]
