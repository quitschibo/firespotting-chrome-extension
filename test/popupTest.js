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

			// run test method a second time to check the buildPopup flow
			popup.main();

			assert.equal(buildStorage, true);
		})
	}),

	// -------------------- tests for refreshLinks
	describe('#refreshLinks', function() {
		it('check link refreshing', function() {
			linkTableStorage = new Array();

			testLinkTable = new Object();
			testLinkTable.addChild = function(element) {linkTableStorage[element] = element;}
			testLinkTable.removeChild = function(element) {linkTableStorage[element] = null;}
			testLinkTable.hasChildNodes = function() {
				for (child in linkTableStorage) {
					if (linkTableStorage[child] != null) {
						return true;
					}
				}
				return false;
			}
			testLinkTable.firstChild = function() {
				for (child in linkTableStorage) {
					if (linkTableStorage[child] != null) {
						return linkTableStorage[child];
					}
				}
			}

			testLinkTable.addChild("first element");
			testLinkTable.addChild("second element");

			toggle = function() {}

			document = new Object();
			document.getElementById = function() {
				return testLinkTable;
			}

			updated = false;
			refreshed = false;

			UpdateIfReady = function() {updated = true;}
			updateLastRefreshTime = function() {refreshed = true;}

			// run test method
			popup.refreshLinks();

			// check, if all childs are removed
			for (child in linkTableStorage) {
				assert.equal(linkTableStorage[child], null);
			}
			assert.equal(updated, true);
			assert.equal(refreshed, true);
		})
	})
})
