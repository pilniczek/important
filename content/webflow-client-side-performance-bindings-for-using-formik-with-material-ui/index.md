---
title: Bindings for using Formik with Material-UI
tags:
  - Form
  - Material UI
type:
  - Tutorial / How To
  - Archived
---

Fromik Mui Documentation - [https://stackworx.github.io/formik-mui/](https://stackworx.github.io/formik-mui/)

Formik Mui -   [Code Sandbox](https://codesandbox.io/s/915qlr56rp)  

Why  is  it good to use ? 

1) You can use Yup validation and it will work as good as always - here is an  example of using Fromik Mui + Yup -  [https://codesandbox.io/s/silent-breeze-2bksrg?file=/src/index.tsx](https://codesandbox.io/s/silent-breeze-2bksrg?file=/src/index.tsx)

2) No need to use useField hook and optios which are connected with this hook , you need just use 

```jsx
<Field component = "componentNameFromMUI" />
```

and it will work .

3) If you use “big” component like DatePicker you can modify smaller part of this component like textField right inside this Field with DatePicker -  [https://stackworx.github.io/formik-mui/docs/api/mui-lab#datepicker](https://stackworx.github.io/formik-mui/docs/api/mui-lab#datepicker)

Where to pay attention  ?

In imports , import all components which you will use as  

```jsx
component = "componentNameFromMUI" 
```

from right library . It won’t be MUI anymore  , it will be “formik-mui” or  “formik-mui-lab”

 Why it is not as good as can be ?

Because of validation …

 in this library inside of every component you can see “default” validation/behavior  - like here [https://github.com/stackworx/formik-mui/blob/main/packages/formik-mui/src/Select.tsx](https://github.com/stackworx/formik-mui/blob/main/packages/formik-mui/src/Select.tsx)

Select component wich has “default behavior”  on line 55  you can see

```jsx
 "setFieldTouched([field.name](http://field.name/), true, true)"
```

if you want to change it , you should rewrite this part inside this component  - [https://codesandbox.io/s/silent-breeze-2bksrg?file=/src/index.tsx](https://codesandbox.io/s/silent-breeze-2bksrg?file=/src/index.tsx) (line 156) 

```jsx
onClose={() => {
setFieldTouched('tags', true, false);
}})
```

BUT each  component has different validation/behavior  inside ,  so  if you want to change it you need to open 

[https://github.com/stackworx/formik-mui/tree/main/packages](https://github.com/stackworx/formik-mui/tree/main/packages) find your component , and then change it in your code .

One more exapmle with DatePicker -  [https://github.com/stackworx/formik-mui/blob/main/packages/formik-mui-lab/src/DatePicker.tsx](https://github.com/stackworx/formik-mui/blob/main/packages/formik-mui-lab/src/DatePicker.tsx) on lines 48 and 60 you can see default validation/behavior  onChange and OnBlur , so if you want to change it you should rewrite this part inside your component like this —- >

```
<Box>
  <Field
    component={DatePicker}
    name={name}
    label={label}
    variant="outlined"
    mask="__.__.____"
    onChange={(date) => {
      setFieldTouched(name, true, false);
      if (date !== null) {
        setFieldValue(name, date, false);
      }
    }}
    inputProps={{
      placeholder: placeholder,
    }}
    textField={{
      color: "active",
      onBlur: () => {
        setFieldTouched(name, true, false);
      },
    }}
    {...props}
  />
</Box>
```

and in this case you need use `useFormikContext()` instead of not use `useField()` hook 

and don’t forget to add . nullable() into your Yup to get right error  in your date .

```
date: Yup.date()
  .required("Povinné pole")
  .nullable()
  .typeError("Neplatný formát data")
  .min(new Date(), "Datum musí být pozdější než dnes"),
```

So use it or not to use …
