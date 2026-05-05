---
title: Husky
tags:
  - Linting
  - GIT
type:
  - How To
---

Husky is a package that allows you to define git hooks in a git repository. This is very helpful because you can’t distribute git hooks via a remote git repository for security reasons. With Husky, you can define, which hooks you want to use on a project and according to this config, every developer can run husky and so automatically “inject” these hooks into the local repository. 

You can set up husky as you wish for different use cases. We use husky only to run ESLint in the pre-commit hook. This can be set up manually but it’s time-consuming and error-prone, that’s why we use a setup script, which does the hard work for us:

`npx mrm@2 lint-staged`

This command will do the following:

1. Installs `husky` ([https://www.npmjs.com/package/husky](https://www.npmjs.com/package/husky)) and `lint-staged` ([https://www.npmjs.com/package/lint-staged](https://www.npmjs.com/package/lint-staged)). For short, `lint-staged` is a package that runs commands only against staged files. This boosts performance because the ESLint check can be done only on changed files (there is no reason to check already checked files with no changes). 
2. Adds husky install script into the `prepare` script of `scripts` section in `package.json`. This will guarantee that every new developer on a project will automatically install Husky after executing `npm i`  command.

```jsonc
  "scripts": {
    "prepare": "husky",
  },
```

(Husky v9+ runs as a bare `husky` command. Older v4–v8 setups used `husky install .husky`; if you see that in an existing repo, it's the legacy form.)

3. Creates `./.husky` folder in the root of a project containing the definition of the pre-commit hook:
4. Adds command which is executed as a pre-commit hook into `package.json`:

    ```jsx
    "lint-staged": {
    	"{*.js,*.json,*.ts,*.tsx,.eslintrc}": "eslint --cache --fix"
    }
    ```

## Troubleshooting

Husky is assuming that you are running it in the project root. When you have a project where the FE folder is not the root of the project (for example there exists also BE folder in the same folder structure level), you have to do some modification of the pre-generated husky setup: [https://typicode.github.io/husky/#/?id=custom-directory](https://typicode.github.io/husky/#/?id=custom-directory)

If you have issues during `npm i`, this might help:
[https://stackoverflow.com/questions/67063993/sh-husky-command-not-found#answer-69651692](https://stackoverflow.com/questions/67063993/sh-husky-command-not-found#answer-69651692)

## Bypassing hook

The hook will not trigger in these 2 cases, which we know about so far:

1. After the project is freshly cloned and `npm i` wasn’t executed yet.
2. Commit with `--no-verify` flag.
