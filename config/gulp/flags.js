var gulp = require( 'gulp' );
var dutil = require( './doc-util' );

global.cFlags = {

  production: false,
  gem: true,

};

gulp.task( 'production', function ( done ) {

  dutil.logMessage( 'production', 'Assets will be production ready' );
  cFlags.production = true;
  done();

} );

gulp.task( 'no-gem', function ( done ) {

  dutil.logMessage( 'no-gem', 'Disabling gem support' );
  cFlags.gem = false;
  done();

} );
