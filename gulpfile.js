require( './config/gulp/stylesheet' );
require( './config/gulp/javascript' );
require( './config/gulp/website' );

var gulp = require( 'gulp' );

gulp.task( 'default', function ( done ) {

  console.log( 'gulp is working' );

  done();

} );
