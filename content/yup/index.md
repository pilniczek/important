---
title: Yup
tags:
  - Form
  - Yup
type:
  - Code / Snippet
---

[Reusable checks](../reusable-checks/index.md)

[Default validation translations](../default-validation-translations/index.md)

## Known issues

### Cyclic dependencies

If we have a condition dependent on other fields, for instance “show incomplete address error message under town input only if zip, houseNumber or streetNumber is defined, you can run into this problem https://github.com/jquense/yup/issues/1464 

Solution from NN address validation (see comments):

```jsx
address: object()
				.shape(
					// all address fields except street field are required, but only when one of the address field is present (in other words, don't send incomplete address)
					{
						houseNumber: string()
							.default("") / https://github.com/jaredpalmer/formik/issues/805#issuecomment-725535037 - to make parentHasChange() works properly
							.defined()
							.max(30)
							.matches(/^[0-9/]*$/, cs.AddressErrorMessages.houseNumberSymbols)
							.when(["street", "town", "zip"], {
								is: (street, town, zip) => street || town || zip,
								then: string()
									.nullable()
									.required(
										cs.beneficiariesChange.errorMessages.incompleteAddress
									),
								otherwise: string().nullable(),
							}),
						street: string()
							.default("")
							.defined()
							.max(100)
							.when(["houseNumber", "town", "zip"], {
								is: (houseNumber, town, zip) => houseNumber || town || zip,
								then: string()
									.nullable()
									.required(
										cs.beneficiariesChange.errorMessages.incompleteAddress
									),
								otherwise: string().nullable(),
							}),
						town: string()
							.default("")
							.defined()
							.max(50)
							.when(["houseNumber", "street", "zip"], {
								is: (houseNumber, street, zip) => houseNumber || street || zip,
								then: string()
									.nullable()
									.required(
										cs.beneficiariesChange.errorMessages.incompleteAddress
									),
								otherwise: string().nullable(),
							}),
						zip: string()
							.default("")
							.defined()
							.max(5)
							.matches(/^[0-9]*$/, cs.errorMessages.onlyNumbers)
							.when(["houseNumber", "street", "town"], {
								is: (houseNumber, street, town) =>
									houseNumber || street || town,
								then: string()
									.nullable()
									.required(
										cs.beneficiariesChange.errorMessages.incompleteAddress
									),
								otherwise: string().nullable(),
							}),
					},
					[
						["houseNumber", "town"], // sadly this 2nd parameter of object() is missing in yup documentation, but it is required to solve circle dependencies of fileds, there must be specified all combinations of fields https://github.com/jquense/yup/issues/1464
						["houseNumber", "zip"],
						["houseNumber", "street"],
						["zip", "town"],
						["zip", "street"],
						["street", "town"],
					]
				)
				.nullable(),
```
