---
title: Setup Gatsby for Android TWA
url: "https://developers.google.com/web/android/trusted-web-activity"
tags:
  - Gatsby
  - Start a project
type:
  - Tutorial / How To
  - Archived
---

Why: Android TWA are apks / appBundles, which means that in TWA, we can extend the core web app by native screens and logic, if needed. Also, if set up correctly, the web part of TWA will have the addressBar hidden, making the app feel more native.

Following are the steps required for a working TWA setup:

1. **Adjust `gatsby-config.js` to enable PWA/TWA**
    
    Update the `gatsby-plugin-manifest` plugin accordingly:
    
    ```jsx
    {
    	resolve: `gatsby-plugin-manifest`,
    	options: {
    		name: `synetech-blog-pwa`,
    		short_name: `syneblog-pwa`,
    		start_url: `/cs/blog`,
    		background_color: `#663399`,
    		theme_color: `#663399`,
    		display: `minimal-ui`,
    		icon: `src/images/synetech-logo-white.svg`, // This path is relative to the root of the site.
        related_applications: [
    			{
    				platform: "play",
    				id: "cz.synetech.twademo"
    			},
    			{
    				platform: "play",
    				id: "cz.synetech.twademo.dev"
    			},
    			{
    				platform: "webapp",
    				url:
    					"https://synetech.cz/manifest.webmanifest"
    			}
    		]
    	}
    }
    ```
    
    When adding the page as PWA to home screen, either the value of `name` or `short_name` is used as the name for the PWA. The value of `theme_color` will be applied as the color of the PWA's/TWA's appBar. `display` defines the PWA's/TWA's display mode, see [https://superpwa.com/doc/web-app-manifest-display-modes/](https://superpwa.com/doc/web-app-manifest-display-modes/) for better understanding. `related_applications` is list of related apps (../i.e.%20TWA/PWA), used to detect if those apps are already installed on current device. This is just an extension and is not needed to enable PWA/TWA, but it is a useful feature which will be explained later.
    
    To enable PWA/TWA, a service worker must be included. For that, add `gatsby-plugin-offline` into the config, and remove `gatsby-plugin-remove-serviceworker` if it was part of the config.
    
    Remove `gatsby-plugin-favicon` if it was part of the config, as it was causing a wrong manifest to be applied.
    
2. **Create `assetlinks.json` file to verify relationship between the website and the Android app**
    
    
    In the `static` folder, create new folder (if not created yet) name `.well-known`, and in there create new file named `assetlinks.json`. In that file, define the relationship with the Android app as follow:
    
    ```json
    o get the sha256 signing key, navigate to the Android TWA app's project folder and execute:
    keytool -list -v -keystore <path_to_key_store.jks>
    Copy the sha256 signing key from the output.[  
    	{
        "relation": [
          "delegate_permission/common.handle_all_urls"
        ],
        "target": {
          "namespace": "android_app",
          "package_name": "cz.synetech.twademo",
          "sha256_cert_fingerprints": [
            "..."
          ]
        }
      }, {
        "relation": [
          "delegate_permission/common.handle_all_urls"
        ],
        "target": {
          "namespace": "android_app",
          "package_name": "cz.synetech.twademo.dev",
          "sha256_cert_fingerprints": [
            "..."
          ]
        }
      }
    ]
    ```
    
    Replace `cz.synetech.twademo` with your Android app's package name. List all relevant build variants if necessary (e.g. `cz.synetech.twademo.dev`). For each build variant, fill in the corresponding `sha256` signing key. To get the `sha256` signing key, navigate to the Android TWA app's project folder and execute:
    
    ```
    keytool -list -v -keystore <path_to_key_store.jks>
    ```
    
    Copy the `sha256` signing key from the output.
    
3. **Set up the Android TWA app**
    - TBA

## Additional setups

We want to install PWA and TWA manually from our page, by some buttons for example. To trigger PWA installation, we need to intercept a somewhat like `add-to-home-screen` event that is received when we enter our page, and store that event and trigger it with manually on user's action (i.e. button press). To intercept and store the event:

```jsx
const [promptInstall, setPromptInstall] = useState(null);
const [pwaButtonEnabled, setPwaButtonEnabled] = useState(false);

useEffect(() => {
  window.addEventListener("beforeinstallprompt", event => {
	  event.preventDefault();
		console.log("beforeinstallprompt called");
		setPromptInstall(event);
    // flag pwa installation button to be visible only after this event was called
    setPwaButtonEnabled(true);
  });
}, []);
```

To trigger PWA installation, trigger the stored event:

```jsx
const onInstallPwaClick = () => {
  console.log("Showing install-pwa prompt...");
  if (promptInstall) {
	  promptInstall.prompt();
	} else {
		console.log("promptInstall is null");		
  }
};

...

return(
  ...
  pwaButtonEnabled && (
    <button key="install_pwa" onClick={onInstallPwaClick}>
	    Install PWA
    </button>
  )
  ..
)
```

Also see Best practices on how to promote user to install PWA [https://web.dev/promote-install/](https://web.dev/promote-install/).

Note: `beforeinstallprompt` event is only available in Chrome and Edge: [https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent](https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) .

To trigger TWA installation, we need to redirect the user to the App Store, from where the user can install the TWA app like any other Android app.

We mentioned `related_applications` as part of the `gatsby-plugin-manifest` and that it is used to detect wether PWA or TWA is already installed on current device, in which case we would hide the corresponding installation buttons.

```jsx
related_applications: [
			{
				platform: "play",
				id: "cz.synetech.twademo"
			},
			{
				platform: "play",
				id: "cz.synetech.twademo.dev"
			},
			{
				platform: "webapp",
				url:
					"https://synetech.cz/manifest.webmanifest"
			}
		]
```

A related Android TWA app is defined by `platform: "play"` and `id: <app-package-name>`. Replace `cz.synetech.twademo` in the example by your app's package name, also list all relevant build variants. A related PWA app is defined by `platform: "webapp"` and the url to its `webmanifest`. `related_applications` lists all apps that are related to our page domain. To detect which of the related apps are currently installed on the current device, do:

```jsx
const [isPwaInstalled, setIsPwaInstalled] = useState(false);
const [isTwaInstalled, setIsTwaInstalled] = useState(false);

useEffect(() => {
  ...
  if ("getInstalledRelatedApps" in navigator) {
	  navigator.getInstalledRelatedApps().then(relatedApps => {
      // relatedApps should contain all currently installed apps that are also listed in related_applications
			relatedApps.forEach(app => {
			  console.log("Found an app!");
				console.log(app.id, app.platform, app.url);
				if (app.id && app.id.includes("cz.synetech.twademo")) {
				  setIsTwaInstalled(true);
				} else if (
				    app.url &&
						app.url.includes("synetech.cz")
				) {
						setIsPwaInstalled(true);
				}
      });
    });
  }
}, []);

// use isPwaInstalled and isTwaInstalled to switch visibility of installation buttons
```

Note: `getInstalledRelatedApps` is available only in Chrome.
