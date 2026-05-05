---
title: GIT
type: Tool
---

**docs:** [https://git-scm.com/doc](https://git-scm.com/doc)

<aside>
💡 tl;dr: [https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1](https://dev.to/lydiahallie/cs-visualized-useful-git-commands-37p1)

</aside>

[Strategy](../Strategy/index.md)

[Configuration Example](../Configuration-Example/index.md)

[Semantic commit messages](../Semantic-commit-messages/index.md)

[Helpful commands](../Helpful-commands/index.md)

---

## First steps

### Basic understanding

People are familiar only with simple basics - “one man on master” development.

`git clone`

`git pull`

`git commit` (`-m"message"`, `--amend`, `--no-verify`)

`git push` (`--force`)

`git reset` (`--soft`, `--hard`, `~`, `^`)

`git stash` & `git stash pop`

`git checkout existing-branch`

`git checkout -b new-branch` - nová větev se stejnými commity

### Better understanding

People are familiar with collaborating on a project with more people involved.

`git rebase existing-branch`

`git merge existing-branch`

`git switch`

### Deeper understanding

People are maintaining clean history.

`git rebase -i`

This command lets you change a history.

Na začátku musíš vědět, jak velký kus historie potřebuješ měnit, nejčastěji měníš historii v krátkodobých větvích jako jsou refactoring, fix nebo feature větve, které jsou vyvětvovány z `dev` . Nějak si zjistíš, odkud chceš rebase dělat, třeba to vykoukáš z `git log` nebo specializovaným příkazem `git merge-base --fork-point dev` který je vhodný především pokud má feature branch dlouhou historii.

Spuštěním `git rebase -i NALEZENÝ_HASH` vstoupíte do textového editoru, který v opačném pořadí (na vrchu aktuální) zobrazuje historii a na začátku všude slovo `pick` . Toto úvodní slovo jde změnit záleží co potřebujete udělat, nejčastěji půjde o `squash`, `edit` nebo `drop` ale můžete řádky také přeházet.

`squash` a `drop` jsou sebe popisné. `edit` umožňuje změnit commit (přidat/odstranit/modifikovat soubor), ale třeba ho roztrhnout na dva.

---

## Update your branch

### Configure default strategy

> Known as **MERGE STRATEGIES.**
> 

We prefer **REBASE** to MERGE strategy.

Check your [git configuration](../Configuration-Example/index.md) for proper setup. You are looking for global `.gitconfig` configuration file. There should be:

```jsx
...
[pull]
	rebase = true
...
```

Probable locations of the file:

- windows: `C:\Users\[user]\.gitconfig`
- windows WSL: `\\wsl$\Ubuntu-[version]\home\[user]`
- ubuntu: `\home\[user]`

### Update feature branch with master changes

`git checkout master`

`git pull`

`git checkout -` nebo `git checkout feature-branch`

`git rebase master`

Rebase can be stopped by conflicts. Resolve conflicts and continue with these.

`git add .`

`git rebase --continue`

Or you can revert the rebase if you have no idea how to silve the conflict.

`git rebase --abort`

### Push also tags

By default push will push only commits without tags.

To push commits also with tags:
`git config --global push.followTags true`
