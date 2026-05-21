---
title: GIT Merged - custom script
tags:
  - GIT
type: How To
section: Main
releaseDate: 2026-06-12
---

>  `git merged` lists the local branches already merged, lets you review the list in an editor, then bulk-deletes them - handy cleanup after a batch of merged PRs.

## The alias

```ini
[alias]
    merged = !sh -c 'git branch --merged | egrep -v \"(^\\*|master|main|dev)\" >/tmp/merged-branches && echo \"waiting for git merged confirmation - review the list and close the IDE tab to continue\" && code --wait /tmp/merged-branches 2>/dev/null && xargs git branch -d </tmp/merged-branches'
```

## Command by command

- **`git branch --merged`** - list local branches whose tip is already merged into the current `HEAD`.
- **`egrep -v "(^\*|master|main|dev)"`** - drop the current branch (`*`) and the protected `master` / `main` / `dev` from the list.
- **`>/tmp/merged-branches`** - write the survivors to a temp file.
- **`echo "waiting for git merged confirmation …"`** - print a heads-up before the next step blocks. Without it the terminal looks frozen while VSCode waits. It only fires when there's actually a branch to review - `egrep -v` exits non-zero on an empty list, short-circuiting the chain.
- **`code --wait /tmp/merged-branches`** - open the list in VSCode and wait. Delete any line you want to keep - this is the safety gate before anything is removed.
- **`2>/dev/null`** throws away harmless warnings.
- **`xargs git branch -d </tmp/merged-branches`** - delete each remaining branch with `-d` (safe delete; Git refuses a branch that isn't fully merged).

> The [[git-sync|`git sync`]] now chains `git merged` automatically once the branch is updated.

## What a run looks like

![[git-merged-custom-script-0_before.webp]]

![[git-merged-custom-script-1_fetch_prune.webp]]

![[git-merged-custom-script-2_merged_branches.webp]]

![[git-merged-custom-script-3_cleaned.webp]]
