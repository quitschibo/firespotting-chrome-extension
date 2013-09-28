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
			var run = false;

			// mock function for indicating a correct run
			core.UpdateFeed = function () {run = true;}

			// run test class
			core.UpdateIfReady(true);
			assert.equal(run, true);
		})
	}),
	describe('#UpdateIfReady', function() {
			it('should update feed when no force and no last refresh', function() {
			var run = false;

			// mock function for indicating a correct run
			core.UpdateFeed = function () {run = true;}

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, true);
		})
	}),
	describe('#UpdateIfReady', function() {
			it('should NOT update feed when refreshed under next refresh limit', function() {
			var run = false;
			var interval = 60000;

			// set lastRefresh time to limit
			core.localStorage["FS.LastRefresh"] = new Date().getTime() - interval;
			core.localStorage["FS.RequestInterval"] = interval;

			// mock function for indicating a correct run
			core.UpdateFeed = function () {run = true;}

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, false);
		})
	}),
	describe('#UpdateIfReady', function() {
		it('should update feed when it is time for refreshing', function() {
			var run = false;
			var interval = 60000;

			// set lastRefresh time to limit (one second more than the refresh interval)
			core.localStorage["FS.LastRefresh"] = new Date().getTime() - interval - 1000;
			core.localStorage["FS.RequestInterval"] = interval;

			// mock function for indicating a correct run
			core.UpdateFeed = function () {run = true;}

			// run test class
			core.UpdateIfReady(false);
			assert.equal(run, true);
		})
	})
})