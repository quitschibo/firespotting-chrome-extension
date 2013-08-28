test:
	@./node_modules/.bin/mocha

test-coveralls:
	$(MAKE) test REPORTER=spec
	$(MAKE) test REPORTER=mocha-lcov-reporter | ./bin/coveralls.js --verbose
	rm -rf lib-cov

.PHONY: test