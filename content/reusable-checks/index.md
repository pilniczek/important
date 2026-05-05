---
title: Reusable checks
type:
  - Tutorial / How To
tags:
  - Form
  - Yup
---

There are two options:

1. function (`.test(_, _, myReusableFunc)`),
2. metod (`yup.addMethod(_, _, myReusableFunc)`).

## Use `addMethod`

This method allows to use error messages from the yup.setLocale (with custom key). That’s better than add it manually with each check.

```
yup.addMethod(
	yup.string,
	"some",
	somefunc
);

yup.setLocale({
	string: {
		some: "someErrorMessage"
	}
});
```
