var assert = require("assert");
var core = require("../src/core.js");

describe('core.js testsuite', function() {
	describe('#setInitialOption', function() {
			it('should set the correct key in localStorage', function() {
			core.SetInitialOption('key', 'value');
			assert.equal(core.localStorage['key'], 'value');
		})
	})
})