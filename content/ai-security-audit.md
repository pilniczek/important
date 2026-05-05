---
title: AI security audit
tags:
  - AI
  - Security
  - Skill
type:
  - Tool
---

## App

there is a security audit tool for skills.sh

https://app.snyk.io/account

---

## Recepies

https://github.com/snyk/studio-recipes

---

## Skill

https://github.com/snyk/agent-scan/blob/main/README.md

---

## Script

### Install

1. Install `uv` (Python tool runner) — see [astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/). Windows: `winget install --id=astral-sh.uv -e`.
2. Create a free [Snyk account](https://snyk.io/), grab the API token from [app.snyk.io/account](https://app.snyk.io/account), and save it to `.env` (gitignored) as a single line: `SNYK_TOKEN=<your-token>`.

### Run

PowerShell:

```powershell
$env:SNYK_TOKEN = (Get-Content .env | Where-Object { $_ -match '^SNYK_TOKEN=' }) -replace '^SNYK_TOKEN=',''
uvx snyk-agent-scan@latest --skills .\skills\docs-consistency-check\SKILL.md
```

cmd.exe:

```cmd
for /f "tokens=1,* delims==" %i in (.env) do @if /i "%i"=="SNYK_TOKEN" set SNYK_TOKEN=%j
uvx snyk-agent-scan@latest --skills .\skills\docs-consistency-check\SKILL.md
```

bash / zsh:

```bash
export SNYK_TOKEN=$(grep ^SNYK_TOKEN= .env | cut -d= -f2-)
uvx snyk-agent-scan@latest --skills ./skills/docs-consistency-check/SKILL.md
```
