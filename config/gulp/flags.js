var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

global.cFlags = {

  production: false,
  test: false,
  gem: true,

};

gulp.task( 'production', function ( done ) {

  dutil.logMessage( 'production', 'Assets will be production ready.' );
  cFlags.production = true;
  done();

} );

gulp.task( 'no-gem', function ( done ) {

  dutil.logMessage( 'no-gem', 'Disabling gem support for all tasks.' );
  cFlags.gem = false;
  done();

} );

gulp.task( 'test', function ( done ) {

  dutil.logMessage( 'test', 'All assets will run through linting and tests.' );
  cFlags.test = true;
  done();

} );
