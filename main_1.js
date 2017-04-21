'use strict';

//var API_KEY = 'AIzaSyC6ZRFSEdPIxRckf7kVvH3iYmWRGr3gXOo'; -- API KEY

//var API_KEY = 'AIzaSyAFYofRVQTif4Me76woecz_6Oqafct5iNM'; -- Server Legacy KEY

var API_KEY = 'AAAAJnXPhQo:APA91bG2NlchvQSn8jE-JE4_5fWMh7U3DtpSBtAA0rHpFaOP7H6E5ictfTMrcb-NbIQqC_gjrPvoz_5VWiSri86hNrDkUnY_Mmgc0lXY_KLADl-r46XIEYpPA1_jJJwUWEJ8ahJrH0h4';

var isPushEnabled = false;

var serviceWorkerRegistration= null;

var endpointWithSubscriptionId = null;

function sendToServer(subscriptionId, endpoint) {
	alert("send to server");
	endpointWithSubscriptionId = endpoint;
  // The curl command to trigger a push message straight from GCM
  var curlCommand = 'curl --header "Authorization: key=' + API_KEY +
    '" --header Content-Type:"application/json" ' + endpoint + 
    ' -d "{\\"registration_ids\\":[\\"' + subscriptionId + '\\"]}"';

  // Below is a curl command to test sending a push message
  console.log(curlCommand);
}

function unsubscribe() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription().then(
      function(pushSubscription) {
        // Check we have a subscribtion to unsubscribe
        if (!pushSubscription) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          isPushEnabled = false;
          pushButton.disabled = false;
          return;
        }
        
        // We have a subcription, so call unsubscribe on it
        pushSubscription.unsubscribe().then(function(successful) {
          // TODO: Make a request to your server to remove
          // the user from your data store so you don't attempt
          // to send them push messages anymore

          pushButton.disabled = false;
          pushButton.textContent = 'Enable Push Messages';
          isPushEnabled = false;

          if (!successful) {
            console.error('We were unable to unregister from push');
            return;
          }
        }).catch(function(e) {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove 
          // the users data from your data store and 
          // inform the user that you disabled push

          console.log('Unsubscribtion error: ', e);
          pushButton.disabled = false;
        });
      }).catch(function(e) {
        console.error('Error thrown while unsubscribing from push messaging.', e);
      });
  });
}


function subscribeToPushManager() {
  // Disable the button so it can't be changed while
  // we process the permission request
  
  var pushButton = document.querySelector('.js-push-button');
  //pushButton.disabled = true;

 // navigator.serviceWorker.ready
  //.then(function() {

    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        // The subscription was successful
       // isPushEnabled = true;
		//alert("p256 :" +  subscription.getKey('p256dh'));
		//alert("auth :" + subscription.getKey('auth'));
		
	    var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
		var p256key = rawKey ?
        btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
        '';
		var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
		var authSecret = rawAuthSecret ?
               btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
               '';
        // TODO: Send the subscriptionId and Endpoint to your server
        // and save it to send a push message at a later date
        var subscriptionId = subscription.subscriptionId;
        var endpoint = subscription.endpoint;
		var arr = { 
				"Endpoint" : endpoint,
			 "P256" : p256key,
			 "Auth" : authSecret
			};
		
		$.ajax({
			url: 'https://pwawebapi.azurewebsites.net/api/house/create',
			type: 'POST',			
			data: JSON.stringify(arr),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json',
			async: false,
			success: function(msg) {
				//alert(msg);
			},
			error: function(msg){
				alert(msg.responseText);
			}
		});
	
        //sendToServer(subscriptionId, endpoint);
        
        pushButton.textContent = 'Disable Push Messages';
        pushButton.disabled = false;
      })
      .catch(function(e) {
		alert(e.message);
        if (Notification.permission === 'denied') {
          // The user denied the notification permission which
          // means we failed to subscribe and the user will need
          // to manually cahnge the notification permission to
          // subscribe to push messages
          console.warn('Permission for Notifications was denied');
          //pushButton.disabled = true;
        } else {
          // A problem occured with the subscribtion, this can
          // often be down to an issue or lack of the gcm_sender_id
          // and / or gcm_user_visible_only
          console.error('Unable to subscribe to push.', e);
          pushButton.disabled = false;
        }
      });
  //});
}

// Once the service worker is registered set the initial state
function initialiseState() {
//alert("notification");
  // Are Notifications supported?
  if (!('Notification' in window)) {
    console.warn('Notifications aren\'t supported.');
    return;
  }

  // Check the current Notification permission.
  // If its denied, it's a permanent block until the
  // user changes the permission
  if (Notification.permission === 'denied') {
    console.warn('The user has blocked notifications.');
    return;
  }

  // Check if push messaging is supported
  if (!('PushManager' in window)) {
    console.warn('Push messaging isn\'t supported.');
    return;
  }
  
  // We need the service worker to be registered and activated
  // to test for push messaging support
  navigator.serviceWorker.ready
  .then(function() {
	// Do we already have a push message scubscription?
    serviceWorkerRegistration.pushManager.getSubscription()
      .then(function(subscription) {
	    if(!subscription)
	  {
			subscribeToPushManager();	
	  }
	  else
	  {
			// Enable any UI which subscribes / unsubscribes from
			// push messages
			var rawKey = subscription.getKey ? subscription.getKey('p256dh') : '';
			var p256key = rawKey ?
					btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey))) :
					 '';
			var rawAuthSecret = subscription.getKey ? subscription.getKey('auth') : '';
			var authSecret = rawAuthSecret ?
				   btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret))) :
				   '';
			// TODO: Send the subscriptionId and Endpoint to your server
			// and save it to send a push message at a later date
			var subscriptionId = subscription.subscriptionId;
			var endpoint = subscription.endpoint;
			var arr = { 
				"Endpoint" : endpoint,
				 "P256" : p256key,
				 "Auth" : authSecret
				};
			
			$.ajax({
				url: 'https://pwawebapi.azurewebsites.net/api/house/create',
				type: 'POST',			
				data: JSON.stringify(arr),
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				async: false,
				success: function(msg) {
					//alert(msg);
				},
				error: function(msg){
					alert(msg.responseText);
				}
			});
			endpointWithSubscriptionId = subscription.endpoint;
			var pushButton = document.querySelector('.js-push-button');
			pushButton.disabled = false;

			if (!subscription) {
			  // We aren’t subscribed to push, so set UI
			  // to allow the user to enable push
			  return;
			}

			// Set your UI to show they have subscribed for
			// push messages
			pushButton.textContent = 'Disable Push Messages';
			//isPushEnabled = true;
      }
      })

      .catch(function(err) {
        console.warn('Error during getSubscription()', err);
      });
  })
  .catch(function(err) {
  console.log("error on sw.ready" ,err);
  });
}


window.addEventListener('load', function() {
  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function() {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribeToPushManager();
    }
  });

  // Check that service workers are supported, if so, progressively
  // enhance and add push messaging support, otherwise continue without it.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(swreg) {
	  serviceWorkerRegistration = swreg;
      initialiseState();
    });
  } else {
    console.log('Service workers aren\'t supported in this browser.');
  }
});

function pushMessage()
{
	var to_subid = null;

	if(endpointWithSubscriptionId != null)
	{

		var mySplitResult = endpointWithSubscriptionId.split("/");
		if (mySplitResult.length>0)
		 to_subid= mySplitResult[mySplitResult.length-1];
	}
	else{
		alert('End point is null');
	}

	var arr = { 
	
	"notification": {
					"title": "Portugal vs. Denmark",
					"body" : "5 to 1"
				  },
  "to" : to_subid
  };

  alert(JSON.stringify(arr));
  $.ajax({
    url: 'https://fcm.googleapis.com/fcm/send',
    type: 'POST',			
	headers: {Authorization:'key=AAAAJnXPhQo:APA91bG2NlchvQSn8jE-JE4_5fWMh7U3DtpSBtAA0rHpFaOP7H6E5ictfTMrcb-NbIQqC_gjrPvoz_5VWiSri86hNrDkUnY_Mmgc0lXY_KLADl-r46XIEYpPA1_jJJwUWEJ8ahJrH0h4'},
    data: JSON.stringify(arr),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function(msg) {
        alert(msg);
    },
	error: function(msg){
		alert(msg.responseText);
	}
});
}
