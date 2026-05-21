---
title: Git submodules
tags:
  - GIT
  - Architecture
type: How To
section: Main
---

> A submodule embeds another git repo inside yours at a **pinned commit**. The parent records *which commit* of the child to use — not its contents — so clone/pull don't fetch submodule code unless you ask.

## When to reach for one

Shared code that lives in its own repo and must stay versioned independently — a design system, a vendored library, shared config. If you just want the latest of a package, use the package manager instead: submodules pin a commit, not a version range.

## The commands

```sh
# add a submodule
git submodule add <repo-url> path/to/sub

# clone a project that has submodules (one step)
git clone --recurse-submodules <repo-url>

# already cloned without it? fetch the submodule contents
git submodule update --init --recursive

# pull parent + update submodules to the recorded commits
git pull --recurse-submodules
```

## The gotcha

A submodule checks out a **specific commit**, not a branch — so it sits in [[detached-head|detached HEAD]]. To move it forward: `cd` into the submodule, `git checkout main && git pull`, then commit the new pointer **in the parent repo** (`git add path/to/sub && git commit`). Forgetting that second commit is the #1 "works on my machine" submodule bug.

See [[git|GIT]].
