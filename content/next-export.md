---
title: Next Export
tags:
  - Next
type:
  - How To
  - Archived
---

# Next.config.js

set output to “standalone”

```jsx
/** @type {import('next').NextConfig} */
const nextConfig = {
  cleanDistDir: true,
  output: "standalone",
};

export default nextConfig;
```

# Dockerfile

Dockerfile with ENV variables: 

- `NEXT_PUBLIC_EXAMPLE_TOKEN`
- `NEXT_PUBLIC_EXAMPLE_API_URL`
- `NPM_TOKEN` (for private npm package)

```docker
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps

ARG NPM_TOKEN

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat python3 make g++ git
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

ARG NEXT_PUBLIC_EXAMPLE_TOKEN
ARG NEXT_PUBLIC_EXAMPLE_API_URL

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

RUN npm install --no-package-lock --no-save sharp

ENV NEXT_SHARP_PATH /app/node_modules/sharp

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/standalone/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./.next/standalone/public

USER nextjs

EXPOSE 3000

# ENV PORT 3000

# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", ".next/standalone/server.js"]
```

# .gitlab-ci.yml

add job for docker image creation, set values for ENV variables

```yaml
default:
  image: node:16.16.0

stages:
  - build
  - test
  - deploy

.build:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.14.0-debug
    entrypoint: [""]
  variables:
    NEXT_PUBLIC_EXAMPLE_TOKEN: example_token_value
    NEXT_PUBLIC_EXAMPLE_API_URL: https://example.url
  script:
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor
      --cache
      --build-arg NEXT_PUBLIC_EXAMPLE_TOKEN="${NEXT_PUBLIC_EXAMPLE_TOKEN}"
      --build-arg NEXT_PUBLIC_EXAMPLE_API_URL="${NEXT_PUBLIC_EXAMPLE_API_URL}"
      --build-arg NPM_TOKEN=$NPM_TOKEN
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_REF_SLUG}"
      --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHA}"
      $ADDITIONAL_IMAGE_TAGS

build:
  extends: .build
  rules:
    - if: $CI_COMMIT_REF_NAME == "dev"
```

# Deploy

We'll hand it over to Dan for deployment.
