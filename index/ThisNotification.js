ThisNotification {
    constructor () {
        Notification.requestPermission().then(permissionThen);
    }
    public notify(login, message) {
        sendNotification(login, {
            body: message,
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
            try {

                var notification = new Notification(title, options);
            } catch (err) {
                navigator.serviceWorker.ready.then(function(registration) {
                    registration.showNotification(title, options);
                });
            } 
        } else { 
            alert('Вы запретили показывать уведомления');
        };
    }
    sendNotification(title, options) {
        try {
            if (!window['Notification']) {
                console.log('OOPS!')
            } else if (Notification.permission === "granted") {
                var notification = new Notification(title, options);
                notification.onclick = clickFunc;
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission(requestPermission);
            };
        } catch (err) {
           Notification.requestPermission(function(result) {
                if (result === 'granted') {
                    navigator.serviceWorker.ready.then(function(registration) {
                        registration.showNotification(title, options);
                    });
                } 
           });
        } 
    }
}