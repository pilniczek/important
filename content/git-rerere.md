---
title: Remember conflict resolutions
tags:
  - GIT
  - Configuration
type:
  - How To
---

> 💡 Resolve a merge conflict once; git replays the same resolution next time the identical conflict appears. Saves repeating yourself on long rebases and cherry-picks across branches.

## The problem

Rebasing the same long-lived branch on `master` repeatedly means resolving the **same** conflict over and over. Same for cherry-picking a fix across release branches.

## What the settings do

```ini
[rerere]
    enabled = true
```

`rerere` = **reuse recorded resolution**. Git stores the conflict + your fix in `.git/rr-cache/` and auto-applies it when the same conflict reappears. You still `git add` to confirm.

See [[configuration-example|Configuration Example]].
