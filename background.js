var firstRequest = true;
function startRequest() {
	UpdateIfReady(firstRequest);
	firstRequest = false;
	window.setTimeout(startRequest, 60000);
}

if (localStorage["FS.Notifications"] == null) {
  var notification = webkitNotifications.createHTMLNotification("initialNotification.html");
  notification.show();
  localStorage["FS.Notifications"] = false;
}
//If any options are not already set, they will be set to defaults here
SetInitialOption("FS.RequestInterval", 1200000);
SetInitialOption("FS.BackgroundTabs", false);

startRequest();
