---
title: Generating React components
tags:
  - Generators
type: Tool
---

PLOP: [https://www.npmjs.com/package/plop](https://www.npmjs.com/package/plop)

Next.js must use aliases, default option - src - is OK (we do not want to use relative paths in the generator)

Do not forget to generate a storybook template if needed.

TODO DETAILS 4 JUNIORS

## How to install Plop:

- `npm install --save-dev plop`
- Create `plop-templates` folder
- Create template file with `.hbs` suffix inside this folder: ⬇️

### Our TSX component template:

```tsx
export interface {{pascalCase name}}Props {}

function {{pascalCase name}}({}: {{pascalCase name}}Props): JSX.Element {
return <></>;
}

export default {{pascalCase name}};
```

- Create a configuration file `plopfile.js` in the root of the project.

### Our configuration file:

```tsx
module.exports = (plop) => {
		const currentPath = process.env.INIT_CWD;
	plop.setGenerator("component-folder-root", {
		description: "Create a component inside a /component folder",
		// User input prompts provided as arguments to the template
		prompts: [
			{
				// Raw text input
				type: "input",
				// Variable name for this input
				name: "name",
				// Prompt to display on command line
				message: "What is your component name?",
			},
		],
		actions: [
			{
				// Add a new file
				type: "add",
				// Path for the new file
				path: "src/components/{{pascalCase name}}/index.tsx",
				// Handlebars template used to generate content of new file
				templateFile: "plop-templates/Component.tsx.hbs",
			},
		],
	});

	plop.setGenerator("component-folder-relative", {
		description: "Create a folder component inside a current folder",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is your component name?",
			},
		],
		actions: [
			{
				type: "add",
				path: currentPath + "/{{pascalCase name}}/index.tsx",
				templateFile: "plop-templates/Component.tsx.hbs",
			},
		],
	});

	plop.setGenerator("component", {
		description: "Create a component inside a current folder",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "What is your component name?",
			},
		],
		actions: [
			{
				type: "add",
				path: currentPath + '/index.js',
				templateFile: "plop-templates/Component.tsx.hbs",
			},
		],
	});
};
```

## How to use

- Add new script into `package.json`:
- `"generate": "plop"`
- Run as `npm run generate component`
