---
title: Troubleshooting MUI
tags:
  - Material UI
type:
  - Tutorial / How To
---

## SVG Icons do not change color

**SVG icons** exported from Figma sometimes need to be redrawn to be able to change colors properly. (I mostly use this tool for the job. [https://svg-path-visualizer.netlify.app](https://svg-path-visualizer.netlify.app/)) 

## sx=”[object Object]”

Beware the import. The `@material-ui/core` is not the one you want. Use `@mui/material` instead.

## Changes in theme.js don’t trigger hotreload!!! :-(

## Where is my CSS :(

![Untitled](Untitled.png)
