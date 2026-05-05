---
title: Configuration Example
tags:
  - GIT
  - Configuration
type:
  - How To
---

A template `.gitconfig` for any developer.

> ⚠️ **Don't run `git config ...` commands** to apply these settings. Open your `.gitconfig` file in an editor, paste the template below, and edit it by hand. The config has structure, comments, and aliases that round-trip cleanly through manual edits — the `git config` CLI fights it on all three.

## Where the file lives

- **Windows**: `C:\Users\<user>\.gitconfig`
- **Windows WSL**: `\\wsl$\Ubuntu-<version>\home\<user>\.gitconfig`
- **Linux / macOS**: `~/.gitconfig` (i.e. `/home/<user>/.gitconfig` or `/Users/<user>/.gitconfig`)

If the file doesn't exist yet, create it. Then paste the template below and replace every `__PLACEHOLDER__` with your value.

## .gitconfig template

```ini
[user]
	name = __PLACEHOLDER_NAME__
	email = __PLACEHOLDER_EMAIL__
	# only needed when signing commits with GPG
	signingkey = __PLACEHOLDER_GPG_KEY__

[apply]
	whitespace = nowarn

[push]
	default = current

[core]
	# windows -> true, linux -> input
	autocrlf = input
	safecrlf = false
	# excludesfile = /Users/__PLACEHOLDER_USER__/.gitignore_global
	# VSCode as default editor
	editor = code --wait
	# editor = "C:\\Users\\__PLACEHOLDER_USER__\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\\code" --wait

[remote "origin"]
	# git push -> push current HEAD into tracked remote branch
	push = HEAD

[diff]
	mnemonicprefix = true
	tool = vscode

[difftool "vscode"]
	cmd = code --wait --diff $LOCAL $REMOTE

[merge]
	tool = vscode

[mergetool "vscode"]
	cmd = code --wait $MERGED

[pull]
	rebase = true

[rerere]
	enabled = true

# personal preferences will follow
[alias]
	# rebase feature branch onto current branch (typically release branch)
	rebm = !sh -c 'echo rebasing branch \"$0\" on top of \"$1\" && git checkout \"$0\" && git pull origin \"$0\" && git rebase \"$1\" && git checkout \"$1\" && git merge \"$0\" && echo all done'
	f = fetch
	# updates your branch with upstream (if fast-forward is possible)
	ff = !git merge --ff-only `git rev-parse --symbolic-full-name --abbrev-ref=strict HEAD@{u}`
	# squash x commits onto first of them
	sq = !sh -c 'git reset --soft HEAD~\"$0\" && git commit --amend'
	fp = fetch --prune
	pf = push --force-with-lease
	st = status
	cm = commit
	cmp = commit --amend --no-edit
	br = branch
	co = checkout
	cp = cherry-pick
	df = diff
	rb = rebase
	rbi = rebase -i
	rbc = rebase --continue
	rh = reset --hard
	su = submodule update
	# graph for current branch
	l  = log --graph --decorate --pretty=oneline --abbrev-commit
	# graph for all branches
	ll = log --graph --decorate --pretty=oneline --abbrev-commit --all
	# log for current branch showing diffs (-m is for showing mergecommits too)
	ld = log -p -m
	# log for current branch showing summary of changed files (-m is for showing mergecommits too)
	ls = log --stat -m
	# number of commits per author
	stats = shortlog -n -s --no-merges
	# remove remote branch (remote must be named origin), usage: git rmb test
	rmb = !sh -c 'git push origin :$1' -
	# shows local > tracked remote
	brt = for-each-ref --format=\"%(refname:short) > %(upstream:short)\" refs/heads
	# get upstream tracked branch or error
	brtracked = rev-parse --symbolic-full-name --abbrev-ref=strict HEAD@{u}
	# commit all changes to a WIP commit
	wip = !git add --all && git commit -m WIP --no-verify
	# undo last commit
	cm-undo = reset HEAD~
	# special branches
	release = push origin HEAD:release
	selenium = push origin HEAD:selenium
	test = push origin HEAD:test
	# remove merged branches
	merged = !sh -c 'git branch --merged | egrep -v \"(^\\*|master|main|dev)\" >/tmp/merged-branches && code --wait /tmp/merged-branches && xargs git branch -d </tmp/merged-branches'

[color]
	ui = auto
[color "branch"]
	current = yellow reverse
	local = yellow
	remote = green
[color "diff"]
	meta = yellow bold
	frag = magenta bold
	old = red bold
	new = green bold
[color "status"]
	added = green
	changed = yellow
	untracked = cyan
```

## Settings reference

Most of the template is uncontroversial. The settings below have their own deep-dive articles — read them before you change them locally:

- **`[remote "origin"] push = HEAD`** → [[push-head|Push current branch by default]]
- **`[pull] rebase = true`** → [[pull-rebase|Pull without merge commits]]
- **`[rerere] enabled = true`** → [[git-rerere|Remember conflict resolutions]]
- **`[core] autocrlf` / `safecrlf`** → [[autocrlf|Safe line endings]]
- **`[alias] pf = push --force-with-lease`** → [[force-push-vs-force-with-lease|Safe force push]]
- **`[commit] gpgsign = true` / `[user] signingkey`** → [[gpg-sign-commits|Sign your commits]]
