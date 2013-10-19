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
	this.selectReqInterval = document.getElementById("RequestInterval");
	this.radioNotifications = document.getElementsByName("Notifications");
	this.radioBackgroundTabs = document.getElementsByName("BackgroundTabs");
	this.selectNotificationTimeout = document.getElementById("NotificationTimeout");
}

// make all options visible for the user
function restoreOptions() {
	this.initVariables();
	var reqInterval = localStorage["FS.RequestInterval"];
	for (var i = 0; i < this.selectReqInterval.children.length; i++) {
		if (this.selectReqInterval[i].value == reqInterval) {
			this.selectReqInterval[i].selected = "true";
			break;
		}
	}
	var notifications = localStorage["FS.Notifications"];
	for (var i = 0; i < this.radioNotifications.length; i++) {
		if (this.radioNotifications[i].value == notifications) {
			this.radioNotifications[i].checked = "true";
		}
	}
	var backgroundTabs = localStorage["FS.BackgroundTabs"];
	for (var i = 0; i < this.radioBackgroundTabs.length; i++) {
		if (this.radioBackgroundTabs[i].value == backgroundTabs) {
			this.radioBackgroundTabs[i].checked = "true";
		}
	}
	var notificationTimeout = localStorage["FS.NotificationTimeout"];
	for (var i = 0; i < this.selectNotificationTimeout.children.length; i++) {
		if (this.selectNotificationTimeout[i].value == notificationTimeout) {
			this.selectNotificationTimeout[i].selected = "true";
			break;
		}
	}
}

// function for saving all options to local storage
function saveOptions() {
	var interval = this.selectReqInterval.children[this.selectReqInterval.selectedIndex].value;
	localStorage["FS.RequestInterval"] = interval;

	var notificationTimeout = this.selectNotificationTimeout.children[this.selectNotificationTimeout.selectedIndex].value;
	localStorage["FS.NotificationTimeout"] = notificationTimeout;

	for (var i = 0; i < this.radioNotifications.length; i++) {
		if (this.radioNotifications[i].checked) {
			localStorage["FS.Notifications"] = this.radioNotifications[i].value;
			break;
		}
	}

	for (var i = 0; i < this.radioBackgroundTabs.length; i++) {
		if (this.radioBackgroundTabs[i].checked) {
			localStorage["FS.BackgroundTabs"] = this.radioBackgroundTabs[i].value;
			break;
		}
	}
}

// node.js boilerplate
module.exports.selectReqInterval = selectReqInterval;
module.exports.radioNotifications = radioNotifications;
module.exports.radioBackgroundTabs = radioBackgroundTabs;
module.exports.selectNotificationTimeout = selectNotificationTimeout;
module.exports.initVariables = initVariables;
module.exports.restoreOptions = restoreOptions;
module.exports.saveOptions = saveOptions;

