require('node-sass');
const path = require('path');
const { runGulp, distScssPath, render } = require('./util');

const includePath = path.resolve(
  path.join(
    __dirname,
    '../../src/stylesheets',
  ),
);

describe('include paths', () => {
  it('can be loaded with @import "uswds"', () => {
    render('@import "uswds";', [includePath]);
  });

  it('can be loaded with @import "all"', () => {
    render('@import "all";', [includePath]);
  });
});

describe('standalone dist scss', () => {
  before(() => {
    setTimeout(() => {
      runGulp('copy-dist-sass');
    }, 20000);
  });

  it('can be loaded with @import "uswds"', () => {
    render('@import "uswds";', [distScssPath]);
  });

  it('can be loaded with @import "all"', () => {
    render('@import "all";', [distScssPath]);
  });
});
