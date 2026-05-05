---
title: PWA x WebView x React Native
tags:
  - WebView
---

## PWA

Progressive web application (PWA) is a way to let your website be installable on user device without the need of them to go to app store.

It is relatively new technology compared to other ways of writing an app.

For your website to be “installable” you need to satisfy 3 conditions

1. Use HTTPS protocol
2. Have manifest file
3. Have service worker

If PWAs are written well, the speed is comparable to app written in non-native language like React native.

Service worker is a background process that runs without user interaction. For more information visit [medium.com](https://medium.com/commencis/what-is-service-worker-4f8dc478f0b9) which goes more in-depth into this. Generally speaking it is a process which helps run the browser javascript. You can use it to run push notifications and other things, even if there is no browser opened or the specific site window is closed.

### pros

- is simple to implement if the base website is responsive and has good design
- is really cheap to implement compared to other choices
- cross-platform compatibility out of the box because this technology uses device specific web browser to render it’s content
- can work offline if it is programmed in a way that doesn’t need internet (ex. sending an email can not be done offline)
    - if it does need internet, it (the request) is kept in service worker until internet is available
- can be registered in Google play store

### cons

- limited native API’s (camera, fingerprint etc…)
- can’t be registered in App store (Apple claims those apps are not “App like” enough to be registered there, along with security reasons)
- not as secure as native apps or apps written specifically for the device (even in React Native or other frameworks)
- If installed from the browser window it will not be transfered onto new phone

## Webview

Technology was introduced as a way for apps to show content from other sources and external sites without the need to go to exit the current app. 

It uses own browser-like API for rendering content, and can ask platform specific browser for some more functionality.

There not that many apps written as pure and clean web-view.

One example of such application could be Google’s search bar on Android, which uses application called “Google” where when you type some search query and click a link, you are presented with webview.

### pros

- are kind of multi-platform (if you can get this app to App store)
- easier to implement

### cons

- needs internet to provide functionality
- ~~can not be registered in App store (security reasons mostly, as Apple can’t verify all content the app uses)~~

## React Native

Is java-script based framework develop by Facebook for it’s own purposes of mobile app development and later on published as opensource.

Developer writes code in javascript and react components, those are then replaced with platform specific components during the compiling process. This makes multi-platform development much easier and faster, as you only need one code base for most of the application and only small changes occur if you go with platform specific components in the main code base (which you should not do).

For more specific information about differences between React Native and Flutter you can check out [this blog post](https://blog.udemy.com/flutter-vs-react-native/), or [this blog on visitech.com](https://visetech.org/react-native-vs-flutter/) which has more in-depth comparison. 

### pros

- decent (not same) speed compared to applications written in native language
- all API features (a lot of them are wrapped in third-party libraries)
- cheaper compared to native apps
- uses platform specific UI components

### cons

- users need to install the application from App store
- app size is bigger than native apps

## Flutter

Is framework for mobile app development introduced by Google in 2017. Unlike React native, Flutter uses `Dart` programming language.

~~Flutter has it’s own UI components, which are drawn using Flutter drawing engine and they try to closely match the native UI components. This means that programmer doesn’t have to write code for iOS and Android separately as it will be taken care of while compiling~~

Flutter has it’s own UI components, which are drawn using Flutter’s custom drawing engine. Design used by the components is [material design](https://material.io/develop/flutter) developed again by Google. 

Own drawing engine means that the components are drawn on “canvas” by the engine instead of the OS calls to draw some native component. It also implies that it draws the components all the same across all platforms and versions. So if we update our Android or iOS version and the native elements behavior or style changes, on flutter applications there are no visible changes.

If we take a look at [google trends](https://trends.google.com/trends/explore?cat=31&date=today%205-y&q=flutter,react%20native,pwa) we can see that Flutter is relatively more trending than RN or PWA. From that we could assume that the community around Flutter is constantly growing.

### pros

- ~~all~~ most native API’s usually through third party libraries
- uses it’s own UI components which try to look as native components
- better animations compared to react native
- will be accepted to any app store

### cons

- smaller community as it is relatively new framework
- app size is bigger than native apps
- slightly more complex
- no changes between OS updates

## Native Applications

Native applications are applications written in platform native language. They are the fastest applications you can get on the specific platform thanks to that. But that also means you have to write new code-base for each platform, as they don’t share the same native language.

Summary of the problem:

- more code → more work → more time → costs more

As said above, both Apple and Google use different programming languages as native ones.

### Apple

For Apple it used to be `objective c` but that changed in 2014 when Apple released `Swift` programming language, which is since then used to write native applications for iOS. You can still write applications in objective-c, but why do in older language when you have more modern alternative ready. Swift is made so it [can run](https://developer.apple.com/documentation/swift/importing-objective-c-into-swift) objective-c code too.

### Google (Android)

On android the native language used to be `Java`. But in May 2019 Google announced that `Kotlin` is now the go-to programming language for native app development on Android. Kotlin was developed by JetBrains and first introduced in 2011 as an alternative to Java. It is designed to interoperate with Java, and the Kotlin JVM depends on some Java libraries.

### pros

- fastest applications on specific platform
- small bundle size
- all API features
- will be accepted to any app store

### cons

- needs for more code bases
- takes more time to write the application for more platforms (thanks to the code base)
- costs more to have the application on multiple platforms
- you could need more people if you want to write it quickly
- more people needed (if we consider that one person tends to focus on one platform)

# Testik

[Test example](Test-example/index.md)
