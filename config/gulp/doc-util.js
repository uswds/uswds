var pkg = require('../../package.json');
var log = require('fancy-log');
var colors = require('ansi-colors');
var notifier = require('node-notifier');

var shellPrefix = '$';

function drawFlag () {

  // American Flag in ASCII
  //
  log(
    colors.white('')
  );
  log(
    colors.white('* * * * * ========================')
  );
  log(
    colors.white('* * * * * ========================')
  );
  log(
    colors.white('* * * * * ========================')
  );
  log(
    colors.white('* * * * * ========================')
  );
  log(
    colors.white('==================================')
  );
  log(
    colors.white('==================================')
  );
  log(
    colors.white('==================================')
  );
  log(
    colors.white('')
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

    message = message || 'U.S. Web Design System';

    log(
      colors.yellow('v' + pkg.version),
      message
    );
    drawFlag();

  },

  logCommand: function (name, message) {

    log(
      shellPrefix,
      colors.cyan(name),
      colors.magenta(message)
    );

  },

  logHelp: function (name, message) {

    log(
      shellPrefix,
      colors.cyan(name),
      colors.yellow(message)
    );

  },

  logData: function (name, message) {

    log(
      colors.cyan(name),
      colors.yellow(message)
    );

  },

  logError: function (name, message) {

    log(
      colors.red(name),
      colors.yellow(message)
    );
    notify(this.dirName + ' gulp ' + name, message, true);

  },

  logMessage: function (name, message) {

    log(
      colors.cyan(name),
      colors.green(message)
    );
    notify(this.dirName + ' gulp ' + name, message, false);

  },

};
