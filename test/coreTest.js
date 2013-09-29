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
			core.coreObject.handleLinkNotification("test rss feed");
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

			// call test method
			core.coreObject.handleLinkNotification("test rss feed");
		})
	}),
	describe('#handleLinkNotification', function() {
		it('do not show linkNotification when used first time', function() {
			core.localStorage['FS.Notifications'] = 'true';
			core.useForce = true;

			// not shown the actual title
			core.localStorage['FS.LastNotificationTitle'] = null;

			// call test method
			core.coreObject.handleLinkNotification("test rss feed");
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
	})
})
