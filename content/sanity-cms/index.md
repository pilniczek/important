---
title: Sanity CMS
tags:
  - Form
  - CMS
type:
  - Tool
  - Archived
---

## How to use FieldArrays with react-hook-form

If you need to store data as an array type you have to connect the data structure which Sanity use ([https://www.sanity.io/docs/array-type#24df1f63370c](https://www.sanity.io/docs/array-type#24df1f63370c)) and which react-hook-form use ([https://react-hook-form.com/api/usefieldarray](https://react-hook-form.com/api/usefieldarray)).

React-hook-form always use data structure like (even for arrays of strings (not objects)):

```jsx
[
	{name: "Jablko", value: "", id: "e72789af-461d-4e36-af21-10528b47042d"}
	{name: "Hruška", value: "", id: "c2a6538b-7601-42c7-b326-7db7faa7016b"}
]
```

But Sanity can store these data as a simple one-level array of strings:

```jsx
["Jablko", "Hruška"]
```

So you can try remap these two incompatible formats (array of strings vs array of objects) to fit each other, but the better idea is to store even these simple data in Sanity like array of objects structure:

```jsx
[
	{name: "Jablko"},
	{name: "Hruška"}
]
```

If you do that, you don´t need to do any mapping from array of strings to array of object and vice versa between react-hook-form and Sanity. And what’s more, if you will need to upgrade the structure in the future like:

```jsx
[
	{name: "Jablko", color: "red"},
	{name: "Hruška", color: "yellow"}
]
```

You won’t need to do much changes in your code and what’s more, Sanity will not give you errors that your previously stored data are stored in incompatible data structure with the newly created data, so you won´t need to run any data migration.
