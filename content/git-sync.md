---
title: Sync the default branch
tags:
  - GIT
type: How To
section: Main
releaseDate: 2026-06-11
---

>  `git sync` — **only when the working tree is clean** — switches to the default branch (`main`, else `master`), pulls, prunes, and finally cleans up merged branches via [[git-merged-custom-script|`git merged`]]. With work in progress it does nothing.

## The alias

```ini
[alias]
    sync = "!sh -c 'if [ -n \"$(git status --porcelain)\" ]; then echo \"WIP - skipping branch update\"; elif git show-ref -q --verify refs/remotes/origin/main; then git checkout main && git pull && git fp && git merged; elif git show-ref -q --verify refs/remotes/origin/master; then git checkout master && git pull && git fp && git merged; else echo \"no main/master - nothing to update\"; fi'"
```

## Command by command

- **`git status --porcelain`** — empty output means a clean tree. Untracked files (`??`) count as dirt, so any work in progress blocks the update and prints `WIP - skipping branch update`.
- **`git show-ref -q --verify refs/remotes/origin/main`** — tests whether the branch exists *without* checking it out, so the real `git checkout` below stays verbose (`Switched to branch 'main'`, `Your branch is up to date`).
- **`main` preferred, `master` fallback** — when both exist it's usually a `master` → `main` migration, so `main` is the live branch. If neither `origin/main` nor `origin/master` exists, it prints `no main/master - nothing to update` and stops.
- **`git checkout <branch> && git pull && git fp`** — switch, pull (honours `[pull] rebase = true` and fast-forwards on a clean branch), then `git fp` (`fetch --prune`) drops remote-tracking refs for deleted branches.
- **`git merged`** — runs only after a successful update, so the merged-branch cleanup is measured against an up-to-date default branch. It opens the candidate list in an editor for review before deleting — see [[git-merged-custom-script|Clean up merged branches]].
- **Wrap the whole value in double quotes.** Git treats `;` and `#` as comment starters anywhere on a config line *unless the value is inside git-config double quotes* — so without the outer `"…"` the alias is silently truncated at the first `;`, leaving an unterminated `'` (`sh: Syntax error: Unterminated quoted string`). Inner double-quotes are then escaped as `\"`.

## Why clean-tree only

It's built to run unattended — e.g. on editor startup — so it must never disturb work in progress. The `--porcelain` check is the guard. (The chained `git merged` is the one interactive step: it opens an editor with the deletion candidates, but only when a clean-tree sync actually ran.)

See [[configuration-example|Configuration Example]] for the full `.gitconfig`.
