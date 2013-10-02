var assert = require("assert");
var core = require("../src/core.js");

describe('core.js testsuite', function() {

	// -------------------- tests for setInitialOption
	describe('#setInitialOption', function() {
			it('should set the correct key in localStorage', function() {
			core.SetInitialOption('key', 'value');
			assert.equal(core.localStorage['key'], 'value');
		})
	}),

	// -------------------- tests for updateIfReady
	describe('#UpdateIfReady', function() {
			it('should update feed when forced', function() {
			run = false;

			// mock function for indicating a correct run
			core.UpdateFeed = function () { run = true; }

			// run test class
			core.UpdateIfReady(true);
			assert.equal(run, true);
		})
	}),
	describe('#UpdateIfReady', function() {
			it('should update feed when no force and no last refresh', function() {
			run = false;

			// mock function for indicating a correct run
			core.UpdateFeed = function () { run = true; }

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, true);
		})
	}),
	describe('#UpdateIfReady', function() {
			it('should NOT update feed when refreshed under next refresh limit', function() {
			run = false;
			interval = 60000;

			// set lastRefresh time to limit (one second less than the refresh interval)
			core.localStorage["FS.LastRefresh"] = new Date().getTime() - interval + 1000;
			core.localStorage["FS.RequestInterval"] = interval;

			// mock function for indicating a correct run
			core.UpdateFeed = function () { run = true; }

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, false);
		})
	}),
	describe('#UpdateIfReady', function() {
		it('should update feed when it is time for refreshing', function() {
			run = false;
			interval = 60000;

			// set lastRefresh time to limit (one second more than the refresh interval)
			core.localStorage["FS.LastRefresh"] = new Date().getTime() - interval - 1000;
			core.localStorage["FS.RequestInterval"] = interval;

			// mock function for indicating a correct run
			core.UpdateFeed = function () { run = true; }

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, true);
		})
	}),

	// -------------------- tests for onRssSuccess
	describe('#onRssSuccess', function() {
		it('should call handleFeedParsingFailed if rssFeed null', function() {
			run = false;
			core.coreObject.handleFeedParsingFailed = function () { run = true; }

			// call test method
			core.onRssSuccess();
			assert.equal(run, true);
		})
	}),
	describe('#onRssSuccess', function() {
		it('should call handleFeedParsingFailed if rssFeed null', function() {
			run = false;
			core.handleFeedParsingFailed = function () { run = true; }

			// call test method
			core.onRssSuccess();
			assert.equal(run, true);
		})
	}),
	describe('#onRssSuccess', function() {
		it('method should parse links', function() {
			parseLinksCalled = false;
			core.coreObject.parseFSLinks = function () { parseLinksCalled = true; }
			core.buildPopupAfterResponse = true;

			// all methods should not do anything. they're isolated for test purposes
			core.coreObject.handleLinkNotification = function () { /* do nothing */ }
			core.coreObject.SaveLinksToLocalStorage = function () { /* do nothing */ }
			core.delegateBuildPopup = function () { /* do nothing */ }

			// call test method
			core.onRssSuccess("test rss feed");
			assert.equal(parseLinksCalled, true);
			assert.equal(core.buildPopupAfterResponse, false);
			assert.equal(core.localStorage["FS.LastRefresh"], new Date().getTime());
		})
	}),

	// -------------------- tests for handleLinkNotification
	describe('#handleLinkNotification', function() {
		it('do nothing, when notifications are off', function() {
			core.localStorage['FS.Notifications'] = 'false';

			// call test method
			core.handleLinkNotification("test rss feed");
		})
	}),
	describe('#handleLinkNotification', function() {
		it('show notification when not forced and not shown actual title', function() {
			core.localStorage['FS.Notifications'] = 'true';

			// not shown the actual title
			core.localStorage['FS.LastNotificationTitle'] = "old Title";
			testEntry = { Title: "testTitle" };
			link = new Array();
			link[0] = testEntry;

			// call test method
			core.coreObject.handleLinkNotification(link);
		})
	}),
	describe('#handleLinkNotification', function() {
		it('show notification when not forced and last shown title is null', function() {
			core.localStorage['FS.Notifications'] = 'true';

			// not shown the actual title
			core.localStorage['FS.LastNotificationTitle'] = null;
			core.useForce = false;

			testEntry = { Title: "testTitle" };
			link = new Array();
			link[0] = testEntry;

			core.ShowLinkNotification = function()  { notificationShowed = true }

			// call test method
			core.handleLinkNotification(link);
			assert.equal(core.localStorage['FS.LastNotificationTitle'], testEntry.Title);
			assert.equal(notificationShowed, true);
		})
	}),
	describe('#handleLinkNotification', function() {
		it('do not show linkNotification when used first time', function() {
			notificationShowed = false;
			core.localStorage['FS.Notifications'] = 'true';
			core.useForce = true;

			testEntry = { Title: "testTitle" };
			link = new Array();
			link[0] = testEntry;

			// not shown the actual title
			core.localStorage['FS.LastNotificationTitle'] = null;
			core.ShowLinkNotification = function()  { notificationShowed = true }

			// call test method
			core.handleLinkNotification(link);
			assert.equal(core.localStorage['FS.LastNotificationTitle'], testEntry.Title);
			assert.equal(notificationShowed, false);
		})
	}),

	// -------------------- tests for RetrieveLinksFromLocalStorage
	describe('#RetrieveLinksFromLocalStorage', function() {
		it('return null if there is no link count in localStorage', function() {
			core.localStorage['FS.NumLinks'] = null;

			// call test method
			result = core.RetrieveLinksFromLocalStorage();
			assert.equal(result, null);
		})
	}),
	describe('#RetrieveLinksFromLocalStorage', function() {
		it('try to retrieve some links', function() {
			core.localStorage['FS.NumLinks'] = '2';
			core.localStorage['FS.Link0'] = '{"Title":"0"}';
			core.localStorage['FS.Link1'] = '{"Title":"1"}';

			// call test method
			result = core.RetrieveLinksFromLocalStorage();
			assert.equal(result[0].Title, "0");
			assert.equal(result[1].Title, "1");
		})
	}),

	// -------------------- tests for RetrieveLinksFromLocalStorage
	describe('#SaveLinksToLocalStorage', function() {
		it('test saving with links', function() {
			testEntry = { Title : "This is a test Title" };
			testEntry2 = { Title : "This is another test Title" };
			link = [testEntry, testEntry2]

			core.SaveLinksToLocalStorage(link);
			assert.equal(core.localStorage["FS.NumLinks"], 2);
			assert.equal(core.localStorage["FS.Link0"], '{"Title":"This is a test Title"}');
			assert.equal(core.localStorage["FS.Link1"], '{"Title":"This is another test Title"}');
		})
	}),

	// -------------------- tests for ShowLinkNotification
	describe('#ShowLinkNotification', function() {
		it('check, if createWebNotification and show() is called', function() {
			createWebNotificationCalled = false;
			showCalled = false;

			core.localStorage["FS.NotificationTimeout"] = "infinity"

			notificationMock = new Object();
			notificationMock.show = function() { showCalled = true; }
			notificationMock.addEventListener = function() { /* do nothing */ }
			notificationMock.close = function() { /* do nothing */ }

			core.coreObject.createWebNotification = function() { createWebNotificationCalled = true; return notificationMock; }

			// call test method
			core.coreObject.ShowLinkNotification();
			assert.equal(createWebNotificationCalled, true);
			assert.equal(showCalled, true);
		})
	}),

	// -------------------- tests for extractEntries
	describe('#extractEntries', function() {
		it('check entries', function() {
			// 1. check tagName == entry
			entriesMock = new Object();
			entriesMock.getElementsByTagName = function(tagName) {
				if (tagName == "entry") {
					return "testEntry";
				}
			}

			// call test method
			result = core.coreObject.extractEntries(entriesMock);
			// 2. assert tagName == entry
			assert.equal(result, "testEntry");

			// 3. check tagName = item
			entriesMock.getElementsByTagName = function(tagName) {
				if (tagName == "item") {
					return "testItem";
				} else if (tagName == "entry") {
					return new Array();
				}
			}

			// call test method
			result = core.coreObject.extractEntries(entriesMock);
			// 4. assert tagName = item
			assert.equal(result, "testItem");
		})
	}),

	// -------------------- tests for parseFSLinks
	describe('#parseFSLinks', function() {
		it('check parsing of fs links', function() {
			itemMock = new Object();
			itemMock.getElementsByTagName = function(tagName) {
				if (tagName == 'title') {
					titleMock = new Object();
					titleMock.textContent = "title";

					titleArray = new Array();
					titleArray[0] = titleMock;
					return titleArray;
				} else if (tagName == 'link') {
					linkMock = new Object();
					linkMock.textContent = "link"

					linkArray = new Array();
					linkArray[0] = linkMock;
					return linkArray;
				} else if (tagName == 'comments') {
					commentsMock = new Object();
					commentsMock.textContent = "comments";

					commentsArray = new Array();
					commentsArray[0] = commentsMock;
					return commentsArray;
				}
			}

			entriesMock = new Object();
			entriesMock.length = 1;
			entriesMock.item = function() { return itemMock; }

			core.extractEntries = function() {
				return entriesMock;
			}

			// call test method
			result = core.parseFSLinks();
			assert.equal(result[0].Title, "title");
			assert.equal(result[0].Link, "link");
			assert.equal(result[0].CommentsLink, "comments");
		})
	}),

	describe('#parseFSLinks', function() {
		it('check parsing of fs links when there is no content (fallback test)', function() {
			itemMock = new Object();
			itemMock.getElementsByTagName = function(tagName) {
				if (tagName == 'title') {
					return new Array();
				} else if (tagName == 'link') {
					return new Array();
				} else if (tagName == 'comments') {
					return new Array();
				}
			}

			entriesMock = new Object();
			entriesMock.length = 1;
			entriesMock.item = function() { return itemMock; }

			core.extractEntries = function() {
				return entriesMock;
			}

			// call test method
			result = core.parseFSLinks();
			assert.equal(result[0].Title, "Unknown Title");
			assert.equal(result[0].Link, "");
			assert.equal(result[0].CommentsLink, "");
		})
	}),

	describe('#toggle', function() {
		it('html element should toggle between display:none and display:block', function() {
			eMock = new Object();
			eMock.style = new Object();
			eMock.style.display = 'block';

			document = new Object();
			document.getElementById = function () {
				return eMock;
			}

			// toggle to none
			core.toggle();
			assert.equal(eMock.style.display, 'none');

			// and toggle back to block
			core.toggle();
			assert.equal(eMock.style.display, 'block');
		})
	})
})
