---
title: Formik
tags:
  - Form
type:
  - Tool
  - Archived
---

**docs:** [https://formik.org/docs/overview](https://formik.org/docs/overview)

---

## We prefere useField hook

[[formik-and-mui-integration|Formik and MUI integration]]

[[formik-custom-validation-trigger|Custom validation trigger]]

[[formik-form-has-changes|Form has changes]]

## Why we want to stop using this library

1. Formik nemá `useFieldArray()` hook, takže pokud chcete ovládat přidávání/odebírání inputů ve `<FieldArray />` z místa mimo `<FieldArray />`, úplně dobře to nejde. Nedostanete se totiž k `arrayHelpers` obsahující funkce na manipulaci s položkami `<FieldArray>`e (push, pop, move,...) ([https://formik.org/docs/api/fieldarray#render-arrayhelpers-arrayhelpers--reactreactnode](https://formik.org/docs/api/fieldarray#render-arrayhelpers-arrayhelpers--reactreactnode)) a musíte si vystačit s nějakým workaroundem, kdy např. napřímo manipulujete s `values` objektem. GitHub issue s tímto problémem [https://github.com/jaredpalmer/formik/issues/1476](https://github.com/jaredpalmer/formik/issues/1476) je otevřené již 3 roky a release hooku vypadá zatím v nedohlednu (snad ve Formiku v3 ).
2. Formik má momentálně bug, který způsobuje infinity loop při volání `helpers.setValue` uvnitř `useEffect()`. Stejný bug se děje i při volání `validateForm()` uvnitř `useEffect()` a radší nechci vědět při čem dalším... Bug se vyskytuje sice "pouze" v kombinaci s Reactem 18 (mimochodem sranda debuggovat ), ten však jako momentálně aktuální verzi používáme. GitHub open issue: [https://github.com/jaredpalmer/formik/issues/3602](https://github.com/jaredpalmer/formik/issues/3602) Tento bug lze maximálně pouze ČÁSTEČNĚ eliminovat ošklivým workaroundem a jeho existence prakticky znemožňuje vytvořit některé funkcionality ve formuláři. Na NN to je např. spouštění imperativní validace formu v `useEffect()` .
3. Nemožnost použít `<ErrorMessage />` komponentu pro zobrazení `<FieldArray />` errorů. Místo toho se musí napsat vlastní krkolomné řešení. Tohoto problému jsou si vědomi sami autoři Formiku: [https://formik.org/docs/api/fieldarray#fieldarray-validation-gotchas](https://formik.org/docs/api/fieldarray#fieldarray-validation-gotchas)
4. Performance [https://react-hook-form.com/](https://react-hook-form.com/)
5. Neexistuje `useFastField` hook (https://github.com/jaredpalmer/formik/pull/1772)
6. `setFieldValue()` apod. funkce jsou asynchronní, ale nevrací promisu, takže nejde nějak rozumně čekat na jejich dokončení. (https://github.com/jaredpalmer/formik/issues/529)
7. Na check, zda se změnily defaultní values neexistuje žádné built-in řešení https://github.com/jaredpalmer/formik/issues/3612, RHF má naproti tomu `isDirty` prop, která toto řeší.
