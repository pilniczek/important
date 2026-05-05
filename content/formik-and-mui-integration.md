---
title: Formik and MUI integration
tags:
  - Form
  - Material UI
type:
  - How To
  - Archived
---

Package which enable easy to use integration of Formik and MUI [https://stackworx.github.io/formik-mui/](https://stackworx.github.io/formik-mui/)

## Manual integration of MUI <Autocomplete /> gotchas

MUI `<Autocomplete />` has to receive custom `onBlur` and `onChange` props, because these props taken from `{…field}`, resp. `useField()` doesn’t set values properly, don’t touch field and don’t clear input value if the value isn’t in the list of allowed options.

```jsx
				onChange={(e, value) => {
					setFieldValue(name, value.value);
				}}
				onBlur={(e) => {
				  const countryExists = countries.find((item) => item.country_code === e.target.value);
					setFieldTouched(name);
					if (!countryExists) {
						setFieldValue(name, "");
					}
				}}
```
