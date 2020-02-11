require("sass");
const path = require("path");
const { runGulp, distScssPath, render } = require("./util");

const includePath = path.resolve(path.join(__dirname, "../../src/stylesheets"));

describe("include paths", () => {
  it('can be loaded with @import "uswds"', async () => {
    setTimeout(() => {
      render('@import "uswds";', [includePath]);
    }, 20000);
  });
});

describe("standalone dist scss", () => {
  before(() => {
    setTimeout(() => {
      runGulp("copy-dist-sass");
    }, 20000);
  });

  it('can be loaded with @import "uswds"', () => {
    setTimeout(() => {
      render('@import "uswds";', [distScssPath]);
    }, 20000);
  });
});
