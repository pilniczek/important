---
title: SSH
tags:
  - Collaboration
  - GIT
type:
  - How To
---

SSH lets you clone, pull, and push seamlessly. The setup is a one-time pain; afterwards the whole config travels with the `~/.ssh` folder.

## Generate a key

In a terminal:

```sh
ssh-keygen -t ed25519 -C "your.email@example.com"
```

(`ssh-keygen -t rsa -C "your.email@example.com" -b 4096` is outdated)

Two files land in `~/.ssh/`:

- **Windows**: `C:\Users\<user>\.ssh\`
- **Linux / macOS**: `~/.ssh/` (i.e. `/home/<user>/.ssh/` or `/Users/<user>/.ssh/`)

The file **without** an extension is the **private key** — never paste it anywhere, never email it, never commit it. The `.pub` file is the **public key** — that's the one you upload.

## Passphrase

You'll be prompted for a passphrase during `ssh-keygen`. Leaving it empty (just hit Enter) is fine for a personal machine.

## Upload the public key

The flow is the same on GitHub, GitLab, and Azure DevOps:

1. Open the `.pub` file in any text editor and copy its contents.
2. In the provider: **Settings → SSH and GPG keys → New SSH key**.
3. Paste, give it a name (see [Multi-machine hygiene](#multi-machine-hygiene)), save.

![[ssh-ssh-key.webp]]

On the very first connection to a host, you'll see a fingerprint prompt — type `yes` to accept it. Subsequent connections are silent.

## Tips

- One key per machine.
- Back up `~/.ssh/` before reinstalling the OS.
