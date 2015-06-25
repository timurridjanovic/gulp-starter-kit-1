'use strict';

//imports
var gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
    webpackStream = require('webpack-stream'),
	webpack = require('webpack'),
    path = require('path'),
    livereload = require('gulp-livereload'),
	uncache = require('gulp-uncache'),
    sass = require('gulp-sass'),
    webpackConfig = require(__dirname + '/webpack.config.js'),
	karmaConfig = require(__dirname + '/karma.config.js'),
	karma = require('gulp-karma'),
	argv = require('minimist')(process.argv.slice(2)),
	DEBUG = !argv.release;

if (DEBUG) {
	webpackConfig.debug = true;
	webpackConfig.devtool = '#source-map';
	webpackConfig.watchDelay = 200;
	webpackConfig.progress = true;
	webpackConfig.useMemoryFs = true;
} else {
	webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin())
}


//public vars
var config = {
    sass: path.join(__dirname, '/public/scss/**/*.scss'),
    webpack: path.join(__dirname, '/public/js/**/*.js'),
	dev: {
		jsEntry: path.join(__dirname, '/public/js/main.js')
	},
    build: {
        css: path.join(__dirname, '/build/css/'),
		js: path.join(__dirname, '/build/js')
    },
	bundleName: 'bundle.js',
	templateSrc: path.join(__dirname, '/views/layout.hbs'),
	templateDest: path.join(__dirname, '/build/views/')
};

var model = {};


//public functions

var cleanTask = function(exceptions) {
	del(['build/js', '!build/.svn', '!build/.git'], {dot: true});
};

var webpackTask = function(watch, webpackStream) {
	if (watch) {
		webpackConfig.watch = true;
		webpackConfig.keepalive = true;
	}

	gulp.src(config.dev.jsEntry)
		.pipe(webpackStream(webpackConfig, null, function(err, stats) {
			if (err) throw new gutil.PluginError('webpack', err);
			gutil.log('[webpack]', stats.toString({
				colors: true
			}));
			uncacheTask();
		}))
		.pipe(livereload())
		.pipe(uncache())
		.pipe(gulp.dest(config.build.js));
};

var uncacheTask = function() {
	gulp.src('./views/**/*.hbs')
		.pipe(uncache())
		.pipe(gulp.dest('./build/views/'));
};


//init
function initConfig(gulp) {
    gulp.task('default', ['sass', 'webpack', 'uncache']);

    gulp.task('clean', function() {
        cleanTask();
    });

    gulp.task('sass', function() {
        gulp.src(config.sass)
            .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
            .pipe(gulp.dest(config.build.css))
            .pipe(livereload());
    });

    gulp.task('webpack', ['clean'], function() {
		webpackTask(false, webpackStream);
    });

    gulp.task('watch', function() {
        livereload.listen();
        gulp.watch(config.sass, ['sass']);
		webpackTask(true, webpackStream);
    });

	gulp.task('uncache', ['webpack'], function() {
		uncacheTask();
	});

	gulp.task('test', function() {

		return gulp.src([])
			.pipe(karma({
				configFile: 'karma.config.js',
				action: 'run'
			}))
			.on('error', function(err) {
				if (err) gutil.log(err);
			});
	});
}

initConfig(gulp);

