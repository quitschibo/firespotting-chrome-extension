# run tests and calculate coverage with coveralls
test:
	@./node_modules/.bin/mocha
	istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js && rm -rf ./coverage

# just run the tests
drytest:
	@./node_modules/.bin/mocha

# run the selenium tests with given firespotting file
selenium:
	cd selenium-tests && mvn verify

# build crx file with bash script
build:
	sh crxmake.sh src/ key.pem

# build crx file with binary file
buildcrx:
	sh crxbuild.sh src key.pem
	@./buildcrx.bin firespotting.zip key.pem firespotting.crx
	mv firespotting.crx selenium-test/src/main/resources

.PHONY: test
