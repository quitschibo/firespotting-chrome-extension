// function will be executed, when user opens options page
$(function(){
	restoreOptions();
	// options should be saved within every change
	$('.notifications-radio, .background-tabs-radio, #RequestInterval, #NotificationTimeout').change(function(){
		saveOptions();
	});
});

var selectReqInterval;
var radioNotifications;
var radioBackgroundTabs;
var selectNotificationTimeout;

function initVariables() {
	selectReqInterval = document.getElementById("RequestInterval");
	radioNotifications = document.getElementsByName("Notifications");
	radioBackgroundTabs = document.getElementsByName("BackgroundTabs");
	selectNotificationTimeout = document.getElementById("NotificationTimeout");
}

// make all options visible for the user
function restoreOptions() {
	initVariables();
	var reqInterval = localStorage["FS.RequestInterval"];
	for (var i = 0; i < selectReqInterval.children.length; i++) {
		if (selectReqInterval[i].value == reqInterval) {
			selectReqInterval[i].selected = "true";
			break;
		}
	}
	var notifications = localStorage["FS.Notifications"];
	for (var i = 0; i < radioNotifications.length; i++) {
		if (radioNotifications[i].value == notifications) {
			radioNotifications[i].checked = "true";
		}
	}
	var backgroundTabs = localStorage["FS.BackgroundTabs"];
	for (var i = 0; i < radioBackgroundTabs.length; i++) {
		if (radioBackgroundTabs[i].value == backgroundTabs) {
			radioBackgroundTabs[i].checked = "true";
		}
	}
	var notificationTimeout = localStorage["FS.NotificationTimeout"];
	for (var i = 0; i < selectNotificationTimeout.children.length; i++) {
		if (selectNotificationTimeout[i].value == notificationTimeout) {
			selectNotificationTimeout[i].selected = "true";
			break;
		}
	}
}

// function for saving all options to local storage
function saveOptions() {
	var interval = selectReqInterval.children[selectReqInterval.selectedIndex].value;
	localStorage["FS.RequestInterval"] = interval;

	var notificationTimeout = selectNotificationTimeout.children[selectNotificationTimeout.selectedIndex].value;
	localStorage["FS.NotificationTimeout"] = notificationTimeout;

	for (var i=0; i<radioNotifications.length; i++) {
		if (radioNotifications[i].checked) {
			localStorage["FS.Notifications"] = radioNotifications[i].value;
			break;
		}
	}

	for (var i=0; i<radioBackgroundTabs.length; i++) {
		if (radioBackgroundTabs[i].checked) {
			localStorage["FS.BackgroundTabs"] = radioBackgroundTabs[i].value;
			break;
		}
	}
}

