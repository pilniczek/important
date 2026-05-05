---
title: React Dev Tools
tags:
  - Testing
  - React
type:
  - How To
---

## I want to know where a component is used in the source code

Right click on the component, select Inspect element and switch to tab *Components*. Scroll down in right panel a search for *source*, copy path. **IDE will navigate you into right file and line.**

**Webstorm** press two times *shift* and paste the path.

[WebStorm](react-dev-tools-simplescreenrecorder-2022-09-12_16.40.33.mp4)

WebStorm

For the **VS Code** press ctrl + p and paste path.

[VS Code](react-dev-tools-simplescreenrecorder-2022-09-12_16.51.01.mp4)

VS Code

If you are navigated into wrong file just select parent element in *Components* and repeate the same process until you find your right file.

---

## How to find a first greate parent wrapper

In this case we want to find first wrapper of two Contracts Penzijko and Životko

[How to find parent](react-dev-tools-simplescreenrecorder-2022-09-12_17.04.24.mp4)

How to find parent

You can navigate in the tree using the arrows in the keyboard.

---

## All MUI components have doubled elements

In previous videos you can see that all MUI components have doubled elements. For example there is Button with child MuiButtonRoot or Typography with child MuiTypographyRoot.

---
