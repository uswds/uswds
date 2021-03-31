const { src } = require('gulp');
const gulpStylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

module.exports = {
  // Lint Sass based on .stylelintrc.yml config.
  lintSass () {
    return src(['./src/patterns/stylesheets/**/*.scss'])
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
  lintJS () {
    return src(['src/patterns/**/**/*.js'])
      .pipe(eslint({ fix: true }))
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  }
};
