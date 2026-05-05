---
title: SSH
tags:
  - Collaboration
  - GIT
type:
  - Tutorial / How To
---

## Klíč

Vygenerování  klíče:

```jsx
ssh-keygen -t rsa -C "your.email@example.com" -b 4096
```

vytvoří adresář:

```jsx
C:\Users\[user_name]\.ssh
```

s privátním (nesdílet!) a veřejným (.pub) klíčem.

---

## Upload do Gitlabu

![ssh-key.png](ssh-key.png)

A teď už by měl fungovat clone/push/etc. přes **ssh**.
