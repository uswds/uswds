var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var sass = require( 'gulp-sass' );
var sourcemaps = require( 'gulp-sourcemaps' );
var rename = require( 'gulp-rename' );
var linter = require( 'gulp-scss-lint' );
var task = /([\w\d-_]+)\.js$/.exec( __filename )[ 1 ];

var options = {

  outputStyle: cFlags.production ? 'compressed' : 'expanded',

};

gulp.task( 'scss-lint', function ( done ) {

  if ( ! cFlags.test ) {
    dutil.logMessage( 'scss-lint', 'Skipping linting of Sass files.' );
    return done();
  }

  return gulp.src( 'src/stylesheets/**/*.scss' )
    .pipe( linter( {
      config: '.scss-lint.yml',
    } ) );

} );

gulp.task( task, [ 'scss-lint' ], function ( done ) {

  dutil.logMessage( task, 'Compiling Sass' );

  var stream = gulp.src( 'src/stylesheets/all.scss' )
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
