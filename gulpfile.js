/* global */
'use strict';

var gulp        = require('gulp');
var browserify  = require('browserify');
var connect     = require('gulp-connect');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');
var vinylSource = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var gulpif      = require('gulp-if');
var pump        = require('pump');
var yargs       = require('yargs');
var babelify    = require('babelify');

var errorify    = require('errorify');

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
        default: 7777
    })
    .option('livereloadport', {
        alias: 'l',
        describe: 'livereload port',
        default: 47777
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


gulp.task('js', function(cb) {
    var browserifyOption = {
        entries: [  './src/js/index.js' ],
        debug: (buildTarget === 'development')
    };
    var babalifyConf = {
        presets: ["es2015", "react"],
        "plugins": ["transform-object-rest-spread"]
    };

    var b  = browserify(browserifyOption)
        .plugin(errorify, function(err){console.log(err)})
        .transform(babelify.configure(babalifyConf))
        .bundle()
        // .on('error', onError)  // This is nolonger necessary because of errorify
        .pipe(vinylSource('bundle.js'))

    pump([
        b,
        buffer(),
        sourcemaps.init({loadMaps: true}),
        uglify(),
        sourcemaps.write('./'),
        gulp.dest(buildDir),
        connect.reload()
    ], cb);
});


gulp.task('watch', ['initialize'], function(){
    console.log('watch fired...')
    // gulp.watch('src/templates/**/*.jade', ['jade']);
    gulp.watch('src/js/**/*.js', ['js']);
    // gulp.watch('src/sass/**/*.scss', ['sass']);
    // gulp.watch('src/less/**/*.less', ['less']);
    // gulp.watch('src/statics/**/*', ['onStaticFolderChange']);
});

gulp.task('connect', ['initialize'], function(){
    connect.server({
        root: buildDir,
        // open: { browser: 'Google Chrome'}
        // Option open does not work in gulp-connect v 2.*. Please read "readme" https://github.com/AveVlad/gulp-connect}
        port: serverPort,
        livereload: {port : livereloadPort}
    });
});

gulp.task('default', ['initialize',  'js', 'watch',  'connect'], function(){
    console.log('all done');
});


function onError(err) {
    console.log('ERROR: ', err.toString());
    console.log('ERROR: ', err.codeFrame);
    this.emit('end');
}
