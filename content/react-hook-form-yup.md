---
title: React-Hook-Form + Yup
type:
  - How To
tags:
  - Form
  - Yup
---

## Installation

`npm install react-hook-form`
`npm install @hookform/resolvers yup`

## Example

```tsx
// form-provider.tsx
import { type DetailedHTMLProps, type FormHTMLAttributes } from "react";
import { FormProvider as RHFFormProvider, type FormProviderProps } from "react-hook-form";

interface IFormProvider
	extends DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	methods: Omit<FormProviderProps<any, any>, "children">;
	children: FormProviderProps["children"];
}

const FormProvider = ({ methods, children, ...rest }: IFormProvider): JSX.Element => {
	return (
		<RHFFormProvider {...methods}>
			<form {...rest}>{children}</form>
		</RHFFormProvider>
	);
};

export default FormProvider;
```

```tsx
// login-form.tsx
const schema = () =>
	yup.object().shape({
		name: yup.string().required(),
		password: yup.string().required().min(5).max(32),
	});

type FormData = yup.InferType<ReturnType<typeof schema>>;

const LoginForm = () => {
	const methods = useForm({
		resolver: yupResolver(schema()),
		defaultValues: { name: "MeguMethod", password: "" },
		mode: "onSubmit",
	});

	const onSubmit = (data: FormData) => {
		console.log(data);
	};

	return (
		<FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
			<Stack
				sx={{
					gap: 2,
					justifyContent: "center",
					alignItems: "center",
					width: "220px",
					minHeight: "100vh",
					margin: "auto",
				}}
			>
				<CustomInput name="name" label="Name" />
				<CustomInput name="password" label="Password" type="password" />
				<Button variant="contained" color="primary" type="submit" fullWidth>
					Submit
				</Button>
			</Stack>
		</FormProvider>
	);
};

export default LoginForm;
```

## Yup localization

> 🚨 Schema needs to be defined in a function

```tsx
/* CUSTOMIZED COPY OF yup/lib/locale */
/* eslint-disable */

import { type LocaleObject } from "yup";
import { printValue } from "yup";

const cs = {
	mixed: {
		default: "Toto pole není validní",
		required: "Toto pole je povinné.",
	},
};

const sk = {
	mixed: {
		default: "Toto pole nie je platné",
		required: "Toto pole je povinné.",
	},
};

const locale: Record<string, LocaleObject> = {
	cs,
	sk,
};

export default locale;
```

```tsx
// form-locale-provider.tsx
"use client";
import { type ReactNode } from "react";
import { setLocale } from "yup";

import { type localeType } from "@/i18n";

import formLocale from "./locale";

interface FormLocaleProps {
	children: ReactNode;
	locale: localeType;
}

export const FormLocaleProvider = ({ children, locale }: FormLocaleProps) => {
	setLocale(formLocale[locale]);
	return <>{children}</>;
};
```

```tsx
// app/[locale]/layout.tsx
import { locales, type localeType } from "@/i18n";

import { FormLocaleProvider } from "./react-hook-form-example-page/locale-provider";

export function generateStaticParams() {
	return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
	children,
	params: { locale },
}: {
	children: React.ReactNode;
	params: { locale: localeType };
}) {
	return (
		<html lang={locale}>
			<body>
				<FormLocaleProvider locale={locale}>{children}</FormLocaleProvider>
			</body>
		</html>
	);
}
```
