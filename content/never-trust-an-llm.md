---
title: LLMs hallucinate - never trust them implicitly
tags:
  - AI
  - LLM
type: Approach
section: Main
releaseDate: 2026-06-08
url: https://www.youtube.com/watch?v=9VNG0h4pLh0
---


- **Fabricated entities** - making up information that don't exist.
- **Contextual inconsistency** - ignoring info you *explicitly gave it*

## Why it happens

Training compresses the training data into a lossy, blurry "memory". Recalled
data are really guesses. Guessing is more rewarded than refusal by benchmarks.

## The fix: feed it *intrinsic* info

LLMs are far more accurate answering from what you put in their context than from
their training-set memory.

- Pass your code / the actual documents into the conversation.
- For lookups, prompt **"use your search tool"** so it pulls real, cited sources.
- For critical/legal/health answers read the sources - provided context sometimes gets ignored anyway.
