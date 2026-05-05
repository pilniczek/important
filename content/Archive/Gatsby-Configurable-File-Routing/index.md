---
title: Gatsby Configurable File Routing
---

1. Convert each page from a structure `src/pages/MyPage.tsx` to a structure `src/pages/MyPage/index.tsx` and `src/pages/MyPage/config.json`.
2. Use the content of a page as usual.
3. Use this config template (you often do not need the `maybe-client-route` part):
    
    ```jsx
    {
      "type": "pageConfig",
      "page": "MyPage", // must be the same as folder name!
      "url": "/my-page-translated-name/maybe-client-route",
      "match": "/my-page-translated-name/:maybe-client-route",
      "additionalProps": {
    		// any page related props, project specific
    	}
    }
    ```
    
4. You need an onCreatePage function in `gatsby-node` to allow the usage of the config:
    
    ```jsx
    export const onCreatePage: GatsbyNode["onCreatePage"] = ({ page, actions, getNodes }): void => {
    	const { createPage, deletePage } = actions;
    
    	const pagePath = "src/pages/";
    	const pathStart = page.component.indexOf(pagePath);
    	const isPageConfigured = pathStart > -1;
    
    	const pageFolderName = isPageConfigured
    		? page.component
    				.slice(pathStart)
    				.replace(pagePath, "")
    				.replace("/index.tsx", "") // does not catch src/pages/index.tsx
    				.replace("index.tsx", "index") // for src/pages/index.tsx
    		: undefined;
    
    	if (pageFolderName !== undefined) {
    		deletePage(page);
    
    		const metadata = getNodes("allPageConfig")
    			.filter((item) => item.type === "pageConfig" && pageFolderName === item.page)
    			.map((item) => {
    				const relevantProps = {
    					url: item.url,
    					additionalProps: item.additionalProps,
    					match: item.match,
    				};
    				return relevantProps;
    			})[0];
    
    		createPage({
    			...page,
    			path: metadata.url,
    			matchPath: metadata.match,
    			context: {
    				...page.context,
    				...metadata,
    			},
    		});
    	}
    };
    ```
    
5. Add a bugfix for pages whose URL starts with a number (e.g. `404 - not found`). The hack is part of plugins in `gatsby-config`:
    
    ```jsx
    {
    		resolve: `gatsby-transformer-json`,
    		options: {
    			typeName: ({ node, object }: typeNameProps): string => {
    				/*
    				 *	This function is the original one
    				 *	_.upperFirst(_.camelCase(`${path.basename(node.dir)} Json`))
    				 *	but without lodash.
    				 *	The original function is taken from
    				 *	https://github.com/gatsbyjs/gatsby/blob/c20d6f68c485467898ba82f79450c356b26f6ec1/packages/gatsby-transformer-json/src/gatsby-node.js.
    				 *	The "x" before name starting with number fixes errors like:
    				 *	GraphQL request:1:4
    				 *		| 404Json
    				 *		|    ^'. Stacktrace was 'GraphQLError: Syntax Error: Invalid number, expected digit but got: "J".
    				 *	solution is discussed here https://github.com/gatsbyjs/gatsby/issues/20596#issuecomment-591946695
    				 */
    				const newTypeNameRoot = path
    					.basename(node.dir)
    					.split(/[^\w]/g)
    					.map((item) => `${item.charAt(0).toUpperCase()}${item.slice(1)}`)
    					.join("");
    				const isPageConfig = object?.type === "pageConfig";
    				if (isPageConfig) {
    					return `PageConfig`;
    				}
    				return startsWithNumber(newTypeNameRoot) ? `x${newTypeNameRoot}Json` : `${newTypeNameRoot}Json`;
    			},
    		},
    	},
    ```
    
6.
