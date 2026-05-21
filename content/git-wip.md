---
title: WIP commit
tags:
  - GIT
type: How To
section: Main
releaseDate: 2026-06-11
---

>  `git wip` commits everything and force-pushes as a `WIP` commit.

## The alias

```ini
[alias]
    wip = !git add --all && git commit -m WIP --no-verify && git pf
```

## Command by command

- **`git add --all`** — stage every change, including new and deleted files.
- **`git commit -m WIP --no-verify`** — commit as `WIP`, skipping hooks (`--no-verify`) so a slow or strict pre-commit check doesn't get in the way of a quick save.
- **`git pf`** (`push --force-with-lease`) — push, overwriting the previous `WIP` commit. Force-with-lease refuses the push if the remote moved since your last fetch, so it stays safe — see [[force-push-vs-force-with-lease|Safe force push]]. Feel free to change it to `git push`.

## When to use it

Park unfinished work on the remote — as a backup, or to pick it up on another machine. Before turning a `WIP` snapshot into real history, drop the commit but keep the changes with `git cm-undo` (`reset HEAD~`), then commit properly.

See [[configuration-example|Configuration Example]] for the full `.gitconfig`.
