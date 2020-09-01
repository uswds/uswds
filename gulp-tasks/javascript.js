'use strict';

const { dest } = require('gulp');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const dutil = require('../gulp-tasks/utils/doc-util');
const log = require('fancy-log');

/**
 * Start JavaScript Build.
 * @param {function} done callback function.
 * @returns {undefined}
 */

// Export our tasks.
module.exports = {
// Compile JS.
  buildJS: function(done) {
    const defaultStream = browserify({
      entries:  './scripts/build.js',
      debug: true
    }).transform('babelify', {
      global: true,
      presets: ['@babel/preset-env']
    });

    const stream = defaultStream
      .bundle()
      .pipe(source('uswds.js')) // XXX why is this necessary?
      .pipe(buffer())
      .pipe(rename({ basename: dutil.pkg.name }))
      .pipe(dest('../patternlab/js'));

    stream.pipe(sourcemaps.init({ loadMaps: true }));

    if (process.env.NODE_ENV !== 'development') {
      stream.pipe(uglify());
    }

    stream
      .on('error', log)
      .pipe(
        rename({
          suffix: '.min'
        })
      )
      .pipe(sourcemaps.write('.'))
      .pipe(dest('patternlab/js'));

    done();
    return stream;
  }
};
