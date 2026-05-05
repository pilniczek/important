---
title: prettier-eslint
---

prettier-eslint plugin for VSCode (https://github.com/idahogurl/vs-code-prettier-eslint) lints internally via `prettier-eslint-cli` (https://github.com/prettier/prettier-eslint-cli) and there is one problem with this setup:

`prettier-eslint` has a different set of default prettier rules than `prettier` itself ([https://github.com/prettier/prettier-eslint#technical-details](https://github.com/prettier/prettier-eslint#technical-details)) so if you lint via `prettier` you can get different output than when you lint via `prettier-eslint` in some cases. You can fight against this by running `prettier-eslint` in pre-commit hook instead of `prettier` or even better you can set all prettier rules explicitly in .`prettierrc` file and then there will be no conflicts between `prettier` and `prettier-eslint` because you basically rewrites all default values by the config.

Finally make sure you have `prettier` in `.eslintrc` `"extends"` to make sure you will have no conflicts between prettier and eslint formatting rules. Also remember that `"rules"` always “wins” over `"extends"` , so also don’t forget to delete all formating rules from `.eslintrc`.

!!! prettier-eslint currently needs to be in `prettier@^2.5.1` version, if you will try to use prettier v3 you will run into this issue https://github.com/prettier/prettier-eslint/issues/920
