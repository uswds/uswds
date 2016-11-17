var assert = require('assert');
var sass = require('node-sass');
var path = require('path');

var includePath = path.resolve(
  path.join(
    __dirname,
    '../../src/stylesheets'
  )
);

var render = function (data, done) {
  return sass.render({
    data: data,
    includePaths: [
      includePath,
    ],
  }, done);
};

describe('include paths', function () {

  it('can be loaded with @import "uswds"', function (done) {
    render('@import "uswds";', done);
  });

  it('can be loaded with @import "all"', function (done) {
    render('@import "all";', done);
  });

});
