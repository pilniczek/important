---
title: GIT
type:
  - Tool
tags:
  - GIT
  - Basics
---

**docs:** [https://git-scm.com/doc](https://git-scm.com/doc)

> 💡 [https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1)

---

## First steps

### Basic understanding

People are familiar only with simple basics - “one man on master” development.

`git clone`

`git pull`

`git commit` (`-m"message"`, `--amend`, `--no-verify`)

`git push` — never `--force`; see [Safe force push](../force-push-vs-force-with-lease/index.md).

`git reset` (`--soft`, `--hard`, `~`, `^`)

`git stash` & `git stash pop`

`git checkout existing-branch` / `git switch existing-branch`

`git checkout -b new-branch` - new branch with the same commits

### Better understanding

People are familiar with collaborating on a project with more people involved.

`git rebase existing-branch`

`git merge existing-branch`

### Deeper understanding

People are maintaining clean history.

`git rebase -i`

This command lets you change a history.

Most often you rewrite history in short-lived branches such as refactoring, fix, or feature branches. You figure out where you want the rebase to start.

Running `git rebase -i FOUND_HASH` opens a text editor that lists the commits in reverse order (the most recent on top), with the word `pick` at the start of every line. You can change that leading word depending on what you need to do — most commonly to `squash`, `edit`, or `drop` — and you can also reorder the lines.

`squash` and `drop` are self-explanatory. `edit` lets you change a commit (add/remove/modify a file).

`git reflog` — recover "lost" work after a bad `reset --hard`, an aborted rebase, or a deleted branch. See [Helpful commands](../helpful-commands/index.md).

`git bisect`

Binary-searches history for the commit that introduced a bug. You tell git a known-good and a known-bad commit; it checks out the midpoint, you test and mark it `good` or `bad`, and it converges on the first bad commit in roughly `log₂(n)` steps. Pair with `git bisect run <script>` to fully automate it when you have a reproducer.

---

## Update your branch

### Configure default strategy

We prefer **REBASE** over MERGE — see [Pull without merge commits](../pull-rebase/index.md). The full `.gitconfig` template (with file locations) lives in [Configuration Example](../configuration-example/index.md).

### Update feature branch with master changes

`git checkout master`

`git pull`

`git checkout -` or `git checkout feature-branch`

`git rebase master`

Rebase can be stopped by conflicts. Resolve conflicts and continue. (Repeated conflicts get auto-replayed — see [Remember conflict resolutions](../git-rerere/index.md).)

`git add .`

`git rebase --continue`

Or you can revert the rebase if you have no idea how to solve the conflict.

`git rebase --abort`

Once the rebase succeeds, the next `git push` will be rejected as non-fast-forward — push with `git pf` instead. See [Safe force push](../force-push-vs-force-with-lease/index.md).

### Push also tags

By default push will push only commits without tags.

To push commits also with tags, add this to your `.gitconfig` (see [Configuration Example](../configuration-example/index.md) for the file location):

```ini
[push]
    followTags = true
```
