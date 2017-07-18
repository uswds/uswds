'use strict';
const assert = require('assert');
const sassIncludePaths = require('../../sass-include-paths');
const { runGulp, distScssPath, render } = require('./util');

describe('include paths', function () {

  it('can be loaded with @import "uswds"', function () {
    return render('@import "uswds";', sassIncludePaths.all);
  });

  it('can be loaded with @import "all"', function () {
    return render('@import "all";', sassIncludePaths.all);
  });

});

describe('standalone dist scss', function () {

  before(() => {
    return runGulp('copy-dist-sass');
  });

  it('can be loaded with @import "uswds"', function () {
    return render('@import "uswds";', [ distScssPath ]);
  });

});
