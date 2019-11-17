import index<IndexView>;

IndexController {
    constructor() {
        this.view = new IndexView();
        console.log(this.view);
        // Array.from({length: 1}, (i, k) => k).map(i => {
        //     this.view.addMessage(i + 'zklxcbv kzxbcv');
        // })

        // IndexController.initFireBase();
    }

    public initFireBase () {
        console.log('init firebase');
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
        var collection = firestore.collection("edik");
        
        var data = collection.doc("edik");

        this.view.onAddMessage = obj => {
            console.log('message in collection', obj);
            collection.add(obj);
        } 
        // === add
        // function addData(obj) {
        //     collection.add(obj);
        // };
    
        // === listen
    
        // collection.where('name', '==', 'edik').onSnapshot(data => {
        collection.onSnapshot(data => {
            var _data = data.docChanges().map(d => d.doc.data());
            // console.log("collection.onSnapshot::", _data);
            _data.forEach(i => {
                this.view.addMessage(JSON.stringify(i));
            })
        });
    
    
    
        // === read get where
        // collection.where('name', '==', 'edik').get().then(e => {
        // collection.get().then(e => {
        //     var _data = e.docs.map(d=>d.data());
        //     // console.log(_data);
        // });
    }
}