'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const pkg = require('../../package.json');
const { distCssPath, runGulp } = require('./util');

before(function () {
  this.timeout(20000);
  return runGulp('sass');
});

describe('build output', function () {

  it('generates CSS at dist/css/uswds.css', function () {
    const distFilename = path.join(distCssPath, 'uswds.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

  it('generates minified CSS at dist/css/uswds.min.css', function () {
    const distFilename = path.join(distCssPath, 'uswds.min.css');
    assert.ok(
      fs.existsSync(distFilename),
      'the file does not exist: ' + distFilename
    );
  });

});

describe('version output', function () {
  const versionString = '/*! uswds v' + pkg.version + ' */';

  const checkVersion = (filename, done) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, (error, buffer) => {
        if (error) {
          return reject(error);
        }

        const css = buffer.toString();
        assert.ok(
          css.indexOf(versionString) > -1,
          'CSS does not include version string: "' +
            css.substr(0, 24) + '"...'
        );
        resolve();
      });
    });
  };

  it('includes the current version text in uswds.css', function () {
    const distFilename = path.join(distCssPath, 'uswds.css');
    return checkVersion(distFilename);
  });

  it('includes the current version text in uswds.min.css', function () {
    const distFilename = path.join(distCssPath, 'uswds.min.css');
    return checkVersion(distFilename);
  });

});
