---
title: Issue
tags:
  - GitLab
  - Collaboration
type:
  - How To
  - Archived
---

Every task should be tracked as issue in GitLab. Creating an issue is the very start of a successfully managed work.

![[issue-issue.webp]]

We expect a title, description (you can select from predefined templates), assignee and iteration (if iteration is known).

> **Iteration** makes the issue visible in [[board-iteration|**board**]].
> 

> **Epics** are currently used only in internal track issues.
> 

![[issue-issue2.webp]]

![[issue-issue3.webp]]

## Create Merge Request from Issue

An issue can be resolved with one or more [[merge-request|Merge Requests]].

You can prepare a [[merge-request|Merge Request]] (and related branch) in the issue.

Related branch should have a short and descriptive name.

![[issue-issue-mr.webp]]

## The End of an Issue

After all related merge requests are successfully merged, issue can be closed in the issue UI or via a [[merge-request|merge request]].

> **But beware:** maybe a tester or PM should test it before closing it!
> 

![[issue-issue-close-1.webp]]
