---
title: VSCode Snippets
tags:
  - IDE
type: How To
section: Main
releaseDate: 2026-06-11
---

User-defined snippets for VSCode. For the rest of the IDE config see [[vscode-setup|VSCode Setup]].

## How snippets work

**Path to global snippets:**

- `C:\Users\<your-windows-user>\AppData\Roaming\Code\User\snippets` (Win)
- `/home/<your-user>/.config/Code/User/snippets` (Ubuntu)

Example:

```json
"Print to console": {
  "scope": "javascript,typescript",
  "prefix": "log",
  "body": [
    "console.log('$1');",
    "$2"
  ],
  "description": "Log output to console"
}
```

- **Docs:** https://code.visualstudio.com/docs/editor/userdefinedsnippets
- **TIP:** generator at https://snippet-generator.app/
- **HTML-email snippet libraries:** https://litmus.com/community/snippets ·
  https://litmus.com/blog/the-ultimate-guide-to-using-snippets-in-email-design

## React

```json
{
	"react set state": {
		"prefix": "setState",
		"body": [
			"const [${1:__name__}, set${1/(^.)/${1:/upcase}/}] = useState(${2});", // https://stackoverflow.com/questions/51272365/vs-code-how-to-convert-snippet-placeholder-to-uppercase-or-lowercase
		],
		"description": "react component"
	},
	"react use effect": {
		"prefix": "useEffect",
		"body": [
			"useEffect(() => {",
			"\tconsole.log('mounted')",
			"\treturn () => {",
			"\t\tconsole.log('unmounted')",
			"\t};",
			"}, [${__check_changes_props__}]);",
		],
		"description": "react component"
	},
	"react component": {
		"prefix": "rcomponent",
		"body": [
			"",
		],
		"description": "react component"
	},
	"react pure component": {
		"prefix": "rpcomponent",
		"body": [
			"",
		],
		"description": "react pure component"
	},
  "react functional component": {
    "prefix": "rfcomponentTS",
    "body": [
      "import * as React from 'react';",
      "",
      "export interface ${1:__name__}Props {",
      "\t${2:__props__}",
      "}",
      "",
      "const ${1:__name__} = ({",
      "\t${2:__props__},",
      "\t...rest",
      "}: ${1:__name__}Props): JSX.Element => {",
      "\treturn ();",
      "};",
      "",
      "export default ${1:__name__};",
    ],
    "description": "react functional component"
  },
	"react memoized component": {
		"prefix": "rmcomponent",
		"body": [
			"",
		],
		"description": "react memoized component"
	},
	"storybook": {
		"prefix": "sb",
		"body": [
			"import React from 'react';",
			"import { ${1:__what__} } from '${2:__where__}';",
			"export default {",
			"\tcomponent: ${1:__what__},",
			"\ttitle: 'Components/${1:__what__}',",
			"};",
			"const ${1:__what__}Template = (args) => <${1:__what__} {...args} />;",
			"export const ${1:__what__}Component = ${1:__what__}Template.bind({});",
			"${1:__what__}Component.args = {",
			"\tchildren: 'Something',",
			"};",
		]
	}
}
```

## FE utils

```json
{
	"console log": {
		"prefix": "cl",
		"body": [
			"console.log('log ${1:__var_name__}: ', ${1:__var_name__})",
		],
		"description": "Console Log"
	},
	"modern document ready": {
		"prefix": "docready",
		"body": [
			"document.addEventListener('DOMContentLoaded', function(event) {/* IE gt 8 */",
			"\t${1:__do_something__}",
			"});",
		],
		"description": "modern document ready"
	},
	"svg main markup": {
		"prefix": "svg",
		"body": [
			"<svg",
			"\txmlns=\"http://www.w3.org/2000/svg\"",
			"\txmlns:xlink=\"http://www.w3.org/1999/xlink\"",
			"\tviewBox=\"0 0 ${1:__vBx__} ${2:__vBy__}\"",
			">",
			"\t<defs>",
			"\t\t<g id=\"__my_id__\">",
			"\t\t</g>",
			"\t</defs>",
			"\t<use xlink:href=\"#__my_id__\" transform=\"translate(__x__ __y__)\" />",
			"\t$0",
			"</svg>",
		],
		"description": "svg main markup"
	},
  "email table": {
    "prefix": "etable",
    "body": [
      "<table class='$1' width='100%' border='0' cellspacing='0' cellpadding='0'><!-- no padding, no margin -->",
      "\t<tbody>",
      "\t\t<tr>",
      "\t\t\t<td>",
      "\t\t\t\t$0",
      "\t\t\t</td>",
      "\t\t</tr>",
      "\t</tbody>",
      "</table> <!-- / $1 -->"
    ],
    "description": "email table"
  },
  "email image": {
    "prefix": "eimg",
    "body": [
      "<img width=\"${1:__width__}px\" height=\"${2:__height__}px\" alt=\"${3:__alt_text__}\">"
    ],
    "description": "email image"
  }
}
```
