---
title: SKILLS
tags:
  - AI
  - Skill
  - Configuration
type: How To
section: Main
releaseDate: 2026-06-01
---

[The Agent Skills Directory](https://skills.sh/)

[GitHub - vercel-labs/skills: The open agent skills tool - npx skills](https://github.com/vercel-labs/skills?tab=readme-ov-file#other-commands)

## Catalogue

Skills grouped by source repository. Each entry is marked with where it is installed, because the catalogue is wider than any one machine:

- **`[global]`** - installed in `~/.claude/skills/`, available in every session. The pinned list a fresh machine reproduces is `scripts/claude-env.skills.json`, installed by `npm run env:bootstrap` (see [[claude-code-environment|Claude Code environment]]).
- **`[project]`** - vendored into this repo's `.agents/skills/` and pinned in `skills-lock.json`, so it only exists here.
- **`[evaluated]`** - read and worth knowing about, not currently installed anywhere.

### anthropics/skills &#91;[GitHub](https://github.com/anthropics/skills)&#93;

- [Frontend Design](https://skills.sh/anthropics/skills/frontend-design) [`project`]
- [Skill Creator](https://skills.sh/anthropics/skills/skill-creator) [`global`]

### better-auth/skills &#91;[GitHub](https://github.com/better-auth/skills)&#93;

- [Better Auth Best Practices](https://skills.sh/better-auth/skills/better-auth-best-practices) [`project`]

### blader/humanizer &#91;[GitHub](https://github.com/blader/humanizer)&#93;

- [Humanizer](https://skills.sh/blader/humanizer/humanizer) [`global`] - removes signs of AI-generated writing; based on Wikipedia's "Signs of AI writing" guide.

### cursor/plugins &#91;[GitHub](https://github.com/cursor/plugins)&#93;

- [Thermo-Nuclear Code Quality Review](https://skills.sh/cursor/plugins/thermo-nuclear-code-quality-review) [`project`] - ambitious, strict review skill; see [[thermo-nuclear-code-review|notes & takeaways]].

### getsentry/skills &#91;[GitHub](https://github.com/getsentry/skills)&#93;

- [Skill Scanner](https://skills.sh/getsentry/skills/skill-scanner) [`evaluated`] - static-analysis audit of other skills before adoption: prompt injection, obfuscation, excessive permissions, secrets, supply chain. Needs the `uv` CLI.

### jezweb/claude-skills &#91;[GitHub](https://github.com/jezweb/claude-skills)&#93;

- [React Hook Form + Zod](https://skills.sh/jezweb/claude-skills/react-hook-form-zod) [`project`]
- [TanStack Query](https://skills.sh/jezweb/claude-skills/tanstack-query) [`project`]

### juliusbrussee/caveman &#91;[GitHub](https://github.com/juliusbrussee/caveman)&#93;

- [Caveman](https://skills.sh/juliusbrussee/caveman/caveman) [`global`] - paired with an always-on output style; see [[always-on-output-style|Always-on output style]].

### mattpocock/skills &#91;[GitHub](https://github.com/mattpocock/skills)&#93;

- [Diagnose](https://skills.sh/mattpocock/skills/diagnose) [`evaluated`]
- ~~[Grill Me](https://skills.sh/mattpocock/skills/grill-me)~~ [`project`] _(deprecated, use Grill with Docs)_
- [Grill with Docs](https://skills.sh/mattpocock/skills/grill-with-docs) [`global`] - see [[grill-with-docs|notes & best practices]].
- Grilling [`global`] - the interview body that Grill with Docs delegates to; arrives with it.
- Domain Modeling [`global`] - the glossary and ADR half of the same pairing; also arrives with it.
- ~~[Handoff](https://skills.sh/mattpocock/skills/handoff)~~ [`evaluated`] _(deprecated, use Work Report)_ - see [[handoff-skill|notes & takeaways]].
- [Triage Issue](https://skills.sh/mattpocock/skills/triage-issue) [`evaluated`]
- [Write a Skill](https://skills.sh/mattpocock/skills/write-a-skill) [`evaluated`]

### obra/superpowers &#91;[GitHub](https://github.com/obra/superpowers)&#93;

- [Brainstorming](https://skills.sh/obra/superpowers/brainstorming) [`evaluated`]

### pilniczek/dev-skills &#91;[GitHub](https://github.com/pilniczek/dev-skills)&#93;

Own skills. The repo doubles as a plugin marketplace, so either `npx skills add` or `/plugin install <skill>@dev-skills` installs them.

- Docs Consistency Check [`global`] [`project`] - cross-file audit of docs, manifests and instruction files; see [[docs-consistency-check|notes]].
- Work Report [`global`] - writes `WORK-REPORT.md` so a reviewer or a fresh session reads the intent instead of re-deriving it from the diff.

### sickn33/antigravity-awesome-skills &#91;[GitHub](https://github.com/sickn33/antigravity-awesome-skills)&#93;

- [Playwright Skill](https://skills.sh/sickn33/antigravity-awesome-skills/playwright-skill) [`evaluated`]

### snyk/studio-recipes &#91;[GitHub](https://github.com/snyk/studio-recipes)&#93;

- [Snyk Fix](https://skills.sh/snyk/studio-recipes/snyk-fix) [`project`]

### vercel-labs/agent-skills &#91;[GitHub](https://github.com/vercel-labs/agent-skills)&#93;

- [Vercel Composition Patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) [`project`]
- [Vercel React Best Practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) [`project`]
- [Web Design Guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines) [`project`]

### vercel-labs/skills &#91;[GitHub](https://github.com/vercel-labs/skills)&#93;

- [Find Skills](https://skills.sh/vercel-labs/skills/find-skills) [`evaluated`]

## Claude plugin skills

Bundled with the official Claude Code plugins marketplace (`~/.claude/plugins/.../claude-plugins-official/`), not `npx skills` — invoked by name.

- **claude-md-improver** — Audits and improves `CLAUDE.md` files against templates, outputs a quality report, then makes targeted edits.
- **claude-automation-recommender** — Scans a repo and recommends Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Good "how should I set up Claude Code here" starting point.
- **build-mcp-server / build-mcp-app / build-mcpb** — MCP development trio: scaffold a server, add interactive UI widgets, bundle a shippable local `.mcpb`.
- **Plugin-dev suite** — `agent-development`, `command-development`, `hook-development`, `skill-development`, `mcp-integration`, `plugin-settings`: focused guides for each piece of a Claude Code plugin.

[settings.json](settings.json)

[tasks.json](tasks.json)
