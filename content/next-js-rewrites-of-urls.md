---
title: Rewrites of URLs
tags:
  - Next
type:
  - Course
---

It is possible to map source file path do a different URL in NextJS.

[https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites](https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites)

Don’t forget to put rewrites into `beforeFiles` key in rewrites object to work properly.

Example:

```tsx
async rewrites() {
	return {
		beforeFiles: [
			{
				source: "/prihlaseni",
				destination: "/zapomenute-heslo",
			},
		],
	};
},
```

This will map `pages/prihlaseni.tsx` to URL `/zapomenute-heslo`.
