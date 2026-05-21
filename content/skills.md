---
title: SKILLS
tags:
  - AI
  - Skill
type:
  - How To
releaseDate: 2026-05-22
---

[The Agent Skills Directory](https://skills.sh/)

[GitHub - vercel-labs/skills: The open agent skills tool - npx skills](https://github.com/vercel-labs/skills?tab=readme-ov-file#other-commands)

## Catalogue

Skills installed by the commands below, grouped by source repository.

### anthropics/skills &#91;[GitHub](https://github.com/anthropics/skills)&#93;

- [Frontend Design](https://skills.sh/anthropics/skills/frontend-design)
- [Skill Creator](https://skills.sh/anthropics/skills/skill-creator)

### better-auth/skills &#91;[GitHub](https://github.com/better-auth/skills)&#93;

- [Better Auth Best Practices](https://skills.sh/better-auth/skills/better-auth-best-practices)

### jezweb/claude-skills &#91;[GitHub](https://github.com/jezweb/claude-skills)&#93;

- [React Hook Form + Zod](https://skills.sh/jezweb/claude-skills/react-hook-form-zod)
- [TanStack Query](https://skills.sh/jezweb/claude-skills/tanstack-query)

### juliusbrussee/caveman &#91;[GitHub](https://github.com/juliusbrussee/caveman)&#93;

- [Caveman](https://skills.sh/juliusbrussee/caveman/caveman)

### mattpocock/skills &#91;[GitHub](https://github.com/mattpocock/skills)&#93;

- [Diagnose](https://skills.sh/mattpocock/skills/diagnose)
- ~~[Grill Me](https://skills.sh/mattpocock/skills/grill-me)~~ _(deprecated, use Grill with Docs)_
- [Grill with Docs](https://skills.sh/mattpocock/skills/grill-with-docs)
- [Triage Issue](https://skills.sh/mattpocock/skills/triage-issue)
- [Write a Skill](https://skills.sh/mattpocock/skills/write-a-skill)

### obra/superpowers &#91;[GitHub](https://github.com/obra/superpowers)&#93;

- [Brainstorming](https://skills.sh/obra/superpowers/brainstorming)

### pilniczek/docs-consistency-check &#91;[GitHub](https://github.com/pilniczek/docs-consistency-check)&#93;

- [Docs Consistency Check](https://skills.sh/pilniczek/docs-consistency-check/docs-consistency-check)

### sickn33/antigravity-awesome-skills &#91;[GitHub](https://github.com/sickn33/antigravity-awesome-skills)&#93;

- [Playwright Skill](https://skills.sh/sickn33/antigravity-awesome-skills/playwright-skill)

### snyk/studio-recipes &#91;[GitHub](https://github.com/snyk/studio-recipes)&#93;

- [Snyk Fix](https://skills.sh/snyk/studio-recipes/snyk-fix)

### vercel-labs/agent-skills &#91;[GitHub](https://github.com/vercel-labs/agent-skills)&#93;

- [Vercel Composition Patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns)
- [Vercel React Best Practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices)
- [Web Design Guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines)

### vercel-labs/skills &#91;[GitHub](https://github.com/vercel-labs/skills)&#93;

- [Find Skills](https://skills.sh/vercel-labs/skills/find-skills)

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
