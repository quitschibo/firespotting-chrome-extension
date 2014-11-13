var firstRequest = true;
function startRequest() {
	// this function MUST BE called just once!
	if (firstRequest) {
		setNotificationListener();
	}

	UpdateIfReady(firstRequest);
	firstRequest = false;
	window.setTimeout(startRequest, 60000);
}

/**
 * Function for setting the listener for the notifications. This function will be called once.
 */
function setNotificationListener() {
	// notification onClick function
	chrome.notifications.onClicked.addListener(function () {

		// open link
		window.open(localStorage.getItem('FS.LastNotificationUrl'));
		//chrome.notifications.clear();
	});
}

if (localStorage["FS.Notifications"] == null) {
	// TODO: html notifications don't work anymore. port it to simple notifications or delete it
	//var notification = webkitNotifications.createHTMLNotification("initialNotification.html");
	//notification.show();
	localStorage["FS.Notifications"] = true;
}
//If any options are not already set, they will be set to defaults here
SetInitialOption("FS.RequestInterval", 1200000);
SetInitialOption("FS.BackgroundTabs", false);
SetInitialOption("FS.NotificationTimeout", 5000);

startRequest();
