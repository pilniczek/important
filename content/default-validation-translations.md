---
title: Default validation translations
type:
  - How To
tags:
  - Form
  - Yup
  - Start a project
---

[https://github.com/jquense/yup#error-message-customization](https://github.com/jquense/yup#error-message-customization)

> `use Yup schemas AFTER you defined your custom dictionary`
> 

## Custom dictionary

```jsx
/* CUSTOMIZED COPY OF yup/lib/locale */

import { LocaleObject } from "yup/lib/locale";
import printValue from "yup/lib/util/printValue";

const locale: LocaleObject = {
	mixed: {
		default: "${path} není validní",
		required: "Toto pole je povinné.",
		oneOf: "${path} musí obsahovat jednu z následujících hodnot: ${values}",
		notOneOf:
			"${path} nesmí obsahovat ani jednu z následujících hodnot: ${values}",
		notType: ({ path, type, value, originalValue }) => {
			const isCast = originalValue != null && originalValue !== value;
			let msg =
				`${path} musí být typu \`${type}\`` +
				`ale konečná hodnota byla: \`${printValue(value, true)}\`` +
				(isCast ? ` (z hodnoty \`${printValue(originalValue, true)}\`).` : ".");

			if (value === null) {
				msg += `\n Pokud je "null" zamýšleno jako hodnota prázného pole, označte ho jako \`.nullable()\``;
			}

			return msg;
		},
		defined: "${path} musí být definováno",
	},
	string: {
		length: "${path} musí mít přesně ${length} znaků.",
		min: "${path} musí mít nejméně ${min} znaků",
		max: "${path} musí mít maximálně ${max} znaků",
		matches: '${path} musí splňovat následující: "${regex}"',
		email: "Nevalidní emailová adresa.",
		url: "Nevalidní URL adresa.",
		uuid: "${path} musí být validní UUID",
		trim: "${path} nesmí začínat ani končit mezerami",
		lowercase: "${path} musí začínat malým písmenem",
		uppercase: "${path} musí začínat velkým písmenem",
	},
	number: {
		min: "${path} musí být větší nebo rovno ${min}",
		max: "${path} musí být menší nebo rovno ${max}",
		lessThan: "${path} musí být menší než ${less}",
		moreThan: "${path} musí být větší než ${more}",
		positive: "${path} musí být kladné číslo",
		negative: "${path} musí být záporné číslo",
		integer: "${path} musí být celé číslo",
	},
	date: {
		min: "Datum musí být po ${min}.",
		max: "Nezadávejte data starší, než ${max}.",
	},
	boolean: {
		isValue: "${path} musí být ${value}",
	},
	object: {
		noUnknown: "${path} má nespecifikované klíče: ${unknown}",
	},
	array: {
		min: "${path} musí mít nejméně ${min} položek",
		max: "${path} musí mít méně než ${max} položek",
		length: "${path} musí mít ${length} položek",
	},
};
export default locale;
```

## Usage

```jsx
setLocale(locale)
```

May occur in `gatsby-shared` for example.

## addMethod

[setLocale](https://github.com/jquense/yup#error-message-customization) neumí pracovat s custom validacemi vytvořenými přes [addMethod](https://github.com/jquense/yup#addmethodschematype-schema-name-string-method--schema-void). Historicky jsem našel dvě místa na githubu [[here](https://github.com/jquense/yup/issues/222#issuecomment-438675500) and [here](https://github.com/jquense/yup/issues/527)], kde to chtěli řešit, ale nikam se to nehlo a dnes to pořád nefunguje.
