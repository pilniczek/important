import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"
import { FullSlug } from "../../util/path"

const robotsTxtContent = `# Disallow all known search and AI crawlers from indexing this site.

User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: OAI-SearchBot
User-agent: ClaudeBot
User-agent: Claude-Web
User-agent: Claude-User
User-agent: anthropic-ai
User-agent: Google-Extended
User-agent: Googlebot
User-agent: Googlebot-Image
User-agent: Googlebot-News
User-agent: Bingbot
User-agent: Slurp
User-agent: DuckDuckBot
User-agent: DuckAssistBot
User-agent: Baiduspider
User-agent: YandexBot
User-agent: Applebot
User-agent: Applebot-Extended
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: CCBot
User-agent: Bytespider
User-agent: Amazonbot
User-agent: Meta-ExternalAgent
User-agent: FacebookBot
User-agent: facebookexternalhit
User-agent: cohere-ai
User-agent: Diffbot
User-agent: ImagesiftBot
User-agent: omgili
User-agent: omgilibot
User-agent: Timpibot
User-agent: YouBot
User-agent: Mistral-Spider
User-agent: *
Disallow: /
`

export const RobotsTxt: QuartzEmitterPlugin = () => ({
  name: "RobotsTxt",
  async emit(ctx) {
    const path = await write({
      ctx,
      content: robotsTxtContent,
      slug: "robots" as FullSlug,
      ext: ".txt",
    })
    return [path]
  },
  async *partialEmit() {},
})
