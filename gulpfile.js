// skeleton, responsible for the build process
var gulp = require('gulp');

// response for logging info about build process to terminal
var gutil = require('gulp-util');

// used for piping file contents from one to another
var source = require('vinyl-source-stream');

// determines which code refs which and 
// that include order is correct
var browserify = require('browserify');

// tool that automatically executes this gulp file
// when there are changes to source files to start
// the build process over
var watchify = require('watchify');

// for es6
var babelify = require('babelify');

// for merging objects
var merge = require('utils-merge');

var path = {
  HTML: 'src/index.html',
  MINIFIED_OUT: 'build.min.js',
  OUT: 'build.js',
  DEST: 'dist',
  DEST_BUILD: 'dist/build',
  DEST_SRC: 'dist/src',
  ENTRY_POINT: './src/js/app.js'
};

// default task to run
gulp.task('default', function() {
  gulp.watch(path.HTML, ['copyIndex']);

  var args = merge(watchify.args, { debug: true, extensions: ['.js'] });
  var bundler = browserify(path.ENTRY_POINT)
    .plugin(watchify)
    .transform(babelify, {presets: ['es2015', 'react']});

  function build(file) {
    if (file) gutil.log('Recompiling ' + file);
    return bundler
      .bundle()
      .on('error', gutil.log.bind(gutil, 'Browserify Error'))
      .pipe(source(path.OUT))
      .pipe(gulp.dest(path.DEST_SRC));
  };

  // copy index.html out to dist directory
  function copyIndex() {
    gulp.src(path.HTML)
    .pipe(gulp.dest(path.DEST));
  };

  // run on initial gulp from cli
  copyIndex();
  build();
  bundler.on('update', build);
});