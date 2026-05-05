---
title: Helpful commands
tags:
  - GIT
type:
  - Code / Snippet
---

## Get things out of stash

`git stash pop` : vyndá věci ze stashe a zahodí referenci

`git unstash` : vyndá věci ze stashe a zachová referenci

## Empty folder is not commited.

If you need to commit an empty folder, you must insert an empty file `.gitkeep` into the folder.

## git reset --merge

You made an unwanted `git stash pop` on bad branch and conflicts are popping. The solution is:

`git reset --merge`

Your changes are returned to stash, no more conflicts are displayed.

---

## git stash --keep-index -u

> tl;dr; `stash unstaged changes and untracked files`
> 

**Usecase:** You finished a fix after code review (or you did something forgotten earlier). So you stashed changes and started rebasing... But you notice that changes should be split into two existing commits.

**step-by-step solution**

1. `git rebase -i where-u-want`
mark commits as `edit` and confirm,
2. `git add what-u-need`
(VSCode has a tool that provides `git add` also for specific rows in a file),
3. `git stash --keep-index -u`
stash what you want to have in the next commit (otherwise, you get an error *You must edit all merge conflicts and then mark them as resolved using git add*)
4. `git rebase --continue`
5. On the next commit `git stash pop`
(resolve conflicts if needed) 
6. `git add .` 
7. `rebase --continue` 

Problem solved. :)

---

### Lost/delete branch or forgotten work

If you delete a branch the easiest way to recover the branch is to checkout to `origin/…` but that is possible only if the origin exists or if a work in progress has been pushed. If you did not make it to the push you can use **reflog**. Reflog is a logging system of almost all `git ...` commands.

When you run `git checkout`, `git rebase`, `git merge`, `git branch -d`, etc. will record this as a new entry into a log and you can show this log any time you want by running the command `git reflo --date=human` 

```
59b6e151 HEAD@{Thu Sep 29 14:57}: commit (amend): Stop refetching data on success BE call
23be8ec2 HEAD@{Thu Sep 29 14:57}: commit: Stop refetching data on success BE call
8c7e37bb (HEAD -> dev, synetech-gl/dev, origin/dev) HEAD@{Thu Sep 29 14:56}: checkout: moving from dev to feature/optimistic-updates
8c7e37bb (HEAD -> dev, synetech-gl/dev, origin/dev) HEAD@{Wed Sep 21 15:33}: pull: Fast-forward
0489f718 HEAD@{Wed Sep 21 15:33}: checkout: moving from feature/use-react-suspend-feature to dev
c0108afb (origin/fix/32145-unnecessary-multiple-be-calls, fix/32145-unnecessary-multiple-be-calls, feature/use-react-suspend-feature) HEAD@{Tue Sep 13 08:53}: checkout: moving from fix/32145-unnecessary-multiple-be-calls to feature/use-react-suspend-feature
c0108afb (origin/fix/32145-unnecessary-multiple-be-calls, fix/32145-unnecessary-multiple-be-calls, feature/use-react-suspend-feature) HEAD@{Fri Sep 9 15:06}: rebase (continue) (finish): returning to refs/heads/fix/32145-unnecessary-multiple-be-calls
c0108afb (origin/fix/32145-unnecessary-multiple-be-calls, fix/32145-unnecessary-multiple-be-calls, feature/use-react-suspend-feature) HEAD@{Fri Sep 9 15:06}: rebase (continue): Remove unused useDPSDetail hook
fadf7397 HEAD@{Fri Sep 9 15:05}: rebase (pick): Replace useDPSDetail hook with universal usePensionHook
0489f718 HEAD@{Fri Sep 9 15:05}: rebase (start): checkout dev
374c8dad HEAD@{Fri Sep 9 15:05}: checkout: moving from dev to fix/32145-unnecessary-multiple-be-calls
```

At the start of a line, you can see hash followed by the human readable date and time followed by command followed by the title of commit under the hash. Important for you is the hash (for this case it is 0489f718 from Fri Sep 9 15:05) at the start which you can `git checkou -b MY_DELETED_BRANCH 0489f718` and your work is back in the game.
