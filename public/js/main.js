'use strict';

console.log('main.js');

require.ensure([], function() {
	require('./component_one/component-one.js')();
});
