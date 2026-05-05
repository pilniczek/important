---
title: NPM
tags:
  - Start a project
  - NPM
type:
  - How To
---

~~We use `npm v7+` (`node v15+`) on our projects to support `lockfileVersion` `v2` ([https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#lockfileversion](https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json#lockfileversion))~~

## Default

Use latest LTS versions.

## NVM

We make life easier for devs who are switching between projects running on different `node` versions by providing `.nvmrc` file in the root of a project. This file contains node version used in the project. Every developer using node version switching tool (https://github.com/nvm-sh/nvm) can then easily run `nvm use` to automatically switch to required `node` version. 

> Note: `nvm` is also available for Windows machines: https://github.com/coreybutler/nvm-windows
>
