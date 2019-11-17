import index<IndexController>;

Main {
	console.log('function main is init');
	
	this.controller = new IndexController();
	
	this.controller.initFireBase();
}
