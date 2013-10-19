var assert = require("assert");

describe('background.js testsuite', function() {

	// -------------------- tests for setInitialOption
	describe('#setInitialOption', function() {
		it('check all variables', function() {
			requestInterval = 0;
			backgroundTabs = false;
			notificationTimeout = 0;
			updateIfReadyCalled = false;

			SetInitialOption = function(key, value) {
				if (key == "FS.RequestInterval") {
					requestInterval = value;
				} else if (key == "FS.BackgroundTabs") {
					backgroundTabs = value;
				} else if (key = "FS.NotificationTimeout") {
					notificationTimeout = value;
				}
			}

			UpdateIfReady = function() { updateIfReadyCalled = true }

			window = new Object();
			window.setTimeout = function() {}

			// run the script
			var background = require("../src/background.js");

			// assert all expectations
			assert.equal(requestInterval, 1200000);
			assert.equal(backgroundTabs, false);
			assert.equal(notificationTimeout, 5000);
			assert.equal(updateIfReadyCalled, true);
		})
	})
})
