# Settings

GUI for editing settings. In 1.27. access the JSON settings editor, either by using the command Open Settings (JSON) or by changing your default settings editor with the "workbench.settings.editor" setting.

```
"editor.insertSpaces": false, // is potential danger
"editor.detectIndentation": false, // is potential danger
"files.trimTrailingWhitespace": true, // is potential danger
```

**TIP:** Copy & paste settings.json.

# Extensions

`code --list-extensions`

`code --install-extension`

**TIP:** In extensions.md replace `* ` with given installation command and paste everything into terminal.

# Custom snippets

Insert into `C:\Users\${user_name}\AppData\Roaming\Code\User\snippets`. (Or where is your VSCode installed...)

Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope is left empty or omitted, the snippet gets applied to all languages. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:

`$1`, `$2` for tab stops, `$0` for the final cursor position, and `${1:label}`, `${2:another}` for placeholders. Placeholders with the same ids are connected.

Example:
```
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

**TIP:** https://snippet-generator.app/
