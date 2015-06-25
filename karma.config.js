'use strict';

var path = require('path');
var webpack = require('webpack');
var webpackConfig = require(path.join(__dirname, '/webpack.config.js'));

module.exports = function(config) {
	config.set({
		basePath: __dirname,

		files: [
			'public/js/**/*-test.js'
		],

		preprocessors: {
			'public/js/**/*.js': ['webpack', 'sourcemap']
		},

		webpack: webpackConfig,

		webpackMiddleware: {
			stats: {
				colors: true
			}
		},

		reporters: ['spec'],

		port: 9999,

		colors: true,

		logLevel: config.LOG_INFO,

		frameworks: ['jasmine'],

		browsers: ['PhantomJS'],

		captureTimeout: 60000,

		singleRun: true,

		plugins: [
			require('karma-webpack'),
			require('karma-jasmine'),
			require('karma-spec-reporter'),
			require('karma-chrome-launcher'),
			require('karma-sourcemap-loader'),
			require('karma-phantomjs-launcher')
		]
	});
};
