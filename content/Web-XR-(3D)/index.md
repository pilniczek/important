---
title: Web XR (3D)
---

### About

WebXR is a group of standards which are used together to support rendering 3D scenes to hardware designed for presenting virtual worlds (virtual reality, or VR), or for adding graphical imagery to the real world, (augmented reality, or AR). The WebXR Device API implements the core of the WebXR feature set, managing the selection of output devices, render the 3D scene to the chosen device at the appropriate frame rate, and manage motion vectors created using input controllers.

[https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)

Available on: Chrome, Edge, Opera, Chrome for Android

WebXR is available on Firefox behind the flag `dom.vr.webxr.enabled`. Stable Firefox on Android release does not allow users to alter flags (or enter advanced settings for that matter).

[https://caniuse.com/webxr](https://caniuse.com/webxr)

### Get Started

To implement augmented reality features for web, first import these libraries:

```bash
npm install react-xr
npm install three react-three-fiber
```

For details about the libraries, visit:

- [https://github.com/pmndrs/react-xr](https://github.com/pmndrs/react-xr)
- [https://github.com/pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber)

### Model import

Import the AR model file (tested for `.glb` and `.gltf`) you want to showcase into your project, under `static` folder.

Create `Model` component that will handle loading and user interaction with the imported model.

```jsx
// this is Model.tsx file

import * as React from "react"
import { useLoader, useFrame } from "react-three-fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Hover, Select } from "react-xr"
import { useCallback, useEffect, useState } from "react"
import * as THREE from "three"

export default () => {
	const suplik = useLoader(
		GLTFLoader,
    // models/suplik.glb should be under `static` folder
		"models/suplik.glb"
	)

  // initial position in regards of x,y,z axis
	suplik.scene.position.set(0, 0, 0)

	const onSelect = useCallback(() => {
		// todo: trigger an action when user taps on the model
	}, [])

	return (
		<Select onSelect={onSelect}>
			<primitive object={suplik.scene} />
		</Select>
	)
}
```

Models can have animations. To execute an animation, do:

```jsx
// this is Model.tsx file

import ...

export default (props) => {
 const suplik = useLoader(
  GLTFLoader,
  "models/suplik.glb"
 )

 suplik.scene.position.set(0, 0, -3)

 let animationAction = null

 // object needed to execute animation
 const [mixer] = useState(() => {
  const tempMixer = new THREE.AnimationMixer(suplik.scene)
  return tempMixer
 })

 const onSelect = useCallback(() => {
  if (animationAction != null) {
   animationAction.stop()
  }
  // trigger the animation when user taps on the model
  animationAction = mixer.clipAction(suplik.animations[0]).setLoop(THREE.LoopOnce, 1)
  animationAction.clampWhenFinished = true
  animationAction.play()
 }, [])

 useFrame((state, delta) => {
  mixer.update(delta)
 })

 return (
  <Select onSelect={onSelect}>
   <primitive object={suplik.scene} />
  </Select>
 )
}
```

`animationAction.clampWhenFinished` is a flag, which, if set to true, the animation will automatically be paused on its last frame. For details to `AnimationAction`, see [https://threejs.org/docs/#api/en/animation/AnimationAction](https://threejs.org/docs/#api/en/animation/AnimationAction).

### Starting AR session

Next step is to integrate the model component to the webpage. For that, create `Scene` component which will show a button to enter AR session, if AR is supported on current browser, or a disabled button saying AR is not supported on current browser. Once the button is clicked,  fullscreen AR session is displayed and the model is rendered.

```jsx
// this is Scene.tsx file

import * as React from "react"
import { Hover, Select, ARCanvas, DefaultXRControllers } from "react-xr"
import { useState, useCallback, Suspense, useEffect } from "react"
import styled from "styled-components"
import { ARButton } from "three/examples/jsm/webxr/ARButton"
import Model from "./Model"

// a fallback model if the model from `Model.tsx` failed to load
function Box() {
	return (
		<mesh>
			<boxBufferGeometry attach="geometry" args={[50, 50, 50]} />
			<meshStandardMaterial attach="material" />
		</mesh>
	)
}

export default () => {
 const [xrSupported, setXrSupported] = useState(false)

 useEffect(() => {
  if (navigator.xr) {
   // check if AR is supported
   navigator.xr.isSessionSupported("immersive-vr").then(isSupported => {
    if (isSupported) {
     setXrSupported(true)
    } else {
     alert("Web AR not supported")
    }
   })
  } else {
   alert("Web AR not supported")
  }
 }, [])

 return (
  <>
   {xrSupported && (
    <ARCanvas>
     <ambientLight intensity={0.5} />
     <spotLight intensity={0.8} position={[300, 300, 400]} />
     <ARButton />
     <DefaultXRControllers />
     <Suspense fallback={<Box />}>
		  <Model />
		 </Suspense>
    </ARCanvas>
   )}
  </>
 )
}
```

The default `ARButton` internally handles initialization of an AR session. A shortcoming of the default `ARButton` is that there are no callbacks, hence we are not able to react on events like session start or session end. Therefore, we write our own `MyARButton`:

```jsx
// this is `MyARButton.js` file

var MyARButton = {

  createButton: function ( renderer, sessionInit = {},
      onXrStart = {},
      onXrEnd = {}
   ) {

   function showStartAR( /*device*/ ) {

     var currentSession = null;

     function onSessionStarted( session ) {

      session.addEventListener( 'end', onSessionEnded );
      ...
      onXrStart()
     }

     function onSessionEnded( /*event*/ ) {
      ...
      onXrEnd()
     }

     ...
};

export { MyARButton };
```

Our custom component is the exact copy of the `three` library's `ARButton` (see [https://github.com/mrdoob/three.js/blob/dev/examples/jsm/webxr/ARButton.js](https://github.com/mrdoob/three.js/blob/dev/examples/jsm/webxr/ARButton.js)), except for the added callbacks, that are triggered when the AR session is started and when that session is ended. This will help us in later stages.

### AR screen overlay

By default, when the AR session is triggered, a fullscreen AR scene is displayed, with feed from device's camera. To overlay the screen with HTML elements, alter the `Scene.tsx` file:

```jsx
import * as React from "react"
import { Hover, Select, ARCanvas, DefaultXRControllers } from "react-xr"
import { useState, useCallback, Suspense, useEffect } from "react"
import styled from "styled-components"
import { MyARButton } from "./MyARButton"
import Model from "./Model"

const StyledOverlay = styled.div`
 .overlay {
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
 }
 .buttonsContainer {
  display: none;
  justify-content: center;
  position: absolute;
  background: red;
  bottom: 0;
  width: 100%;
  height: 100px;
 }
 .loaderContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: white;
  width: 100%;
  height: 100%;
 }
 .loader {
  background: white;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
 }
`

...

export default () => {
  ...

  // variable to refer to the current ar session
  const [sessionInit, setSessionInit] = useState(null)

	useEffect(() => {
		if (navigator.xr) {
			navigator.xr.isSessionSupported("immersive-vr").then(isSupported => {
				if (isSupported) {
					setXrSupported(true)
          // define reference to the overlay
					const overlay = document.getElementById("overlay")
          // create an ar session with this overlay, which will allow elements
          // of the overlay to be visible above the AR full-screen
					const session = {
						optionalFeatures: ["dom-overlay"],
						domOverlay: { root: overlay },
					}
					setSessionInit(session)
				} else {
					alert("Web AR not supported")
				}
			})
		} else {
			alert("Web AR not supported")
		}
	}, [])

	const onXrStarted = () => {
		console.log("XR started")
    // on session start, make the elements of the overlay visible,
    // as they are by default set to invisible by `.buttonsContainer` style
		document.getElementById("buttonsContainer").style.display = "flex"
		console.log("loading started")
	}

	const onXrEnded = () => {
		console.log("XR ended")
    // on session end, make the elements of the overlay invisible, otherwise
    // they would stay visible on the web page holding this `Scene` component.
		document.getElementById("buttonsContainer").style.display = "none"
	}

	return (
		<>
			<StyledOverlay>
				<div id="overlay" className="overlay">
					{(
						<div id="buttonsContainer" className="buttonsContainer">
							<button onClick={onLeftClicked}>Left button</button>
							<button onClick={onRightClicked}>Right button</button>
						</div>
					)}
				</div>
			</StyledOverlay>
			{xrSupported && (
				<ARCanvas
					onCreated={({ gl }) =>
						void document.body.appendChild(
              // Instruct `MyARButton` to start our custom defined session when clicked
							MyARButton.createButton(gl, sessionInit, onXrStarted, onXrEnded)
						)
					}
				>
					<ambientLight intensity={0.5} />
					<spotLight intensity={0.8} position={[300, 300, 400]} />
					<DefaultXRControllers />
							<Suspense fallback={<Box />}>
								<Model />
							</Suspense>
				</ARCanvas>
			)}
		</>
	)
}
```

### Interaction between overlay elements and the AR model

We can also interact with the AR model using elements from the overlay. Say we want to have 2 buttons on the overlay, 1 to rotate the model left, 1 to rotate the model right. We want such feature as rotating the model by fingers did not work. To achieve this feature, update the `Model.tsx` file:

```jsx
import ...

export default (props) => {
 const suplik = useLoader(
  GLTFLoader,
  "models/suplik.glb"
 )

 suplik.scene.position.set(0, 0, -3)
 // execute rotation through props
 suplik.scene.rotateY(props.yRotation.rotation)

 ...

 return (
  <Select onSelect={onSelect}>
   <primitive object={suplik.scene} />
  </Select>
 )
}
```

Then, update the `Scene.tsx` file:

```jsx
import ...

...

export default () => {
 ...

 const [yRotation, setYRotation] = useState({
  increment: 0,
  rotation: 0,
 })

 const onRotateLeftClicked = event => {
  console.log("Rotate left")
  const newRotation = {
   increment: yRotation.increment + 1, // id of the current rotation, to identify that this is a new rotation and that the model should update
   rotation: -0.17, // 0.17 radian ~ 10 degrees
  }
  setYRotation(newRotation)
 }

 const onRotateRightClicked = event => {
  console.log("Rotate right")
  const newRotation = {
   increment: yRotation.increment + 1,
   rotation: 0.17, // 0.17 radian ~ 10 degrees
  }
  setYRotation(newRotation)
 }

 return (
  <>
   <StyledOverlay>
    
   </StyledOverlay>
   {xrSupported && (
    <ARCanvas ... >
     ...
     <DefaultXRControllers />
       <Suspense fallback={<Box />}>
        <Model yRotation={yRotation} />
       </Suspense>
    </ARCanvas>
   )}
  </>
 )
}
```

Test for working rotations.

### WebXR on Android / IOS

Only tested on Android. So far, only browsers Chrome and Samsung Internet are capable of providing WebXR. On mobile devices however, there is the option of native XR sdks. The native XR sdk on Android for example, offers additional feature like surface detection. We explored this solution and integrated it to the web app as follow: if on mobile device, try to open a related native app with corresponding XR screen, instead of starting a webXR session. To start a specific screen of the related native app, first update the Android app's `AndroidManifest.xml` file:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="cz.synetech.twavision">

    <uses-permission ... />

    <application
        android:name="..."
        ... >

        ...
        <!-- the activity/screen you want to open from your web app, in our case the activity implementing XR features -->
        <activity android:name="app.package.name.ArActivity">
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />

                <!-- define custom URI that will trigger this activity/screen -->
                <data
                    android:host="app.synevision.cz"
                    android:path="/ar/"
                    android:scheme="app" />
            </intent-filter>
        </activity>

        ...
        <meta-data android:name="com.google.ar.core" android:value="required" />

    </application>

</manifest>
```

Then, in your web app, alter the code for redirecting user to the XR-featured page. For example, if the code looked like this:

```jsx
return(
  ...
  <div>
    <Link to="/arpage">To web AR</Link>
  </div>
  ...
);
```

update it as follow:

```jsx
const [isMobile, setIsMobile] = useState(false)

// todo: set `isMobile` and `isMobileAppInstalled` correctly, in `useEffect()`

return(
  {!isMobile && (<Link to="/arpage">To web AR</Link>)}
  {isMobile && (
     // following the `intent:/` is the custom URI, path and scheme matching the ones defined in the Android app's manifest file
     <a href="intent:/app.synevision.cz/ar#Intent;scheme=app;package=your.android.app.package.name;S.browser_fallback_url=html_encoded_link_to_app_store;end">
		   To native AR screen
		 </a>
   )}
  ...
);
```
