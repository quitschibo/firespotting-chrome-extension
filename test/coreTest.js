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
	/*describe('#UpdateIfReady', function() {
		it('update without lastRefresh', function() {
			// we want this function to be called
			//sinon.mock(core, "UpdateFeed");
			core = spy(core);
			when(core).UpdateFeed().thenReturn(true);

			// there was no last refresh -> should update anyway
			core.localStorage["FS.LastRefresh"] = null;
			core.localStorage["FS.RequestInterval"] = 30000;

			// should update even without force
			core.UpdateIfReady(false);
			verify(core).UpdateFeed();
		})
	}),
	describe('#UpdateIfReady', function() {
		it('update by force', function() {
			// refresh was 1 second ago -> should normally not refresh
			core.localStorage["FS.LastRefresh"] = (new Date()).getTime() - 1;
			core.localStorage["FS.RequestInterval"] = 30000;

			// we want to update anyway
			core.UpdateIfReady(true);
			verify(core).UpdateFeed();
		})
	}),
	describe('#UpdateIfReady', function() {
		it('update by time', function() {
			core.UpdateFeed = sinon.stub();

			// refresh was long enough ago for next refresh
			core.localStorage["FS.LastRefresh"] = (new Date()).getTime() - 30001;
			core.localStorage["FS.RequestInterval"] = 30000;

			core.UpdateIfReady(false);
			assert(core.UpdateFeed.called);
		})
	}),
	describe('#UpdateIfReady', function() {
		it('do not update', function() {
			core.UpdateFeed = sinon.stub();

			// refresh was long enough ago for next refresh
			core.localStorage["FS.LastRefresh"] = (new Date()).getTime();
			core.localStorage["FS.RequestInterval"] = 30000;

			core.UpdateIfReady(false);
			assert(!core.UpdateFeed.called);
		})
	})*/
})