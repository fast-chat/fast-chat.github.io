import index<IndexController,ThisNotification>;

Main {
	$.css('css/style.css');
	this.notification = new ThisNotification();
	this.controller = new IndexController();
}
