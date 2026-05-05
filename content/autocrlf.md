---
title: Safe line endings
tags:
  - GIT
  - Configuration
type:
  - How To
---

> 💡Keeps the repo storing **LF** everywhere, regardless of who works on Windows and who works on Linux/macOS. No more diffs full of `^M` line-ending noise.

## The problem

Windows editors save files with **CRLF** (`\r\n`). Linux/macOS save with **LF** (`\n`). If everyone commits whatever their editor produced:

- A diff that should be 1 line becomes "every line changed".
- `git blame` points at whoever last opened the file in a different OS.

## What the settings do

```ini
[core]
    # windows -> true, linux/mac -> input
    autocrlf = input
    safecrlf = false
```

**Result:** the repo always stores LF. What lives in your working tree depends on your OS.

## How to set

Already in the shared [[configuration-example|Configuration Example]]. Use `autocrlf = input` on Linux/macOS and `autocrlf = true` on Windows.

## When this isn't enough

`autocrlf` is a per-developer setting and easy to forget. For repos that **must** stay consistent (open source, shell scripts, CI configs), commit a `.gitattributes` file with `* text=auto eol=lf` — that enforces line endings at the repo level instead of trusting every clone.
