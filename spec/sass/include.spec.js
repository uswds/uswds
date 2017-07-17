'use strict';
const assert = require('assert');
const sass = require('node-sass');
const sassIncludePaths = require('../../sass-include-paths');

const render = function (data) {
  return new Promise((resolve, reject) => {
    sass.render({
      data: data,
      includePaths: sassIncludePaths.all,
    }, error => {
      error ? reject(error) : resolve();
    });
  });
};

describe('include paths', function () {

  it('can be loaded with @import "uswds"', function () {
    return render('@import "uswds";');
  });

  it('can be loaded with @import "all"', function () {
    return render('@import "all";');
  });

});
