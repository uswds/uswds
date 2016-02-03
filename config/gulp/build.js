var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

gulp.task( 'build', function ( done ) {

  dutil.logIntroduction();
  dutil.logHelp( 'build', 'The default build task used to reference other build tasks' );
  dutil.logCommand(
    'build:npm',
    'This build task creates an npm consumable version of the package in the dist/ directory.'
  );
  dutil.logCommand(
    'build:gem',
    'This build task creates a Ruby gem version consumable version of the package in the dist-gem/ directory.'
  );
  done();

} );

gulp.task( 'build:npm', [ 'sass', 'javascript', 'images', 'fonts' ], function ( done ) {

  dutil.logMessage( 'build:npm', 'Files are contained in the dist/ directory.' );
  done();

} );

gulp.task( 'build:gem', [ 'build:npm' ], function ( done ) {

  dutil.logMessage(
    'build:gem',
    'Files related to the ruby gem are contained in the dist-gem/ directory'
  );

  return gulp.src( 'dist/**/*' )
    .pipe( gulp.dest( 'dist-gem/assets' ) )
    .pipe( gulp.dest( 'dist-gem/app' ) );

} );


