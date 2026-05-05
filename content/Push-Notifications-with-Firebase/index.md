---
title: Push Notifications with Firebase
---

To set up web push notifications using Firebase, follow these steps.

1. **Create a Firebase app** 
    
    In [https://console.firebase.google.com/](https://console.firebase.google.com/), add new Firebase project. Click `Add app` → `Web`. Enter app name and click `continue to console` (skip the copy-script step). Once the web app is added, go to settings of that app (click on settings icon next to the app icon). Click the `Cloud Messaging` tab, and there, go to the `Web configuration` section and click `generate key pair`. A so called VAPID key-pair will be generated, the firebase interface will display the pair's public key, which we will need later to set up push notifications for our page.
    
2. **Set up connection to the firebase app**
    
    You will need the generated public VAPID key and the configuration of the firebase app. To get the configuration, navigate to your `Project settings` → `General`, in the section `Your apps` navigate to your web app, and copy the `firebaseConfig` object. Then, in your regular web app project, create convenience functions to provide the firebase instance with firebase messaging.
    
    ```jsx
    // copy of firebaseConfig object from the firebase app
    const config = {
     apiKey: "...",
     authDomain: "...",
     databaseURL: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "...",
     measurementId: "..."
    };
    
    let instance;
    
    export default async function getFirebase() {
     if (typeof window !== "undefined") {
      if (instance) return instance;
    
      const firebase = await import("firebase");
    
      instance = firebase.initializeApp(config);
      return instance;
     }
    
     return null;
    }
    ```
    
    ```jsx
    import getFirebase from "...";
    
    // copy of the generated public VAPID key
    const publicVapidKey = "...";
    
    let instance;
    
    export default async function getMessaging() {
     if (typeof window !== "undefined") {
      if (instance) return instance;
      const firebase = await getFirebase();
      const messaging = firebase.messaging();
      messaging.usePublicVapidKey(publicKey);
      messaging.onTokenRefresh(() => {
       // todo: handle token refresh
      });
      // receive push notifications when app is in foreground
      messaging.onMessage(payload => {
       const notification = JSON.stringify(payload.notification);
       console.log(`Message received. ${notification}`);
       alert(`Notification received! ${notification}`);
      });
      instance = messaging;
      return instance;
     }
     return null;
    }
    ```
    
3. **Receive push notifications when app is in background**
    
    With `onMessage` defined in `getMessaging()`, we are prepared to receive push notifications when our web app is in foreground (i.e. our web page is visible to the user). To receive push notifications while the app is in background (inactive tab) however, we have to include a service worker. For that, add new file named `firebase-messaging-sw.js` into the `static` folder, with following content:
    
    ```jsx
    // the imported version should match the firebase version listed in package.json
    importScripts("https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js");
    importScripts(
     "https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js"
    );
    
    firebase.initializeApp(
     // copy of the firebase app's configuration object
     {
      apiKey: "...",
      authDomain: "...",
      databaseURL: "...",
      projectId: "...",
      storageBucket: "...",
      messagingSenderId: "...",
      appId: "...",
      measurementId: "..."
     }
    );
    
    const messaging = firebase.messaging();
    
    messaging.setBackgroundMessageHandler(function(payload) {
     console.log(
      "Received background message ",
      payload
     );
     
     const notificationTitle = payload.notification.title;
     const notificationOptions = {
      body: payload.notification.body,
      icon: "/app-logo.png"
     };
    
     return self.registration.showNotification(
      notificationTitle,
      notificationOptions
     );
    });
    ```
    
4. **Allow notifications**
    
    Now that we have receiving and handling of incoming push notifications set up, we want to ask user to allow notifications. First, we need to check if the current browser supports push notifications:
    
    ```jsx
    if (!("serviceWorker" in navigator)) {
      alert(
       "Service Worker isn't supported on this browser, cannot receive notifications."
      );
     } else if (!("PushManager" in window)) {
      alert(
       "Push isn't supported on this browser, cannot receive notifications."
      );
     } else {
      askToAllowNotifications();
     }
    };
    ```
    
    If it does, we continue to ask user to allow notifications:
    
    ```jsx
    function askToAllowNotifications() {
     return new Promise(function(resolve, reject) {
      // pop up the alert to allow/block notifications
      const permissionResult = Notification.requestPermission(function(result) {
       resolve(result);
      });
    
      if (permissionResult) {
       permissionResult.then(resolve, reject);
      }
     }).then(function(permissionResult) {
      // check user's choice
      if (permissionResult !== "granted") {
       throw new Error("We weren't granted permission.");
      } else {
       console.log("Permission granted!");
       return subscribeUserToPush();
      }
     });
    }
    ```
    
    If the user allows notifications, we request a token for this user's current browser instance. The token is then used as identification which is used for the delivery of the push notification to correct receiver.
    
    ```jsx
    import getMessaging from "...";
    
    async function subscribeUserToPush() {
     const messaging = await getMessaging();
     return messaging
      .getToken()
      .then(currentToken => {
       if (currentToken) {
        console.log(currentToken);
        // todo: store token to our server, for push notification delivery purpose
       } else {
        console.log("Could not retrieve token.");
       }
      })
      .catch(err => {
       console.log("An error occurred while retrieving token. ", err);
      });
    }
    ```
    
5. **Testing**
    
    Test that our setup is working. First, make sure that the "allow/block notification" alert is popping up, and that a token is received if user allows notifications. Copy the token. Then, go to the firebase project → `Cloud messaging` → `Send your first message`, you should see an interface to create and send a push notification. Enter title and text, hit `Send test message` and use the copied token as the FCM token, then click test. Check that both foreground and background notifications are working.
    
6. **Availability**
    
    Tested on Android mobile device:
    
    *only Chrome browser:*
    
    web app in current tab → custom notification / alert shown (handled by `onMessage`)
    
    web app in non-current tab → notification received as system notification, in the notification center
    
    browser in background or even killed → notification received as system notification, in the notification center
    
    *only PWA using Chrome:*
    
    same token received
    
    PWA in foreground → custom notification / alert shown
    
    PWA in background → notification received as system notification, in the notification center
    
    *only TWA using Chrome:*
    
    same as above
    
    *any combination of browser/pwa/twa, with 1 on foreground and others in background:*
    
    The app on foreground receives the push notification and custom notification / alert is shown, no background notification received. If any of the apps that was in background is brought to the foreground, that app receives the same push again and the same custom notification / alert is shown again. If multiple foreground notifications were received by the app that was in foreground first, the other app that was newly brought to the foreground will receive and show the same number of foreground notifications.
    
    *multiple apps in background, none on foreground:*
    
    Background notifications are received and shown as system notifications, no duplications.
    
    *only Opera browser:*
    
    same as only Chrome browser
    
    further issue: pop-up alert to enable notification is not shown, instead the permission is rejected by default, and an alert is shown to change this default behavior, but only for few seconds, then disappears and nver shows again. We are able to intercept the default rejection event, in which case we should show an instruction for users to manually enable notifications in the browser's settings.
    
    *only PWA:*
    
    same as only PWA using Chrome
    
    *only TWA:*
    
    app does NOT open with custom tab, instead the Opera browser is opened!!!
    
    *any combination of browser/pwa/twa, with 1 on foreground and others in background:*
    
    Same as for Chrome
    
    *multiple apps in background, none on foreground:*
    
    Same as for Chrome
    
    *only Firefox browser:*
    
    The "allow notifications" alert requires user interaction to trigger, otherwise it will throw error (see [https://stackoverflow.com/questions/61475486/notification-requestpermission-throwing-error-on-mozilla](https://stackoverflow.com/questions/61475486/notification-requestpermission-throwing-error-on-mozilla)). 
    
    web app in current tab → custom notification / alert shown (handled by `onMessage`)
    
    web app in non-current tab → notification received as system notification, in the notification center
    
    browser in background → notification received as system notification, in the notification center
    
    browser killed → no notifications received
    
    *only PWA:*
    
    same token received
    
    PWA in foreground → custom notification / alert shown
    
    PWA in background → notification received as system notification, in the notification center
    
    *only TWA:*
    
    same as above
    
    *multiple apps in background, none on foreground:*
    
    Background notifications are received and shown as system notifications, no duplications.
    
    *none in background or on foreground:*
    
    No notifications received
    
    *any combination of browser/pwa/twa, with 1 on foreground and others in background:*
    
    The app on foreground receives the push notification and custom notification / alert is shown, no background notification received. If any of the apps that was in background is brought to the foreground, no push notification is duplicated.
    
    only Edge browser / TWA / PWA:
    
    Ran into this exact issue: [https://stackoverflow.com/questions/61407799/web-push-notifications-in-microsoft-edge-on-android-not-working](https://stackoverflow.com/questions/61407799/web-push-notifications-in-microsoft-edge-on-android-not-working)
    
    No solution found yet
