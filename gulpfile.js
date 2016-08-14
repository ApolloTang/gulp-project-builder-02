/* global */
'use strict';

var gulp = require('gulp');
var browserify  = require('browserify');

var connect     = require('gulp-connect');

var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var vinylSource = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var gutil       = require('gulp-util');
var gulpif      = require('gulp-if');

var yargs       = require('yargs');

var babelify    = require('babelify');
var pump = require('pump');


require('shelljs/global');
config.fatal = true;


// ----------------------- //

var buildDir = 'builds/';

var argv = yargs
    .option('target', {
        alias: 't',
        describe: 'Built target',
        choices: ['development', 'production'],
        default: 'development'
    })
    .option('serverport', {
        alias: 's',
        describe: 'server port',
        default: 3212
    })
    .option('livereloadport', {
        alias: 'l',
        describe: 'livereload port',
        default: 40000
    })
    .help('help')
    .argv;
var buildTarget = argv.target;
var serverPort = argv.serverport;
var livereloadPort = argv.livereloadport;




gulp.task('initialize', function(cb) {
    var err = null;
    echo('Initializing ... ');

    try {
        if (test('-d', buildDir)) {
            echo('Found build folder');
            echo('Clearing build folder ... ');
            rm('-rf', buildDir+'/*');
            echo('Copying content of static folder to '+buildDir+' ...');
            cp('-R', 'src/statics/*', buildDir);
        } else {
            echo('Build folder does not exist');
            echo('creating folder with name '+buildDir+' ...');
            mkdir('-p', buildDir);
            echo('copying static folder to '+buildDir+' ...');
            cp('-R', 'src/statics/*', buildDir);
        }
    } catch (error) {
        echo('************ Error initializing ************')
        err = error;
    }

    setTimeout(function(){
        console.log('Done inititializing');
        cb(err)
    }, 2000);
});


var browserifyOption = {
    entries: [ './src/js/index.js' ],
    debug: (buildTarget === 'development')
};
gulp.task('js', function() {

    // browserify(browserifyOption)
    // .transform(babelify, {presets: ["es2015", "react"]} )
    // .bundle()
    // .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    // .pipe(vinylSource('bundle.js'))
    // .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // .pipe(uglify())
    // .pipe(sourcemaps.write('./'))
    // .pipe(gulp.dest(buildDir))
    // // .pipe(connect.reload());

    var b  = browserify(browserifyOption)
        .transform(babelify, {presets: ["es2015", "react"]} )
        .bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(vinylSource('bundle.js'));

    pump([
        b,
        buffer(),
        sourcemaps.init({loadMaps: true}),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest(buildDir)
    ])
});

gulp.task('next1', ['initialize'], function(cb) {
    console.log('next running' );
});

gulp.task('next2', ['initialize'], function(cb) {
    console.log('next running' );
});

gulp.task('default', ['initialize', 'next1', 'next2', 'js'], function(){
    console.log('all done');
});
