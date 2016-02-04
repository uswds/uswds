var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var task = /([\w\d-_]+)\.js$/.exec( __filename )[ 1 ];

gulp.task( task, function ( done ) {

  dutil.logMessage( task, 'Copying Images' );

  var stream = gulp.src( 'src/img/**/*' )
    .pipe( gulp.dest( 'dist/img' ) );

  if ( cFlags.gem ) {
    dutil.logMessage( task, 'Creating gem directories' );
    stream = stream.pipe( gulp.dest( 'dist-gem/assets/images' ) );
    stream = stream.pipe( gulp.dest( 'dist-gem/app/assets/img' ) );
  }

  return stream;

} );
