---
title: Sync the default branch
tags:
  - GIT
type: How To
section: Main
releaseDate: 2026-06-11
---

>  `git sync` — **main checkout only, clean tree only** — switches to the default branch (`main`, else `master`), pulls, prunes, and finally cleans up merged branches via [[git-merged-custom-script|`git merged`]]. In a linked worktree it refuses to run; with work in progress it does nothing.

## The alias

```ini
[alias]
    sync = "!sh -c 'if [ \"$(git rev-parse --git-dir)\" != \"$(git rev-parse --git-common-dir)\" ]; then echo \"git sync: refusing to run inside a linked worktree - run it in the main checkout\" >&2; exit 1; fi; if [ -n \"$(git status --porcelain)\" ]; then echo \"WIP - skipping branch update\"; elif git show-ref -q --verify refs/remotes/origin/main; then git checkout main && git pull && git fp && git worktree prune && git merged; elif git show-ref -q --verify refs/remotes/origin/master; then git checkout master && git pull && git fp && git worktree prune && git merged; else echo \"no main/master - nothing to update\"; fi'"
```

## Command by command

- **`git rev-parse --git-dir` vs `--git-common-dir`** — the two differ only in a linked worktree, so this is the worktree guard. It's a separate `if … exit 1`, not part of the `elif` chain, because it's a precondition rather than a branch of the logic — see [[#Main checkout only]].
- **`git status --porcelain`** — empty output means a clean tree. Untracked files (`??`) count as dirt, so any work in progress blocks the update and prints `WIP - skipping branch update`.
- **`git show-ref -q --verify refs/remotes/origin/main`** — tests whether the branch exists *without* checking it out, so the real `git checkout` below stays verbose (`Switched to branch 'main'`, `Your branch is up to date`).
- **`main` preferred, `master` fallback** — when both exist it's usually a `master` → `main` migration, so `main` is the live branch. If neither `origin/main` nor `origin/master` exists, it prints `no main/master - nothing to update` and stops.
- **`git checkout <branch> && git pull && git fp`** — switch, pull (honours `[pull] rebase = true` and fast-forwards on a clean branch), then `git fp` (`fetch --prune`) drops remote-tracking refs for deleted branches.
- **`git worktree prune`** — drops registrations for worktree directories that no longer exist. Runs before `git merged` so branches from removed worktrees lose their `+` marker and become deletion candidates in the same pass.
- **`git merged`** — runs only after a successful update, so the merged-branch cleanup is measured against an up-to-date default branch. It opens the candidate list in an editor for review before deleting — see [[git-merged-custom-script|Clean up merged branches]].
- **Wrap the whole value in double quotes.** Git treats `;` and `#` as comment starters anywhere on a config line *unless the value is inside git-config double quotes* — so without the outer `"…"` the alias is silently truncated at the first `;`, leaving an unterminated `'` (`sh: Syntax error: Unterminated quoted string`). Inner double-quotes are then escaped as `\"`.

## Main checkout only

A linked worktree exists to hold one branch checked out at a fixed path. `git sync` would check out the default branch there, and the branch you were working on becomes reachable from nowhere in that directory — the worktree's whole reason to exist is gone. So this isn't a "nothing to do here" case; it's a wrong place to invoke the command, and the alias treats it as an error:

```console
$ git sync
git sync: refusing to run inside a linked worktree - run it in the main checkout
$ echo $?
1
```

Two consequences of using `exit 1` rather than a quiet skip:

- **Message goes to stderr**, so it stays visible when the alias is chained (`git sync && …`) and the chain stops instead of continuing on stale assumptions.
- **The autorun terminal shows it.** [[vscode-autorun-claude-on-open|Autorun on window open]] fires `git sync` in every window, worktree windows included, so those windows now report the refusal on startup. That's the intent: it names where the command belongs rather than looking like a successful no-op.

The [[#Why clean-tree only|WIP guard]] below stays a quiet skip — dirty tree is a normal, expected state in the right directory.

## Why clean-tree only

It's built to run unattended — e.g. on editor startup — so it must never disturb work in progress. The `--porcelain` check is the guard, and it exits 0: there's nothing wrong with having uncommitted work, so it's a skip, not a failure. (The chained `git merged` is the one interactive step: it opens an editor with the deletion candidates, but only when a clean-tree sync actually ran.)

See [[configuration-example|Configuration Example]] for the full `.gitconfig`.
