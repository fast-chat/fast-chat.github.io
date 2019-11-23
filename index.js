import index<IndexController>;

Main {
	$.css('css/style.css');
	this.controller = new IndexController();

	var messaging = firebase.messaging();
	messaging.requestPermission()
	.then(() => {
		console.log('Have permission');
		return messaging.getToken();
	})
	.then(token => {
		console.log(token);
	})
	.catch(err => {
		console.log('Error Ocored.');
	})

	messaging.onMessage(pay => {
		console.log('onMessage: ', pay);
	})
}
