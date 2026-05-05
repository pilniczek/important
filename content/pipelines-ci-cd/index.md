---
title: Pipelines [CI/CD]
tags:
  - GitLab
  - Collaboration
type:
  - Tutorial / How To
  - Archived
---

## Checklist

- project variables
- CI job - **build_project**
- CI job - **code_quality** [Notion]
- CI job - **ui test** [Notion]
- CI job - l**ighthouse** [[Notion](../lighthouse/index.md)]
- CI job - **eslint** [Notion]
- CI job - **fixup! commits** [[Notion](../fixup-commity/index.md)]

---

If a successfully **reviewed issue** contains some kind of **degradation** (listed below) we will **expect a follow-up** issue that purges these degradation.

- lighthouse score degradation (if `lh-ci` is included)
- code quality (human-measured or pipeline measured)

---
