var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var sass = require( 'gulp-sass' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );
var task = /([\w\d-_]+)\.js$/.exec( __filename )[ 1 ];

var files = [

  'src/stylesheets/_scss/all.scss',

];

var options = {

  outputStyle: cFlags.production ? 'compressed' : 'expanded',

};

gulp.task( task, function ( done ) {

  dutil.logMessage( task, 'Compiling Sass' );

  var stream = gulp.src( files )
    .pipe( sourcemaps.init() )
    .pipe( sass( options ).on( 'error', sass.logError ) )
    .pipe( sourcemaps.write() )
    .pipe( rename( { basename: dutil.pkg.name } ) )
    .pipe( gulp.dest( 'dist/css' ) );

  if ( cFlags.gem ) {
    dutil.logMessage( task, 'Creating gem directories' );
    stream = stream.pipe( gulp.dest( 'dist-gem/assets/css' ) );
    stream = stream.pipe( gulp.dest( 'dist-gem/app/assets/stylesheets' ) );
  }

  return stream;

} );
