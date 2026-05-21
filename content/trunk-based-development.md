---
title: Trunk Based Development
tags:
  - GIT
  - Collaboration
type: Approach
section: Main
releaseDate: 2026-05-30
url: https://trunkbaseddevelopment.com/
---

Everyone commits to a single shared branch — the **trunk** (`master` / `main`).
Work happens on **short-lived** branches that live hours-to-a-day and merge back
fast, so the trunk is always releasable and big, painful merges never build up.

## The core idea

- **One trunk, always green.** The trunk stays deployable at all times.
- **Small, frequent merges.** A branch per change (`<initials>/<short-name>`),
  merged via PR after a rebase — see [[strategy|Strategy]] and [[git|GIT]].
  The longer a branch lives, the worse the merge.
- **Hide unfinished work behind feature flags**, not behind long-lived branches.
  Incomplete code can ship to trunk dark (flag off) and be switched on later —
  this is what lets the trunk stay releasable while features are still in progress.

## Hotfix flow

A production bug needs the fix in the live release _and_ in the trunk.

1. Branch off the released tag/commit: `git checkout -b hotfix/<bug> <release-tag>`.
2. Make the minimal fix, open a PR, ship the patch release (`v1.2.1`).
3. **Get the same fix onto the trunk** so the next release doesn't reintroduce it.
   In a strict trunk model you usually **fix on trunk first**, then cherry-pick
   onto the release branch: `git cherry-pick <sha>` — that way trunk is never
   missing the fix.

## Reverting a feature

- **Already merged to trunk → `git revert`.** It creates a new commit that undoes
  the change, keeping history intact (don't rewrite shared trunk history). Revert a
  merge with `git revert -m 1 <merge-sha>`.
- **Shipped behind a flag → just turn the flag off.** No code change, no deploy
  drama — the cleanest "revert" and the main reason flags beat long branches.
- **Not yet merged → drop the branch.** Nothing on trunk to undo.

> ⚠️ Don't `reset --hard` / force-push the trunk to "remove" a feature — it
> rewrites history everyone shares. Use `revert`. See
> [[force-push-vs-force-with-lease|Safe force push]] for why.
