---
title: Sign your commits
tags:
  - GIT
  - Configuration
type:
  - How To
---

> 💡 Anyone can set `user.email = ceo@company.com` and commit as the CEO. Signing commits with GPG proves the author controls a specific private key — GitHub and GitLab mark signed commits as **Verified**.

## The problem

Git commits trust whatever name/email you put in your config. There's no built-in proof that "you" are you. A signed commit fixes that.

## What the settings do

```ini
[commit]
    gpgsign = true
[user]
    signingkey = __PLACEHOLDER_GPG_KEY__
```

Every commit is signed automatically with your private key. Find an existing key with `gpg --fingerprint`, or generate one with `gpg --full-generate-key`. Upload the public part to your git host (GitHub: *Settings → SSH and GPG keys*) so it can verify signatures.

**Windows:** also add the path to the GPG binary, or every commit fails with `gpg failed to sign the data`:

```ini
[gpg]
    program = C:\\Program Files (x86)\\gnupg\\bin\\gpg.exe
```

See [[configuration-example|Configuration Example]] — fill in your key id.
