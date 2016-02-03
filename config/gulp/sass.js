var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var sass = require( 'gulp-sass' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );

var files = [

  'src/stylesheets/_scss/all.scss',

];

var options = {

  outputStyle: 'expanded',

};

gulp.task( 'sass', function ( done ) {

  dutil.logMessage( 'sass', 'Compiling Sass for development with sourcemaps into dist/css' );

  return gulp.src( files )
    .pipe( sourcemaps.init() )
    .pipe( sass( options ).on( 'error', sass.logError ) )
    .pipe( sourcemaps.write() )
    .pipe( rename( { basename: dutil.pkg.name } ) )
    .pipe( gulp.dest( 'dist/css' ) );

} );
