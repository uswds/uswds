var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var dutil = require( './doc-util' );
var browserify = require( 'browserify' );
var buffer = require( 'vinyl-buffer' );
var source = require( 'vinyl-source-stream' );
var uglify = require( 'gulp-uglify' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );
var assert = require( 'gulp-if' );
var linter = require( 'gulp-eslint' );
var task = /([\w\d-_]+)\.js$/.exec( __filename )[ 1 ];

gulp.task( 'eslint', function ( done ) {

  if ( ! cFlags.test ) {
    dutil.logMessage( 'eslint', 'Skipping linting of JavaScript files.' );
    return done();
  }

  return gulp.src( [ 'src/js/**/*.js', '!src/js/vendor/**/*.js' ] )
    .pipe( linter( '.eslintrc' ) )
    .pipe( linter.format() );

} );

gulp.task( task, [ 'eslint' ], function ( done ) {

  dutil.logMessage( task, 'Compiling JavaScript' );

  var bundleStream = browserify( {

    entries: 'src/js/start.js',
    debug: true,

  } )
  .bundle()
  .pipe( source( 'components.js' ) )
  .pipe( buffer() )
  .pipe( sourcemaps.init( { loadMaps: true } ) )
  .pipe( assert( cFlags.production, uglify() ) )
  .on( 'error', gutil.log )
  .pipe( sourcemaps.write() )
  .pipe( rename( { basename: dutil.pkg.name } ) )
  .pipe( gulp.dest( 'dist/js' ) );

  if ( cFlags.gem ) {
    dutil.logMessage( task, 'Creating gem directories' );
    bundleStream = bundleStream.pipe( gulp.dest( 'dist-gem/assets/js' ) );
    bundleStream = bundleStream.pipe( gulp.dest( 'dist-gem/app/assets/javascript' ) );
  }

  return bundleStream;

} );
