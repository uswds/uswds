var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var dutil = require( './doc-util' );
var browserify = require( 'browserify' );
var buffer = require( 'vinyl-buffer' );
var source = require( 'vinyl-source-stream' );
var uglify = require( 'gulp-uglify' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );

gulp.task( 'javascript', function ( done ) {

  var bundleStream = browserify( {

    entries: 'src/js/start.js',
    debug: true,

  } );

  return bundleStream.bundle()
    .pipe( source( 'components.js' ) )
    .pipe( buffer() )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    //.pipe( uglify() )
    .on( 'error', gutil.log )
    .pipe( sourcemaps.write() )
    // TODO: Renaming the components.js file to the package name TBD
    //.pipe( rename( { basename: dutil.pkg.name } ) )
    .pipe( gulp.dest( 'dist/js' ) );

} );
