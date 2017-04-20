'use strict';

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  console.log('[Service Worker] Push Received.');
    var title = 'Push Message';
   // var body = 'Got message';
  var icon = '/images/icon-192x192.png';
  var tag = 'simple-push-demo-notification-tag';

   if (event.data) {
    
	event.waitUntil(
		self.registration.showNotification(title, {
		  body: event.data.text(),
		  icon: icon,
		  tag: tag
		})
	  );
    }
  /*event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );*/
});

self.addEventListener('pushsubscriptionlost', function(event) {
  console.log('Push subscription lost' + event);
});

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event);
  event.notification.close();

  event.waitUntil(
    clients.openWindow('https://hitgubsenthil.github.io/TestProgressiveWeb.github.io/')
  );
});
