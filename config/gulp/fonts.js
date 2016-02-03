var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

gulp.task( 'fonts', function ( done ) {

  dutil.logMessage( 'fonts', 'Font files are being copied to dist/fonts' );

  return gulp.src( 'src/fonts/**/*' )
    .pipe( gulp.dest( 'dist/fonts' ) );

} );
