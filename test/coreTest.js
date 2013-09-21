var assert = require("assert");
var core = require("../src/core.js");
var sinon = require("sinon");
var JsMockito = require('jsmockito').JsMockito;
JsMockito.Integration.Nodeunit();
JsMockito.Integration.importTo( exports );

describe('core.js testsuite', function() {
	describe('#setInitialOption', function() {
			it('should set the correct key in localStorage', function() {
			core.SetInitialOption('key', 'value');
			assert.equal(core.localStorage['key'], 'value');
		})
	})
})