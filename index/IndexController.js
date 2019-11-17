import index<IndexView,IndexModel>;

IndexController {
    constructor() {
        this.view = new IndexView();
        console.log(this.view);
        this.model = new IndexModel();
        
        this.view.onAddMessage = obj => {
            this.model.messages.add(obj);
        } 

        // collection.where('name', '==', 'edik').onSnapshot(data => {
        this.model.messages.onSnapshot(data => {
            var _data = data.docChanges().map(d => d.doc.data());
            
            _data.forEach(i => {
                this.view.addMessage(JSON.stringify(i));
            })
        });

        console.log('this.model', this.model)
    }
}