# Images

## Lazy loading

### HTML Code

```
<!-- Lazy-load an offscreen image when the user scrolls near it -->
<img src="duck.jpg" loading="lazy" alt=".."/>

<!-- Load an image right away instead of lazy-loading -->
<img src="duck.jpg" loading="eager" alt=".."/>

<!-- Browser decides whether or not to lazy-load the image -->
<img src="duck.jpg" loading="auto" alt=".."/>

<!-- Lazy-load images in <picture>. <img> is the one driving image 
loading so <picture> and srcset fall off of that -->
<picture>
  <source media="(min-width: 40em)" srcset="big.jpg 1x, big-hd.jpg 2x">
  <source srcset="small.jpg 1x, small-hd.jpg 2x">
  <img src="fallback.jpg" loading="lazy">
</picture>

<!-- Lazy-load an image that has srcset specified -->
<img src="small.jpg"
     srcset="large.jpg 1024w, medium.jpg 640w, small.jpg 320w"
     sizes="(min-width: 36em) 33.3vw, 100vw"
     alt="A rad wolf" loading="lazy">

<!-- Lazy-load an offscreen iframe when the user scrolls near it -->
<iframe src="video-player.html" loading="lazy"></iframe>
```
**Resources:**
* https://medium.com/@Grigorkh/native-lazy-loading-of-images-and-iframes-6931fe455632
* https://codepen.io/pilniczek/pen/yrLPyr

### JS: Detect lazy support

```
if ('loading' in HTMLImageElement.prototype) {
  // Browser supports `loading`..
} else {
  // Fetch and apply a polyfill/JavaScript library
  // for lazy-loading instead.
}
```
**Resources:**
* https://calibreapp.com/blog/native-lazy-load/
* https://addyosmani.com/blog/lazy-loading/

### JS: IntersectionObserver

**Resources:**
* https://medium.com/@filipvitas/lazy-load-images-with-zero-javascript-2c5bcb691274

### CSS

```
/* Avoid empty images to appear as broken */
img:not([src]):not([srcset]) {
    visibility: hidden;
}

/* Fixes Firefox anomaly during images load time */
@-moz-document url-prefix() {
    img:-moz-loading {
        visibility: hidden;
    }
}
```
**Resources:**
* https://www.andreaverlicchi.eu/lazy-load-responsive-images-in-2019-srcset-sizes-more/
