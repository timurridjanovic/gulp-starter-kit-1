'use strict';

var componentOne = require('./component-one.js');

describe('main-test', function() {
	it('should show that componentOne is defined', function() {

		expect(componentOne).toBeDefined();
	});

	it('should show that componentOne returns 3', function() {

		expect(componentOne()).toEqual(3);
	});
});
