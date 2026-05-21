---
title: Safe force push
tags:
  - GIT
  - Configuration
type:
  - How To
---

> 💡 Never `git push --force`. Use `git push --force-with-lease` — it refuses the push if the remote moved since your last `fetch`, so you can't accidentally overwrite a teammate's commit.

## The problem

`--force` replaces the remote branch unconditionally. If a teammate pushed in the meantime, their commit is gone — only their local reflog still has it. No warning, no chance to react.

## What we use

```ini
[alias]
    pf = push --force-with-lease
```

Then just `git pf` instead of `git push --force`. On a shared branch where someone else pushed, it fails — that's the signal to `fetch` and investigate, not to retry with `--force`.

See [[configuration-example|Configuration Example]].

