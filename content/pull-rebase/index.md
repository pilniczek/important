---
title: Pull without merge commits
tags:
  - GIT
type:
  - Snippet
---

> 💡 Makes `git pull` rebase your local commits on top of upstream instead of creating a useless merge commit.

## The problem

Default `git pull` = `fetch` + `merge`. If you have local commits *and* upstream moved, every pull produces a junk merge commit like `Merge branch 'master' of origin into master`. History turns into a knot.

## What the settings do

```ini
[pull]
    rebase = true
```

Now `git pull` = `fetch` + `rebase`. Your local commits are replayed on top of the new upstream tip. Linear history, no junk merges. Matches the team's [Strategy](../strategy/index.md).

See [Configuration Example](../configuration-example/index.md).
