IndexModel {
    constructor () {
        console.log('init IndexModel');
        var config = {
            apiKey: "AIzaSyAnLD5Hcpa-oBDBbrWulV7jKUpxcPHjeaY",
            authDomain: "my-project-1-18726.firebaseapp.com",
            databaseURL: "https://my-project-1-18726.firebaseio.com",
            projectId: "my-project-1-18726",
            storageBucket: "my-project-1-18726.appspot.com",
            messagingSenderId: "266216698283"
        };
        firebase.initializeApp(config);

        var firestore = firebase.firestore();
        this.messages = firestore.collection("messages");
        this.rooms = firestore.collection("room");
        this.users = firestore.collection("users");
        
    }
}