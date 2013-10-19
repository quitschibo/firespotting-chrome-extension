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
	}),

	// -------------------- tests for endsWith
	describe('#endsWith', function() {
		it('check if function works correctly for different strings', function() {
			assert.equal("Test".endsWith("est"), true);
			assert.equal("Test".endsWith("Test"), true);
			assert.equal("Test".endsWith("TesT"), false);
			assert.equal("Test 12345 !§$%&".endsWith("12345 !§$%&"), true);
			assert.equal("Test 12345 !§$%&".endsWith("12345!§$%&"), false);
		})
	}),

	// -------------------- tests for buildPopup
	describe('#buildPopup', function() {
		fsLink = new Object();
		fsLink.Title = "fslink.Title";
		fsLink.Link = "fslink.Link";
		fsLink.CommentsLink = "fslink.CommentsLink";

		linkList = new Array();
		linkList.push(fsLink);

		domElement = new Object();
		domElement.addEventListener = function() {}
		domElement.className = "class";
		domElement.innerText = "text";
		domElement.appendChild = function(element) {
			// check title element
			if (element.className == "link_title") {
				assert.equal(element.innerText, fsLink.Title);
			}
		}

		// mock dom element
		document = new Object();
		document.getElementById = function () { return domElement; }
		document.createElement = function() { return domElement; }

		// some mocks
		openLinkFront = new Object();
		openLink = new Object();
		localStorage = new Array();

		// run test method
		popup.buildPopup(linkList);
	})
})
