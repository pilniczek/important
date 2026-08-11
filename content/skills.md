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

## Global

Installed in `~/.claude/skills/`, available in every session. The pinned list a fresh machine reproduces is `scripts/claude-env.skills.json`, installed by `npm run env:bootstrap` (see [[claude-code-environment|Claude Code environment]]). Windows and WSL share one copy of that directory and of the CLI's `~/.agents` store, so installing from either side serves both. `skills remove <name> -g` is what takes one out again, because deleting the directory leaves a stale entry in `~/.agents/.skill-lock.json`.

- [Skill Creator](https://skills.sh/anthropics/skills/skill-creator) &#91;[anthropics/skills](https://github.com/anthropics/skills)&#93;
- [Humanizer](https://skills.sh/blader/humanizer/humanizer) &#91;[blader/humanizer](https://github.com/blader/humanizer)&#93; - removes signs of AI-generated writing; based on Wikipedia's "Signs of AI writing" guide.
- [Caveman](https://skills.sh/juliusbrussee/caveman/caveman) &#91;[juliusbrussee/caveman](https://github.com/juliusbrussee/caveman)&#93; - the skill supplies `/caveman` and the intensity levels; a `SessionStart` hook reads its `SKILL.md` to make the voice always-on, see [[always-on-output-style|Always-on caveman]].
- Domain Modeling &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93; - the glossary and ADR half of the same pairing; also arrives with it.
- ~~[Brainstorming](https://skills.sh/obra/superpowers/brainstorming)~~ &#91;[obra/superpowers](https://github.com/obra/superpowers)&#93; _(deprecated, use Grill with Docs)_
- ~~[Grill Me](https://skills.sh/mattpocock/skills/grill-me)~~ &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93; _(deprecated, use Grill with Docs)_
- [Grill with Docs](https://skills.sh/mattpocock/skills/grill-with-docs) &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93; - see [[grill-with-docs|notes & best practices]].
- Grilling &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93; - the interview body that Grill with Docs delegates to; arrives with it.
- ~~[Handoff](https://skills.sh/mattpocock/skills/handoff)~~ &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93; _(deprecated, use Work Report)_ - see [[handoff-skill|notes & takeaways]].
- [Work Report](https://skills.sh/pilniczek/dev-skills/work-report) &#91;[pilniczek/dev-skills](https://github.com/pilniczek/dev-skills)&#93; - writes `WORK-REPORT.md` so a reviewer or a fresh session reads the intent instead of re-deriving it from the diff.
- [Docs Consistency Check](https://skills.sh/pilniczek/dev-skills/docs-consistency-check) &#91;[pilniczek/dev-skills](https://github.com/pilniczek/dev-skills)&#93; - cross-file audit of docs, manifests and instruction files; can also be installed per project; see [[docs-consistency-check|notes]].
- [Skill Scanner](https://skills.sh/getsentry/skills/skill-scanner) &#91;[getsentry/skills](https://github.com/getsentry/skills)&#93; - static-analysis audit of other skills before adoption: prompt injection, obfuscation, excessive permissions, secrets, supply chain. Needs the `uv` CLI.
- [Caveman Compress](https://skills.sh/juliusbrussee/caveman/caveman-compress) &#91;[juliusbrussee/caveman](https://github.com/juliusbrussee/caveman)&#93; - compresses a memory file in place to cut input tokens, keeping a `.original.md` backup.
- [Thermo-Nuclear Code Quality Review](https://skills.sh/cursor/plugins/thermo-nuclear-code-quality-review) &#91;[cursor/plugins](https://github.com/cursor/plugins)&#93; - ambitious, strict review skill; slash-command only, so it never shows in the model's list; see [[thermo-nuclear-code-review|notes & takeaways]].
- [Find Skills](https://skills.sh/vercel-labs/skills/find-skills) &#91;[vercel-labs/skills](https://github.com/vercel-labs/skills)&#93; - searches the directory for a skill that does what you are asking for.

Two entries carry `disable-model-invocation: true` and are therefore slash-command only: Grill with Docs and Thermo-Nuclear Code Quality Review.

## Project

Vendored into this repo's `.claude/skills/`, so they only exist here.

- Decision Framer - reframes a decision into its real options, the criteria that matter, and the unknowns that would change the answer.
- Expand and Contract - expands an idea into everything it could include, then sorts each item into Core / Nice-to-have / Maybe-later / Out.
- Infographic Builder - builds a single-file, self-contained HTML infographic from text or data.
- Karpathy Guidelines - behavioural rules for surgical changes and verifiable success criteria.

## Evaluated

Read and worth knowing about, not currently installed anywhere.

- [Frontend Design](https://skills.sh/anthropics/skills/frontend-design) &#91;[anthropics/skills](https://github.com/anthropics/skills)&#93;
- [Better Auth Best Practices](https://skills.sh/better-auth/skills/better-auth-best-practices) &#91;[better-auth/skills](https://github.com/better-auth/skills)&#93;
- [React Hook Form + Zod](https://skills.sh/jezweb/claude-skills/react-hook-form-zod) &#91;[jezweb/claude-skills](https://github.com/jezweb/claude-skills)&#93; - deliberately not global; install per project if a form-heavy repo wants it.
- [TanStack Query](https://skills.sh/jezweb/claude-skills/tanstack-query) &#91;[jezweb/claude-skills](https://github.com/jezweb/claude-skills)&#93; - same.
- [Diagnose](https://skills.sh/mattpocock/skills/diagnose) &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93;
- [Triage Issue](https://skills.sh/mattpocock/skills/triage-issue) &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93;
- [Write a Skill](https://skills.sh/mattpocock/skills/write-a-skill) &#91;[mattpocock/skills](https://github.com/mattpocock/skills)&#93;
- [Playwright Skill](https://skills.sh/sickn33/antigravity-awesome-skills/playwright-skill) &#91;[sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills)&#93;
- [Snyk Fix](https://skills.sh/snyk/studio-recipes/snyk-fix) &#91;[snyk/studio-recipes](https://github.com/snyk/studio-recipes)&#93;
- [Vercel Composition Patterns](https://skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) &#91;[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)&#93;
- [Vercel React Best Practices](https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) &#91;[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)&#93;
- [Web Design Guidelines](https://skills.sh/vercel-labs/agent-skills/web-design-guidelines) &#91;[vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)&#93;

## Claude plugin skills

Bundled with the official [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) marketplace and cloned to `~/.claude/plugins/marketplaces/claude-plugins-official/`, not installed by `npx skills` - invoked by name. The bracket links the plugin each skill ships in.

- [claude-md-improver](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management/skills/claude-md-improver) &#91;[claude-md-management](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management)&#93; - audits and improves `CLAUDE.md` files against templates, outputs a quality report, then makes targeted edits.
- [claude-automation-recommender](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup/skills/claude-automation-recommender) &#91;[claude-code-setup](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-code-setup)&#93; - scans a repo and recommends Claude Code automations (hooks, subagents, skills, plugins, MCP servers). Good "how should I set up Claude Code here" starting point.
- [build-mcp-server](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev/skills/build-mcp-server) / [build-mcp-app](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev/skills/build-mcp-app) / [build-mcpb](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev/skills/build-mcpb) &#91;[mcp-server-dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/mcp-server-dev)&#93; - MCP development trio: scaffold a server, add interactive UI widgets, bundle a shippable local `.mcpb`.
- [agent-development](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/agent-development), [command-development](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/command-development), [hook-development](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/hook-development), [skill-development](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/skill-development), [mcp-integration](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/mcp-integration), [plugin-settings](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/plugin-settings), [plugin-structure](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev/skills/plugin-structure) &#91;[plugin-dev](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/plugin-dev)&#93; - focused guides for each piece of a Claude Code plugin.

[settings.json](settings.json)

[tasks.json](tasks.json)
