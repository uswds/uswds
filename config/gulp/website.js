var gulp = require( 'gulp' );
var dutil = require( './doc-util' );
var spawn = require( 'child_process' ).spawn;

gulp.task( 'bundle-gems', function ( done ) {

  var bundle = spawn( './go', [ 'update_gems' ] );

  bundle.stdout.on( 'data', function ( data ) {

    if ( /[\w\d]+/.test( data ) ) {

      dutil.logData( 'bundle-gems', data );

    }

  } );

  bundle.on( 'error', function ( error ) { done( error ); } );

  bundle.on( 'close', function ( code ) { if ( 0 === code ) { done(); } } );

} );

gulp.task( 'website', function ( done ) {

  dutil.logIntroduction();

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

gulp.task( 'website:serve', [ 'bundle-gems' ], function ( done ) {

  var jekyll = spawn( './go', [ 'serve' ] );

  jekyll.stdout.on( 'data', function ( data ) {

    if ( /[\w\d]+/.test( data ) ) {

      data += '';
      data = data.replace( /[\s]+/g, ' ' );

      if ( /done|regen/i.test( data ) ) {

        dutil.logMessage( 'website:watch', data );

      } else {

        dutil.logData( 'website:watch', data );

      }

    }

  } );

  jekyll.on( 'error', function ( error ) { done( error ); } );

  jekyll.on( 'close', function ( code ) { if ( 0 === code ) { done(); } } );


} );

gulp.task( 'website:build', [ 'bundle-gems' ], function ( done ) {

  var jekyll = spawn( './go', [ 'build' ] );

  jekyll.stdout.on( 'data', function ( data ) {

    if ( /[\w\d]+/.test( data ) ) {

      data += '';
      data = data.replace( /[\s]+/g, ' ' );
      dutil.logData( 'website:watch', data );

    }

  } );

  jekyll.on( 'error', function ( error ) { done( error ); } );

  jekyll.on( 'close', function ( code ) { if ( 0 === code ) { done(); } } );

} );
