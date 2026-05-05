---
title: React/TanStack Query
tags:
  - API
type: Tool
---

This library is DATA MANAGEMENT tool NOT data fetching tool you need to write your custom fetching functions and Query will manage its state in app cache.

Query is super easy to use in combination with OpenApi generator if you have a REST backend. If you have a Graphql backend switch into Apollo Client. It is easer to use Query with REST backend than Apollo Client.

One hard thing are the fetch keys. If you have a simple backned and you do not need to combine data from different endpoints, it's super easy to come up with keys. On the other hand if you need to combine data from different endpoints for example simple list of tags which you receive for each blog post from endpoint (`/posts`) returning list of blog posts without blogpost detail. This tag list use on page blog post detail before you receive response from blog post detail endpoint (`/posts/1236547`). Can be super challanging to come up with keys.

```tsx
const result = useQuery("categories", categoryApi.getCategories)
if(result.isLoading) return <Skeleton />
if(result.isSuccess) return ...
```

`isLoading`, `isSuccess` etc. are must have in Typescript instead you will receive bunch of eslint warnings about that the [`result.data`](http://result.data) is optional.

Usefull practice is to create custom hooks for each `useQuery` typically in directory `src/queryHooks/`

## Customization and hooks

[https://drive.google.com/file/d/1VJnLOJ0kz6dQBuw3tG53hHH5O9FBQIYs/view?usp=sharing](https://drive.google.com/file/d/1VJnLOJ0kz6dQBuw3tG53hHH5O9FBQIYs/view?usp=sharing)
