var pkg = require('../../package.json');
var gutil = require('gulp-util');
var chalk = gutil.colors;
var notifier = require('node-notifier');

var shellPrefix = '$';

function drawFlag () {

  // American Flag in ASCII
  //
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.blue('xxxxxxxxxxxxxxxxxxxxxxxxxxxx'),
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.white('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );
  gutil.log(
    chalk.red('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
  );

}

function notify (title, message, wait) {
  notifier.notify({
    title: title,
    message: message,
    icon: 'src/img/favicons/favicon-192.png',
    wait: wait,
  });
}

module.exports = {

  pkg: {

    name: pkg.name,
    version: pkg.version,

  },

  dirName: pkg.name + '-' + pkg.version,

  logIntroduction: function (message) {

    message = message || 'U.S. Web Design Standards';

    gutil.log(
      chalk.yellow('v' + pkg.version),
      message
    );
    drawFlag();
    //gutil.log(
      //chalk.yellow('v' + pkg.version),
      //'The following gulp commands are available'
    //);

  },

  logCommand: function (name, message) {

    gutil.log(
      shellPrefix,
      chalk.cyan(name),
      chalk.magenta(message)
    );

  },

  logHelp: function (name, message) {

    gutil.log(
      shellPrefix,
      chalk.cyan(name),
      chalk.yellow(message)
    );

  },

  logData: function (name, message) {

    gutil.log(
      chalk.cyan(name),
      chalk.yellow(message)
    );

  },

  logError: function (name, message) {

    gutil.log(
      chalk.red(name),
      chalk.yellow(message)
    );
    notify(this.dirName + ' gulp ' + name, message, true);

  },

  logMessage: function (name, message) {

    gutil.log(
      chalk.cyan(name),
      chalk.green(message)
    );
    notify(this.dirName + ' gulp ' + name, message, false);

  },

};
