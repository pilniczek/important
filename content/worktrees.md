---
title: Worktrees
tags:
  - GIT
  - Claude
  - AI
type: How To
section: Main
releaseDate: 2026-06-12
---

- When you're in the middle of a work and something interrupts you (production hotfix, code review).
- When you want to try to solve a problem in a different way.
- When you want to keep agents working on a multiple tasks at once.

## What a GIT worktree is

A [git worktree](https://git-scm.com/docs/git-worktree) is a separate working directory that shares the **same `.git` history and remote**, but sits on its own branch to avoid interruptions. ([walkthrough](https://www.youtube.com/watch?v=yv8VZpov8bk)).

A few things to know:

- **One branch, one worktree.** Git refuses to check out the same branch in two worktrees at once, so changes can't accidentally collide. (You can still move branches between worktrees with `git checkout`.)
- **It's a fresh checkout.** No `node_modules` (or venv, etc.) comes along — re-install dependencies and re-init the environment in the new directory, as if you'd just cloned.
- **They stay linked.** Even though the folders sit side by side on disk, git tracks them together — you can `git rebase main` inside a worktree and it works as expected.

## Core git commands

```sh
# create a worktree on a NEW branch, in a sibling folder
git worktree add ../repo-hotfix -b hotfix

# ...or check out an EXISTING branch (omit -b)
git worktree add ../repo-hotfix hotfix

git worktree list          # show every worktree and the branch each holds
git worktree remove ../repo-hotfix   # delete when done (cleans up dir + metadata)
```

> If you delete a worktree folder by hand instead of using `remove`, git still lists it as *prunable*. Run `git worktree prune` to clear the stale metadata ([docs](https://git-scm.com/docs/git-worktree)). Prefer `git worktree remove`, which does both in one step.

## Claude Code's built-in worktrees

Claude Code can manage the whole worktree lifecycle for you ([docs](https://code.claude.com/docs/en/worktrees), [first impressions](https://www.youtube.com/watch?v=oI631eCAQnQ)):

```sh
claude --worktree feature-auth   # or -w; start Claude in an isolated worktree
claude --worktree                # omit the name → auto-named, e.g. bright-running-fox
claude --worktree "#1234"      # branch from a GitHub PR
```

- **Where it lands.** Worktrees are created under `.claude/worktrees/<name>/` on a new branch `worktree-<name>`. Add `.claude/worktrees/` to your `.gitignore` so they don't show up as untracked files.
- **Mid-session.** Ask Claude to "work in a worktree" and it creates one via the `EnterWorktree` tool.
- **Local config.** A fresh checkout lacks your gitignored files (`.env` etc.); list them in a `.worktreeinclude` (gitignore syntax) and Claude copies them into each new worktree.
- **Subagents.** Ask Claude to "use worktrees for your agents", or set `isolation: worktree` in a custom subagent's frontmatter, so parallel subagents don't conflict.
- **Cleanup.** On exit, a clean worktree (no changes, no new commits) is removed automatically. If there are changes, Claude prompts you to keep or remove it. (Non-interactive `-p` runs are **not** auto-cleaned — remove those with `git worktree remove`.)

> If you want the worktree to start from your local, unpushed work, set `worktree.baseRef` to `"head"` in settings.

## Resources

- Git docs — [git worktree](https://git-scm.com/docs/git-worktree)
- Claude Code docs — [Run parallel sessions with worktrees](https://code.claude.com/docs/en/worktrees)
- Video — [You need to use Git Worktrees](https://www.youtube.com/watch?v=yv8VZpov8bk) (plain git)
- Video — [I'm using claude --worktree for everything now](https://www.youtube.com/watch?v=oI631eCAQnQ) (Claude Code)
