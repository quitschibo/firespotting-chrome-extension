var assert = require("assert");

function getOptionsInstance() {
	$ = function() {}

	return require("../src/options.js");
}

describe('options.js testsuite', function() {
	// -------------------- just instantiation
	it('instantiate the instance', function() {
		getOptionsInstance()
	}),

	// -------------------- initVariables
	it('#initVariables', function() {
		options = getOptionsInstance();

		expectedSelectReqInterval = "60000";
		expectedRadioNotifications = "true";
		expectedRadioBackgroundTabs = "false";
		expectedSelectNotificationTimeout = "1000";

		document = new Object();
		document.getElementById = function(key) {
			if (key == "RequestInterval") {
				return expectedSelectReqInterval;
			} else if (key == "NotificationTimeout") {
				return expectedSelectNotificationTimeout;
			}
		}
		document.getElementsByName = function (key) {
			if (key == "Notifications") {
				return expectedRadioNotifications;
			} else if (key == "BackgroundTabs") {
				return expectedRadioBackgroundTabs;
			}
		}

		// run test method
		options.initVariables();

		assert.equal(options.selectReqInterval, expectedSelectReqInterval);
		assert.equal(options.radioNotifications, expectedRadioNotifications);
		assert.equal(options.radioBackgroundTabs, expectedRadioBackgroundTabs);
		assert.equal(options.selectNotificationTimeout, expectedSelectNotificationTimeout);
	}),

	// -------------------- restoreOptions
	it('#restoreOptions', function() {
		initVariablesCalled = false;

		options = getOptionsInstance();
		options.initVariables = function() { initVariablesCalled = true }

		// mock localStorage
		localStorage = new Array();
		localStorage["FS.RequestInterval"] = "60000";
		localStorage["FS.Notifications"] = "true";
		localStorage["FS.BackgroundTabs"] = "false";
		localStorage["FS.NotificationTimeout"] = "1000";

		// reqIntervalMock
		reqIntervalList = new Array();
		reqIntervalList.children = new Object();
		reqIntervalList.children.length = 1;
		reqIntervalObj = new Object();
		reqIntervalObj.value = "60000";
		reqIntervalObj.selected = "false";
		reqIntervalList.push(reqIntervalObj);
		options.selectReqInterval = reqIntervalList;

		// notifications mock
		notificationList = new Array();
		notificationObj = new Object();
		notificationObj.value = "true";
		notificationObj.checked = "false";
		notificationList.push(notificationObj);
		options.radioNotifications = notificationList;

		// backgroundTabs mock
		backgroundList = new Array();
		backgroundObj = new Object();
		backgroundObj.value = "false";
		backgroundObj.checked = "false";
		backgroundList.push(backgroundObj);
		options.radioBackgroundTabs = backgroundList;

		// notificationTimeout Mock
		notificationTimeoutList = new Array();
		notificationTimeoutList.children = new Object();
		notificationTimeoutList.children.length = 1;
		notificationMockObj = new Object();
		notificationMockObj.value = "1000";
		notificationMockObj.selected = "false";
		notificationTimeoutList.push(notificationMockObj);
		options.selectNotificationTimeout = notificationTimeoutList;

		// run test method
		options.restoreOptions();

		// assertions
		assert.equal(initVariablesCalled, true);
		assert.equal(reqIntervalObj.selected, "true");
		assert.equal(notificationObj.checked, "true");
		assert.equal(backgroundObj.checked, "true");
		assert.equal(notificationMockObj.selected, "true");
	}),

	// -------------------- restoreOptions
	it('#saveOptions', function() {
		options = getOptionsInstance();

		localStorage = new Array();

		// check selectReqInterval
		selectReqInterval = new Object();
		selectReqInterval.selectedIndex = 42;
		selectReqInterval.children = new Array();
		selectedElememnt = new Object();
		selectedElememnt.value = "42";
		selectReqInterval.children[42] = selectedElememnt;
		options.selectReqInterval = selectReqInterval;

		// check notificationTimeout
		selectNotificationTimeout = new Object();
		selectNotificationTimeout.selectedIndex = 23;
		selectNotificationTimeout.children = new Array();
		selectedElememntNT = new Object();
		selectedElememntNT.value = "23";
		selectNotificationTimeout.children[23] = selectedElememntNT;
		options.selectNotificationTimeout = selectNotificationTimeout;

		// check radioNotifications
		firstRadioNotification = new Object();
		firstRadioNotification.checked = false;
		firstRadioNotification.value = "wrong element";
		secondRadioNotification = new Object();
		secondRadioNotification.checked = true;
		secondRadioNotification.value = "correct element";
		radioNotifications = new Array();
		radioNotifications.push(firstRadioNotification);
		radioNotifications.push(secondRadioNotification);
		options.radioNotifications = radioNotifications;

		// check radioNotifications
		firstBackgroundTab = new Object();
		firstBackgroundTab.checked = false;
		firstBackgroundTab.value = "wrong element";
		secondBackgroundTab = new Object();
		secondBackgroundTab.checked = true;
		secondBackgroundTab.value = "correct element";
		backgroundTabs = new Array();
		backgroundTabs.push(firstBackgroundTab);
		backgroundTabs.push(secondBackgroundTab);
		options.radioBackgroundTabs = backgroundTabs;

		// run test method
		options.saveOptions();

		// assertions
		assert.equal(localStorage["FS.RequestInterval"], "42");
		assert.equal(localStorage["FS.NotificationTimeout"], "23");
		assert.equal(localStorage["FS.Notifications"], "correct element");
		assert.equal(localStorage["FS.BackgroundTabs"], "correct element");
	})
})