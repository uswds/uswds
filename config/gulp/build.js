var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

gulp.task( 'build', [ 'sass', 'javascript', 'images', 'fonts' ], function ( done ) {

  dutil.logIntroduction();
  dutil.logMessage(
    'build',
    'The build task has created dist and dist-gem directories.'
  );
  done();

} );
