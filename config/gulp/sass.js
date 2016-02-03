var gulp = require( 'gulp' );
var sass = require( 'gulp-sass' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );

var files = [

  // README: These files do not need to be explicitly brought into the `sass` task.
  //'stylesheets/_scss/lib/bourbon/**/*.scss',
  //'stylesheets/_scss/lib/neat/**/*.scss',
  //'stylesheets/_scss/core/*.scss',
  //'stylesheets/_scss/components/*.scss',
  //'stylesheets/_scss/elements/*.scss',
  'src/stylesheets/_scss/all.scss',

];

var options = {

  outputStyle: 'expanded',

};

gulp.task( 'sass', function ( done ) {

  return gulp.src( files )
    .pipe( sourcemaps.init() )
    .pipe( sass( options ).on( 'error', sass.logError ) )
    .pipe( sourcemaps.write() )
    .pipe( rename( { basename: 'uswds' } ) )
    .pipe( gulp.dest( 'dist/css' ) );

} );
