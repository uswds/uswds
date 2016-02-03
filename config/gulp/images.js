var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

gulp.task( 'images', function ( done ) {

  dutil.logMessage( 'images', 'Images are being copied to dist/img' );

  return gulp.src( 'src/img/**/*' )
    .pipe( gulp.dest( 'dist/img' ) );

} );
