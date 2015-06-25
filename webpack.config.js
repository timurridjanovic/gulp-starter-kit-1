
'use strict';

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: "./public/js/main",
    output: {
        path: path.join(__dirname, '/build/js/'),
        filename: "bundle.js",
		publicPath: "/js/"
    },
    storeStatsTo: "bundle_hash",
	devtool: 'inline-source-map',
    module: {
        preLoaders: [
            {
                test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/
            }
        ],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			}
		]
    },
    eslint: {
        configFile: './.eslintrc'
    },
    plugins: [
    ]
};
