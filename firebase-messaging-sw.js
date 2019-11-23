importScripts('lib/firebase.js');
var config = {
    apiKey: "AIzaSyAnLD5Hcpa-oBDBbrWulV7jKUpxcPHjeaY",
    authDomain: "my-project-1-18726.firebaseapp.com",
    databaseURL: "https://my-project-1-18726.firebaseio.com",
    projectId: "my-project-1-18726",
    storageBucket: "my-project-1-18726.appspot.com",
    messagingSenderId: "266216698283"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();
console.log('sw::messaging', messaging);
messaging.setBackgroundMessageHandler(function(payload) {
    const title = 'Hello World';
    const options = {
        body: payload.data.status
    };
    return self.ServiceWorkerRegistration.showNotification(title, options);
})