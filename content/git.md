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

## How changes get into Git

Git does not record your edits automatically. A change moves through three states:

1. **Working** — you edited a file. Git can see it.
2. **Staged** — you ran `git add <path>` (or clicked the `+` in the Source Control panel). The change is now queued for the next commit.
3. **Committed** — `git commit -m "..."` writes the staged changes into history.

`git status` shows the current state of every modified file. Saving the file in your editor is a prerequisite for any of this — see [Troubleshooting](#troubleshooting) below.

Nothing leaves your machine until you push, and nothing arrives from the server until you fetch/pull. Git **does not sync automatically**:

- `git fetch` — ask the server what's new; updates remote-tracking refs only, nothing changes in your working copy.
- `git pull` — fetch **and** apply server changes to the current branch.
- `git push` — send your local commits to the server.

## CLI and GUI together

CLI shows you exactly which command runs and with which flags. GUI (Tower, GitKraken, the IDE's Source Control panel, Git Graph) is faster for visual jobs — staging hunks, reading the graph, resolving conflicts — but a button label rarely tells you which Git commands fire underneath, and a single click can run several with extra flags.

Use both. Reach for the GUI for visual work; drop to the CLI when you need to know what is actually happening.

## Don't touch the `.git` folder

The `.git` directory is Git's internal storage. **Never edit it by hand.** Edge cases exist where you have to — e.g. an aborted operation after a power loss — but only if you already know what the files mean. If you don't, you'll corrupt the repo faster than you can recover it.

---

## First steps

### Basic understanding

People are familiar only with simple basics - “one man on master” development.

`git clone`

`git pull`

`git commit` (`-m"message"`, `--amend`, `--no-verify`)

`git push` — never `--force`; see [[force-push-vs-force-with-lease|Safe force push]].

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

`git reflog` — recover "lost" work after a bad `reset --hard`, an aborted rebase, or a deleted branch. See [[helpful-commands|Helpful commands]].

`git bisect`

Binary-searches history for the commit that introduced a bug. You tell git a known-good and a known-bad commit; it checks out the midpoint, you test and mark it `good` or `bad`, and it converges on the first bad commit in roughly `log₂(n)` steps. Pair with `git bisect run <script>` to fully automate it when you have a reproducer.

---

## Branch per change

Never commit straight to `master` / `main`. Create a branch for every change:

```sh
git checkout -b <initials>/<short-feature-name>
```

For example: `xyz/add-dark-mode`. With the `push = HEAD` config from [[configuration-example|Configuration Example]], the first `git push` will create the matching remote branch automatically — no `-u origin <branch>` boilerplate.

Merge to `master` / `main` via Pull Request (GitHub) or Merge Request (GitLab) — see [[strategy|Strategy]].

---

## Update your branch

### Configure default strategy

We prefer **REBASE** over MERGE — see [[pull-rebase|Pull without merge commits]]. The full `.gitconfig` template (with file locations) lives in [[configuration-example|Configuration Example]].

### Update feature branch with master changes

`git checkout master`

`git pull`

`git checkout -` or `git checkout feature-branch`

`git rebase master`

Rebase can be stopped by conflicts. Resolve conflicts and continue. (Repeated conflicts get auto-replayed — see [[git-rerere|Remember conflict resolutions]].)

`git add .`

`git rebase --continue`

Or you can revert the rebase if you have no idea how to solve the conflict.

`git rebase --abort`

Once the rebase succeeds, the next `git push` will be rejected as non-fast-forward — push with `git pf` instead. See [[force-push-vs-force-with-lease|Safe force push]].

### Push also tags

By default push will push only commits without tags.

To push commits also with tags, add this to your `.gitconfig` (see [[configuration-example|Configuration Example]] for the file location):

```ini
[push]
    followTags = true
```

> ⚠️ **Tags pin a release — never move them.** Unlike branches, tags are not supposed to follow new commits. Anything downstream (CI artifacts, deploy pipelines, release notes) trusts that `v1.2.0` points at the same commit forever. If you need a different commit, cut a new tag (`v1.2.1`); don't re-point an existing one.

---

## Troubleshooting

- **Git says the file is unchanged but you just edited it.** Check the editor tab — a dot instead of an `×` (or "unsaved" indicator) means the file isn't written to disk yet. Save it (`Ctrl+S` / `Cmd+S`) and re-check `git status`.
- **`git commit` hangs / opens a strange file.** You committed without `-m`, so Git opened `COMMIT_EDITMSG` in your configured editor and is waiting for you to write a message. Type the message, save, close the editor — Git will pick up where it left off. Abort the commit by saving an empty message (or deleting all content).
- **IDE shows no Git data even after installing Git.** VS Code and Cursor ship with a bundled Git binary that is independent from the system Git — and on some systems it doesn't see your config or SSH keys. Install Git globally (see [[install-git|Install Git]]) so both agree, then restart the IDE.
- **Source Control / Git Graph shows nothing.** You opened the wrong folder. Open the folder that **contains** the `.git` directory — not its parent, and not a single file. If you opened one level too high, Git Graph won't find the repo; if you opened a single file, the source-control view stays empty.
