var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var task = /([\w\d-_]+)\.js$/.exec( __filename )[ 1 ];

gulp.task( task, function ( done ) {

  // TODO: Release automation tasks are TBD
  var proposedReleaseTasks = [
    'build',
    'zip-archives',
  ];
  dutil.logMessage( task, 'Release automation tasks are TBD.' );
  done();

} );
