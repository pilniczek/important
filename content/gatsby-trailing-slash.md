---
title: Gatsby Trailing Slash
tags:
  - Gatsby
type:
  - How To
  - Archived
---

Trailing slash 

A trailing slash is a forward slash character placed at the end of a URL. The general convention (supported by [Web Standards](https://developers.google.com/search/blog/2010/04/to-slash-or-not-to-slash)
) is that if an URL ends in a trailing slash, it points to a directory; otherwise, it points to a file.

## **trailingSlash**

> Support added in gatsby@4.7.0
> 

Configures the creation of URLs for pages, and whether to remove, append, or ignore trailing slashes.

- `always`: Always add trailing slashes to each URL, e.g. `/x` to `/x/`.
- `never`: Remove all trailing slashes on each URL, e.g. `/x/` to `/x`.
- `ignore`: Don’t automatically modify the URL

The default setting for this option is `always`. Gatsby Cloud automatically handles and supports the `trailingSlash` option. Alternate hosting providers (or if you’re managing this on your own) should follow the “Redirects and expected behavior from the hosting provider” section on the [initial RFC](https://github.com/gatsbyjs/gatsby/discussions/34205).

![[gatsby-trailing-slash-screenshot-309.webp|Снимок экрана (309).png]]

[docs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/#trailingslash)
