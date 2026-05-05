---
title: Codereview Template
tags:
  - GitLab
url: "https://roadmap.sh/code-review-best-practices"
---

```jsx
## ✅ Základní kontrola

### Feature

- [ ] Kód jsem otestoval lokálně
- [ ] Prošel jsem si commity v DevOps a je pushnuto to, co si myslím, že má být pushnuto
- [ ] Aktualizoval jsem dokumentaci, pokud je potřeba
- [ ] Necommitnul jsem citlivá data / klíče
- [ ] Branch name odpovídá vzoru (release/vX.Y.Z, feature/perosnal-identifier/task-id/description)
- [ ] Target branch má nastavené policies, aby se spustily automatické kontroly (jFrog, Sonar Qube)

### Release & Hotfix

- [ ] Změnil jsem verzi v package.json
- [ ] Aktualizoval jsem changelog
- [ ] Po otestování a schválení QA jsem na poslední commit dal TAG

## 📝 Popis změny

Popiš, co tento pull request řeší a proč je potřeba.

## 📸 Screenshoty

```
