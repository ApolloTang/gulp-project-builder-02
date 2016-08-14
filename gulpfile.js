/* global */
'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var connect = require('gulp-connect');
var vinylSource = require('vinyl-source-stream');

var yargs = require('yargs');


var babelify = require('babelify');


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


gulp.task('next1', ['initialize'], function(cb) {
    console.log('next running' );
});

gulp.task('next2', ['initialize'], function(cb) {
    console.log('next running' );
});

gulp.task('default', ['initialize', 'next1', 'next2'], function(){
    console.log('all done');
});
