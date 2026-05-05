---
title: SKILLS
tags:
  - AI
  - Skill
type: Code / Snippet
---

[The Agent Skills Directory](https://skills.sh/)

[GitHub - vercel-labs/skills: The open agent skills tool - npx skills](https://github.com/vercel-labs/skills?tab=readme-ov-file#other-commands)

INSTALL SKILLS FOR CURSOR

```bash
npx skills add https://github.com/vercel-labs/skills --agent cursor --yes --skill find-skills -g
npx skills add https://github.com/jezweb/claude-skills --agent cursor --yes --skill react-hook-form-zod -g
npx skills add https://github.com/jezweb/claude-skills --agent cursor --yes --skill tanstack-query -g
npx skills add https://github.com/better-auth/skills --agent cursor --yes --skill better-auth-best-practices -g
npx skills add https://github.com/vercel-labs/agent-skills --agent cursor --yes --skill vercel-composition-patterns -g
npx skills add https://github.com/anthropics/skills --agent cursor --yes --skill frontend-design -g
npx skills add https://github.com/vercel-labs/agent-skills --agent cursor --yes --skill web-design-guidelines -g
npx skills add https://github.com/vercel-labs/agent-skills --agent cursor --yes --skill vercel-react-best-practices -g
npx skills add https://github.com/sickn33/antigravity-awesome-skills --agent cursor --yes --skill playwright-skill -g
```

CHECK FOR UPDATES on startup [WIP]

[settings.json](settings.json)

[tasks.json](tasks.json)

Paste it in `.vscode` folder in cursor.

SECURITY CHECK COMMAND

```markdown
### `/skills-security-check`

**Description:** Runs the agent skills security checklist for `.agents/skills/` and reports pass/fail with findings.

**Steps:**

1. **List installed skills**
  - Run `npx skills list` (project scope); note which skills are in `.agents/skills/` and whether any are global.
2. **Check for risky patterns in skill content**
  - Search `.agents/skills/` for risky strings (eval, secret, password, api_key, disable ssl, bypass, ignore cors, skip valid) in `.md`, `.ts`, `.tsx`, `.sh` (../e.g.%20%60rg%20-i%20%27eval%5Cs%2A%5C(|secret|password|api_key|apiKey|disable.*ssl|bypass|ignore.*cors|skip.*valid' .agents/skills/ --glob '*.md' --glob '*.ts' --glob '*.tsx' --glob '*.sh'`).
  - Report any matches with file and line; treat as failures unless clearly benign (e.g. "don't use eval" in prose).
3. **Verify no secrets or env in .agents**
  - Confirm no literal tokens or keys in SKILL.md or rules under `.agents/skills/`.
4. **External fetches**
  - Grep for `https?://` in `.agents/skills/` (e.g. `rg 'https?:/' .agents/skills/ -g '*.md'`). For each URL (e.g. web-design-guidelines fetch): confirm it is a fixed, versioned or trusted source; note if content is used only as reference (not executed). Flag any user-controllable or arbitrary URLs.
5. **Scripts and templates**
  - List executables: `find .agents/skills -type f \( -name '*.sh' -o -perm -u=x \) 2>/dev/null` and list `scripts/` and `templates/` under each skill. Report presence; remind that agent must not run scripts from user-controlled paths without review.
6. **Frontmatter (allowed-tools / hooks)**
  - Run: `rg -l 'allowed-tools|hooks:' .agents/skills/ -g '*.md'`. If none, report "No allowed-tools or hooks (least privilege)." If present, list and recommend minimal set.
7. **Skill updates**
  - Run `npx skills check` and report whether updates are available; recommend reviewing diffs before `npx skills update`.
8. **Summarize**
  - Output a short report: checklist items passed/failed, paths of concern, and one-line recommendations (e.g. "Pin web-design-guidelines URL to a tag", "No action needed for scripts").

**Usage:** `/skills-security-check`
```
