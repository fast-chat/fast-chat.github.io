import index<IndexView, IndexModel, ThisNotification>;


IndexController {
    constructor() {
        this.isLoadined = false;
        this.view = new IndexView();
        console.log(this.view);
        this.model = new IndexModel();
        
	    this.notification = new ThisNotification();
        this.view.onAddMessage = obj => {
            this.model.messages.add(obj);
        } 

        // collection.where('name', '==', 'edik').onSnapshot(data => {
        this.model.messages.onSnapshot(data => {
            var _data = data.docChanges().map(d => d.doc.data());
            _data = _data.sort(( a, b ) => {
                if ( a.timestamp < b.timestamp ){
                    return -1;
                } 
                if ( a.timestamp > b.timestamp ){
                    return 1;
                } 
                return 0;
            })
            _data.forEach(i => {
                if (this.isLoadined)
                    this.notification.notify(i.name, i.message);
                this.view.addMessage(JSON.stringify(i));
            })
            this.isLoadined = true;
            console.log(_data)
        });

        console.log('this.model', this.model)
    }
}