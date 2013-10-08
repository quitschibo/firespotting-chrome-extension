var assert = require("assert");
var popup = require("../src/popup.js");

describe('popup.js testsuite', function() {

	// -------------------- tests for main
	describe('#main', function() {
		it('check main function logic', function() {
			feedUpdated = false;

			localStorage = new Array();
			localStorage["FS.NumLinks"] = null;
			buildPopupAfterResponse = null;

			UpdateFeed = function () {
				feedUpdated = true;
			}

			// run test method
			popup.main();

			assert.equal(feedUpdated, true);

			buildStorage = false;
			localStorage["FS.NumLinks"] = 1;
			RetrieveLinksFromLocalStorage = function() {}

			popup.buildPopup = function() {
				buildStorage = true;
			}

			popup.main();

			assert.equal(buildStorage, true);
		})
	})
})