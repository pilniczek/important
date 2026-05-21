---
title: SVG animation via CSS
tags:
  - SVG
  - CSS
type:
  - How To
---

## There are two main approaches:

1. [transition](https://developer.mozilla.org/en-US/docs/Web/CSS/transition) (animate from an old state to a new one)
- Only for values represented by numbers (length, color, etc., not margin from `0` to `auto`).
- The [transform](https://developer.mozilla.org/en-US/docs/Web/CSS/transform) is transitioned in most cases.
- Never use transition for top, bottom, left, right properties (../absolute/relative%20elements) - it has terrible performance.
2. [keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes) (ideal for infinite animations)
- [House & smoke animation](https://codepen.io/garant-web/pen/oNVaWJp)

## You need a general setup

For a cross-browser consistent animations.

```jsx
svg * { 
  transform-box: fill-box;
}

.animatedElement {
	transform-origin: somewhere;
}
```

## Best practices

1. Minify the SVG resource via [SVGOMG](https://jakearchibald.github.io/svgomg/).
2. Use CSS classes as state holders.
- [Car animation](https://codepen.io/garant-web/pen/eYXPWxz)
3. Decompose complex shape animations into multiple simple shape animations.
- [House & smoke animation](https://codepen.io/garant-web/pen/oNVaWJp) (cloud to circles)
4. CSS `transform` for the win in most cases.
- [Car animation](https://codepen.io/garant-web/pen/eYXPWxz).
5. You can animate SVG attributes if needed.
- [Multiple examples](https://codepen.io/garant-web/details/VwREWjG)
- [Circle example](https://codepen.io/garant-web/pen/zYbmweN)
6. Use `strokes` to create the “draw” effect.
- [Draw display example](https://codepen.io/garant-web/pen/JjzmNmJ)
7. You often need paths instead of other objects.
- [Circle as path example](https://codepen.io/garant-web/pen/QWoZvZe)
- **Discuss this with the designer.**

## Tip

1. Sometimes [you can animate characters](https://codepen.io/garant-web/pen/LYagyqO) instead of SVGs.
2. You can [track the movement of the cursor](https://codepen.io/garant-web/pen/YzgJVJa).
3. There are [“creative” solutions](https://codepen.io/garant-web/pen/YzgJVBL) from right to left (or vice versa) animations.
4. Crop the space around SVG via [viewBox](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/viewBox).
5. Create responsive animation - use `width: 100%` for `SVG` tag and manage its HTML container.
6. Chrome can calculate the length of a path for perfect stroke animations from the console - HOW!!! (saw it in a talk once, but can not remember… TODO!!!)
7. [SVG path visualizer](https://svg-path-visualizer.netlify.app/#M140%2020C73%2020%2020%2074%2020%20140c0%20135%20136%20170%20228%20303%2088-132%20229-173%20229-303%200-66-54-120-120-120-48%200-90%2028-109%2069-19-41-60-69-108-69z)
8. [Illustrated Guide to the path syntax](https://css-tricks.com/svg-path-syntax-illustrated-guide/)

## Resource problems

Paths should be as simple as possible. The issue of a complex path can be seen in the [Car animation](https://codepen.io/garant-web/pen/eYXPWxz) - just remove line `53`: `display: none; /* try to remove this */` - and see the path of the car’s body. These paths can not be animated by strokes as expected in [Draw display animation](https://codepen.io/garant-web/pen/JjzmNmJ).
- **Discuss this with the designer.**
