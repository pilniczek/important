---
title: 5. Start a project - Error boundary
tags:
  - Start a project
  - Error Handling
type:
  - Tutorial / How To
---

`app/global-error.tsx`  with Sentry

```jsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const substitudeReset = () => window.location.reload()

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  
  return (
    <html>
      <body>
        <button onClick={() => substitudeReset()}>Reset</button>
      </body>
    </html>
  );
}
```

- Catch-all error boundary, reset function does not work in the next version 14.1.0, solved by hard reload - [Issue](https://github.com/vercel/next.js/issues/55462#issuecomment-1896098700)

`app/error.tsx`

```jsx
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  
  return (
    <html>
      <body>
        <button onClick={() => reset()}>Reset</button>
      </body>
    </html>
  );
}
```

- folder based error boundary, catches everything except `app/layout.tsx` + `app/template.tsx`
- Has a higher priority than `global-error` , the reset function works here
