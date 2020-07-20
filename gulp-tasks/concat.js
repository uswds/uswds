// Include gulp
const { src, dest } = require('gulp');

// Include Our Plugins.
const concat = require('gulp-concat');
const order = require('gulp-order');

// Export our tasks.
module.exports = {

  // Concat all CSS into a master bundle.
  concatCSS: function () {
    return (
      src([
        './dist/css/*.css',
        '!./dist/css/styles.css',
        '!./dist/css/pattern-scaffolding.css'
      ])
        // Reorder the files so global is first.
        // If you need to get fancier with the order here's an example:
        // .pipe(order([
        //   'dist/css/global.css',
        //   'src/components/**/*.css',
        //   'dist/css/btn.css',
        //   'dist/css/form-item.css',
        //   'dist/css/form-float-label.css',
        //   'dist/css/*.css'
        // ], { base: './' }))
        .pipe(order([
          'dist/css/global.css',
          'dist/css/*.css'
        ], { base: './' }))
        .pipe(concat('styles.css'))
        .pipe(dest('./dist/css'))
    );
  },

  // Concat all JS into a master bundle.
  concatJS: function() {
    return (
      src([
        './dist/js/*.js',
        '!./dist/js/all.js'
      ])
        // If you need to reorder any of the JS files here's an example:
        // .pipe(order([
        //   'dist/js/header.js',
        //   'dist/js/button.js',
        //   'dist/js/*.js'
        // ], { base: './' }))
        .pipe(concat('scripts.js'))
        .pipe(dest('./dist/js'))
    );
  }
};
