---
title: Custom validation trigger
---

když chcete manuální validaci formik formuláře [`useFormikContext().validateForm`] tak bacha, od flow `onSubmit`  se to liší! On totiž `onSubmit` automaticky všechna pole nastaví na `touched`, což ta manuální validace za vás neudělá! (A když pole není nastaveno na touched, tak se nezobrazí jeho error)

GitHub issue: https://github.com/jaredpalmer/formik/issues/2734

## Možné řešení

```jsx
const validate = useFormikContext().validateForm;
---
validate().then((result) => {
	  Object.keys(result).map((item) =>
	    setFieldTouched(item, true)
	  );
});
```

Pozn.: Pozor, toto řešení netouchne všechna pole, pokud jsou hodnoty formuláře strukturovány jako víceúrovňový objekt, např. pro formulář s fieldArray je toto nepoužitelné! Toto řešení touchne jen první level objektu s hodnotami.

Řešení 2:

```jsx
useFormikContext().validateForm.then((errors) => {
	setTouched({ ...errors }); / touch all fields with error
});
```

Pozn.: Předčasné řešení, toto vlastně udělá z touched objektu kopii errors objektu, formiku to zřejmě záleží více na struktuře než na hodnotách, takže to funguje, ale nepoužíval bych to!

Nevím, jestli to je lepší cesta nebo cesta do pekel, ale funkční řešení je deep prolezení objektu a nastavení potřebných polí jako touched per field (např. u multistep formuláře, kde potřebujeme touchnout jen fieldy, které jsou na daném kroku) nebo případně nastavené všech polí formuláře jako touched:

```jsx
const touchFormFields = (prefix, values) => { 
		Object.keys(values).forEach((key) => {
			const name = `${prefix}${prefix !== "" ? "." : ""}${key}`;
			if (
				typeof values[key] === "object" &&
				values[key] !== null
			) {
				touchFormFields(
					`${prefix}${prefix !== "" ? "." : ""}${key}`,
					values[key]
				);
			} else {
				setFieldTouched(name);
			}
		});
	};

touchFormFields("", values) // values z formik contextu
```

Řešení 3:

deep object touch všech (bohužel pouze všech) errorů

```jsx
import { setNestedObjectValues } from "formik";

const validationErrors = await formikHelpers.validateForm()
    if (Object.keys(validationErrors).length > 0){ 
      formikHelpers.setTouched(setNestedObjectValues(validationErrors, true));
      return;
    }
```
