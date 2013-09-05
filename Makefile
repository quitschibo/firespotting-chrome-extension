test:
	@./node_modules/.bin/mocha
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

drytest:
	@./node_modules/.bin/mocha

selenium:
	cd selenium-tests && mvn verify

build:
	sh crxmake.sh src/ key.pem

buildcrx:
	sh crxbuild.sh src key.pem
	./buildcrx.bin firespotting.zip key.pem firespotting.crx
	mv firespotting.crx selenium-test/src/main/resources

.PHONY: test
