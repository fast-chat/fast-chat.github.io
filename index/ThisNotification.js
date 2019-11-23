ThisNotification {
    constructor () {
        Notification.requestPermission().then((result) => {
            console.log('Notification', result);
        });
 
        this.sendNotification('Верните Линуса!', {
            body: 'Тестирование HTML5 Notifications',
            icon: 'images/icons/icon-512x512.png',
            dir: 'auto'
        });
    } 
    public sendNotification(title, options) {
        if (!window["Notification"]) {
            alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
        } else if (Notification.permission === "granted") {
            var notification = new Notification(title, options);
            function clickFunc() {
                alert('Пользователь кликнул на уведомление');  
            };
            notification.onclick = clickFunc;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission((permission) => {
                if (permission === "granted") {
                    var notification = new Notification(title, options);
                } else {
                    alert('Вы запретили показывать уведомления');  
                };
            });
        } 
    }
}