---
title: GitLab notifications in Slack
tags:
  - GitLab
  - Slack
type:
  - How To
  - Archived
---

## How to setup:

**Slack:**

Add GitLab app integration

![[gitlab-notifications-in-slack-Screenshot_from_2024-01-09_13-20-03.webp|Screenshot from 2024-01-09 13-20-03.png]]

**GitLab:**

Settings → Integrations → GitLab for Slack App → Configure

![[gitlab-notifications-in-slack-Screenshot_from_2024-01-09_13-26-08.webp|Screenshot from 2024-01-09 13-26-08.png]]

**Git:**

```
git commit -m "v1.0"
git tag v1.0
git push
```

**Slack:**

![[gitlab-notifications-in-slack-Screenshot_from_2024-01-09_13-28-13.webp|Screenshot from 2024-01-09 13-28-13.png]]
