const path = require('path');
const child = require('child_process');
const sass = require('node-sass');

exports.distPath = path.resolve(
  path.join(
    __dirname,
    '../../dist'
  )
);

exports.distCssPath = path.join(exports.distPath, 'css');

exports.distScssPath = path.join(exports.distPath, 'scss');

exports.runGulp = function (task) {
  return new Promise((resolve, reject) => {
    child.spawn(
        './node_modules/.bin/gulp',
        [ task ],
        { stdio: 'ignore' }
      )
      .on('error', reject)
      .on('exit', code => resolve());
  });
};

exports.render = function (data, includePaths) {
  return new Promise((resolve, reject) => {
    sass.render({
      data: data,
      includePaths,
    }, error => {
      error ? reject(error) : resolve();
    });
  });
};