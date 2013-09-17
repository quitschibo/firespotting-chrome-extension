var firstRequest = true;
// function to update the news feed in background. will look out for new ideas
// every 60 seconds.
function startRequest() {
	UpdateIfReady(firstRequest);
	firstRequest = false;
	window.setTimeout(startRequest, 60000);
}

// block for showing the initial notification, to explain the user the extension
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

// start the background loop
startRequest();
