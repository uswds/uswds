// Bring in individual Gulp configurations
//
require( './config/gulp/sass' );
require( './config/gulp/javascript' );
require( './config/gulp/images' );
require( './config/gulp/fonts' );
require( './config/gulp/website' );

var gulp = require( 'gulp' );
var dutil = require( './config/gulp/doc-util' );

gulp.task( 'default', function ( done ) {

  dutil.logIntroduction();

  dutil.logHelp(
    'gulp',
    'This task will output the currently supported automation tasks.'
  );

  dutil.logCommand(
    'gulp sass',
    'This task will build a uswds.css file in the dist/ directory using node-sass.'
  );

  dutil.logCommand(
    'gulp javascript',
    'This task will build a component.js file in the dist/ directory using browserify.'
  );

  dutil.logHelp(
    'gulp website',
    'This is the default website task. Please review the available commands.'
  );

  dutil.logCommand(
    'gulp website:build',
    'Build the website.'
  );

  dutil.logCommand(
    'gulp website:serve',
    'Preview the website locally and rebuild it when files change.'
  );

  done();

} );
