---
title: GIT Merged - custom script
tags:
  - GIT
type: Tool
section: Main
---

>  `git merged` collects every local branch already merged into the current one, opens the list in an editor for review, and deletes what's left in the file after you close the tab. Usually chained from [[git-sync|`git sync`]].

## The alias

```ini
[alias]
    merged = !sh -c 'git branch --merged | egrep -v \"(^\\*|^\\+|master|main|dev)\" >/tmp/merged-branches && echo \"waiting for git merged confirmation - review the list and close the IDE tab to continue\" && code --wait /tmp/merged-branches 2>/dev/null && xargs git branch -d </tmp/merged-branches'
```

## Command by command

- **`git branch --merged`** — lists local branches whose tip is reachable from `HEAD`, i.e. already merged into the branch you're standing on. Run it from an up-to-date default branch or the answer is stale.
- **`egrep -v "(^\*|^\+|master|main|dev)"` — the filter, and the part that bites.** `git branch` prefixes every line with a marker: `*` for the current branch, `+` for a branch checked out in another worktree, and a space otherwise. Both markers must be excluded. Long-lived branches (`master`, `main`, `dev`) are excluded by name.
- **`code --wait`** — the review step. Delete a line to keep that branch; whatever survives gets deleted. `2>/dev/null` swallows the Electron noise VS Code prints on some platforms.
- **`xargs git branch -d`** — safe delete: `-d` refuses any branch that isn't actually merged, so an editing mistake can't lose work.

## Both markers, or it fails

Dropping `^\+` from the filter looks harmless until a worktree exists. A `+ tpi/123` line reaches `xargs`, which splits it on whitespace into two arguments:

```
error: branch '+' not found
error: cannot delete branch 'tpi/123' used by worktree at 'C:/…/.claude/worktrees/tpi+123'
```

Git can't delete a branch that another worktree has checked out, so the branch was never a deletion candidate to begin with — the `+` marker is exactly how it says so.

## Walkthrough

![[git-merged-custom-script-0_before.webp]]

![[git-merged-custom-script-1_fetch_prune.webp]]

![[git-merged-custom-script-2_merged_branches.webp]]

![[git-merged-custom-script-3_cleaned.webp]]
