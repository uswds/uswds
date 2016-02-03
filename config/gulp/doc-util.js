var version = require( '../../package.json' ).version;
var gutil = require( 'gulp-util' );

var shellPrefix = '$';

function drawFlag () {

  // American Flag in ASCII
  //
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.blue( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx' ),
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.white( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );
  gutil.log(
    gutil.colors.red( 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' )
  );

}

module.exports = {

  logIntroduction: function ( message ) {

    message = message || 'Draft U.S. Web Design Standards';

    gutil.log(
      gutil.colors.yellow( 'v' + version ),
      message
    );
    drawFlag();
    gutil.log(
      gutil.colors.yellow( 'v' + version ),
      'The following gulp commands are available'
    );

  },

  logCommand: function ( name, message ) {

    gutil.log(
      shellPrefix,
      gutil.colors.cyan( name ),
      gutil.colors.magenta( message )
    );

  },

  logHelp: function ( name, message ) {

    gutil.log(
      shellPrefix,
      gutil.colors.cyan( name ),
      gutil.colors.yellow( message )
    );

  },

  logData: function ( name, message ) {

    gutil.log(
      gutil.colors.cyan( name ),
      gutil.colors.yellow( messsage )
    );

  },

  logMessage: function ( name, message ) {

    gutil.log(
      gutil.colors.cyan( name ),
      gutil.colors.green( messsage )
    );

  },

};
