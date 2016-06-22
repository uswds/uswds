var pkg = require('../../package.json');
var gutil = require('gulp-util');
var notifier = require('node-notifier');

var shellPrefix = '$';

function drawFlag () {

  // American Flag in ASCII
  //
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    gutil.colors.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

}

module.exports = {

  pkg: {

    name: pkg.name,
    version: pkg.version,

  },

  dirName: pkg.name + '-' + pkg.version,

  logIntroduction: function (message) {

    message = message || 'Draft U.S. Web Design Standards';

    gutil.log(
      gutil.colors.yellow('v' + pkg.version),
      message
    );
    drawFlag();
    //gutil.log(
      //gutil.colors.yellow('v' + pkg.version),
      //'The following gulp commands are available'
    //);

  },

  logCommand: function (name, message) {

    gutil.log(
      shellPrefix,
      gutil.colors.cyan(name),
      gutil.colors.magenta(message)
    );

  },

  logHelp: function (name, message) {

    gutil.log(
      shellPrefix,
      gutil.colors.cyan(name),
      gutil.colors.yellow(message)
    );

  },

  logData: function (name, message) {

    gutil.log(
      gutil.colors.cyan(name),
      gutil.colors.yellow(message)
    );

  },

  logError: function (name, message) {

    gutil.log(
      gutil.colors.red(name),
      gutil.colors.yellow(message)
    );
    notifier.notify({
      title: this.dirName + ' ' + name,
      message: message,
      icon: 'src/img/us_flag_small.png',
      wait: true,
    });

  },

  logMessage: function (name, message) {

    gutil.log(
      gutil.colors.cyan(name),
      gutil.colors.green(message)
    );

    notifier.notify({
      title: this.dirName + ' ' + name,
      message: message,
      icon: 'src/img/us_flag_small.png',
    });

  },

};
