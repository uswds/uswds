var gulp = require( 'gulp' );
var gutil = require( 'gulp-util' );
var spawn = require( 'child_process' ).spawn;

gulp.task( 'bundle-gems', function ( done ) {

  var bundle = spawn( './go', [ 'update_gems' ] );

  bundle.stdout.on( 'data', function ( data ) {

    if ( /[\w\d]+/.test( data ) ) {
      gutil.log(
        gutil.colors.cyan( 'bundle-gems' ),
        gutil.colors.yellow( data )
      );
    }

  } );

  bundle.on( 'error', function ( error ) { done( error ); } );

  bundle.on( 'close', function ( code ) { if ( 0 === code ) { done(); } } );

} );

gulp.task( 'website', function ( done ) {

  gutil.log(
    '$',
    gutil.colors.cyan( 'gulp website' ),
    gutil.colors.yellow( 'This is the default website task. Please review the available commands.' )
  );
  gutil.log(
    '$',
    gutil.colors.cyan( 'gulp website:build' ),
    gutil.colors.magenta( 'Build the website.' )
  );
  gutil.log(
    '$',
    gutil.colors.cyan( 'gulp website:serve' ),
    gutil.colors.magenta( 'Preview the website locally and rebuild it when files change.' )
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
        gutil.log(
          gutil.colors.cyan( 'website:watch' ),
          gutil.colors.green( data )
        );
      } else {
        gutil.log(
          gutil.colors.cyan( 'website:watch' ),
          gutil.colors.yellow( data )
        );
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
      gutil.log(
        gutil.colors.cyan( 'website:build' ),
        gutil.colors.yellow( data )
      );

    }

  } );

  jekyll.on( 'error', function ( error ) { done( error ); } );

  jekyll.on( 'close', function ( code ) { if ( 0 === code ) { done(); } } );

} );
