'use strict';

// Include gulp
const { src, dest } = require('gulp');
const changed = require('gulp-changed');

// Include Our Plugins
const prettierFormat = require('./prettier');

// Export our tasks.
module.exports = {

  // Format code based on prettier and eslint configs.
  // https://github.com/prettier/prettier-eslint
  prettier: function() {
    return src(['./src/patterns/**/**/*.js'], { base: './' })
      .pipe(prettierFormat())
      .pipe(changed('./', { hasChanged: changed.compareContents }))
      // Update the source JS file with the prettier formatted file.
      .pipe(dest(file => file.base));
  }
};
