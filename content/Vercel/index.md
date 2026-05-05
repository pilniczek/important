---
title: Vercel
tags:
  - Next
---

Manual deploy pipeline settings:

```
deploy_preview:
  stage: deploy
  only:
    - merge_requests
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=preview --token=$VERCEL_TOKEN
    - vercel build --token=$VERCEL_TOKEN
    - vercel deploy --prebuilt  --token=$VERCEL_TOKEN

deploy_acc:
  stage: deploy
  only:
    - acc
  script:
    - npm install --global vercel
    - vercel pull --yes --environment=production --token=$VERCEL_TOKEN
    - vercel build --prod --token=$VERCEL_TOKEN
    - vercel deploy --prebuilt --prod --force --token=$VERCEL_TOKEN
```

More info about manual deploy via pipeline here: [https://vercel.com/guides/how-can-i-use-gitlab-pipelines-with-vercel](https://vercel.com/guides/how-can-i-use-gitlab-pipelines-with-vercel)
