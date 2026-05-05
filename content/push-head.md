---
title: Push current branch by default
tags:
  - GIT
  - Configuration
type:
  - How To
---

> 💡 `git push` alone always pushes the current branch to its tracked remote counterpart — even on the very first push. No `-u`, no typing the branch name.

## The problem

Default git on a brand-new branch:

```text
$ git push
fatal: The current branch fix/login has no upstream branch.
    use git push --set-upstream origin fix/login
```

Friction every time you start a branch.

## What the settings do

```ini
[remote "origin"]
    push = HEAD
```

Now `git push` pushes HEAD to a remote branch of the same name, creating it on first push. Pairs with `push.default = current` from the same template.

See [[configuration-example|Configuration Example]].

## When this isn't enough

If you work with multiple remotes (e.g. `origin` + `upstream` fork), repeat the refspec on each remote you push to. Docs: <https://git-scm.com/docs/git-config#Documentation/git-config.txt-remoteltnamegtpush>
