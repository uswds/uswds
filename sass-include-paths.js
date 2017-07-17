var path = require('path');

exports.firstParty = [path.join(__dirname, 'src', 'stylesheets')];

exports.thirdParty = [
  path.dirname(require.resolve('normalize.css'))
].concat(require('bourbon').includePaths)
 .concat(require('bourbon-neat').includePaths);

exports.all = exports.firstParty.concat(exports.thirdParty);
