var assert = require('assert');
var child = require('child_process');
var fs = require('fs');
var path = require('path');
var pkg = require('../../package.json');

var localPath = 'dist/html';

var distPath = path.resolve(
  path.join(
    __dirname,
    '../..',
    localPath
  )
);

var build = function (done) {
  console.time('build');
  child.exec('`npm bin`/gulp html', {}, function () {
    console.timeEnd('build');
    done();
  });
};

var pages = [ 'docs', 'landing' ];

var fileContains = function (filename, str) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filename, function (error, buffer) {
      return error
        ? reject(error)
        : buffer.toString().indexOf(str) > -1
          ? resolve() : reject('string not found');
    });
  });
};

var fileExists = function (filename) {
  return new Promise(function (resolve, reject) {
    fs.exists(filename, function (exists) {
      return exists
        ? resolve()
        : reject('file does not exist: ' + filename);
    });
  });
};

var directoryExists = function (filename) {
  return new Promise(function (resolve, reject) {
    fs.stat(filename, function (error, stat) {
      return error
        ? reject(error)
        : stat.isDirectory()
          ? resolve()
          : reject(filename + ' is not a directory');
    });
  });
};

before(function (done) {
  this.timeout(15000);
  build(done);
});

xdescribe('HTML output', function () {

  var versionString = '<!-- uswds@' + pkg.version + ' -->';

  it('creates the ' + localPath + ' directory', function () {
    return directoryExists(distPath);
  });

  pages.forEach(function (page) {

    describe(page + ' page', function () {
      var filename = 'page-' + page + '.html';
      var distFilename = path.join(distPath, filename);
      var localFilename = path.join(localPath, filename);

      it('generates an HTML file at ' + localFilename, function () {
        return fileExists(distFilename);
      });

      it('includes the package name and version in an HTML comment', function () {
        return fileContains(distFilename, versionString);
      });

    });

  });

});
