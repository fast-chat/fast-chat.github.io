ThisNotification {
    constructor () {
        Notification.requestPermission().then(permissionThen);
 
        sendNotification('Верните Линуса!', {
            body: 'Тестирование HTML5 Notifications',
            icon: 'images/icons/icon-512x512.png',
            dir: 'auto' 
        });
    }
    permissionThen (result) {
        console.log('Notification', result);
    }
    clickFunc () {
        alert('Пользователь кликнул на уведомление');  
    }
    requestPermission (permission) {
        if (permission === "granted") {        
           var notification = new Notification(title, options);
        } else { 
            alert('Вы запретили показывать уведомления');
        };
    }
    sendNotification(title, options) {
        if (!window["Notification"]) {
            alert('Ваш браузер не поддерживает HTML Notifications, его необходимо обновить.');
        } else if (Notification.permission === "granted") {
            var notification = new Notification(title, options);
            notification.onclick = clickFunc;
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission(requestPermission);
        };
    }
}