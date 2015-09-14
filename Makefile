G=../node_modules/gulp/bin/gulp.js
B=./node_modules/bower/bin/bower

default:
	cd build; \
	$(G) watch

s:
	npm install

b:
	cd build; \
	$(G) --env production;

