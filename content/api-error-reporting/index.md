---
title: Api error reporting
tags:
  - Error Handling
  - React Query
type:
  - Tutorial / How To
---

add global onError function

```jsx
const queryCache = new QueryCache({
  onError: (error) => {
    Sentry.captureException(error)
  }
})

const queryClient = new QueryClient({
  queryCache,
});
```
