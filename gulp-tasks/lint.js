'use strict';

// Include gulp
const { src } = require('gulp');

// Include Our Plugins
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

// Export our tasks.
module.exports = {

  // Lint Sass based on .stylelintrc.yml config.
  lintSass: function () {
    return src([
      './src/patterns/**/*.scss',
      '!./src/patterns/00-config/_tokens.scss'
    ])
      .pipe(
        gulpStylelint({
          reporters: [
            {
              formatter: 'string',
              console: true
            }
          ]
        })
      );
  },

  // Lint JavaScript based on .eslintrc config.
  lintJS: function() {
    return src([
      './src/patterns/**/*.js',
      '!./src/patterns/components/**/vendors/*'
    ])
      .pipe(eslint())
      .pipe(eslint.format());
  }
};
