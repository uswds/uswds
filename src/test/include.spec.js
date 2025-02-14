require("sass-embedded");
const path = require("path");
const {
  runGulp,
  distScssPath,
  compileString,
  compile
} = require("../../packages/uswds-core/src/js/utils/test/util");

const includePath = path.resolve("packages/");

describe("include paths", () => {
  it('can be loaded with @import "uswds"', async () => {
      compileString(`@import "uswds";`, [includePath]);
  });
});

describe("standalone dist scss", () => {
  // Function expression required to use this.timeout() and prevent test from timing out
  before(async function buildSass() {
      this.timeout(10000)  
      await runGulp("buildUSWDS");
  });

  it('can be loaded with @import "uswds"', () => {
      compile(`${distScssPath}/uswds.scss`, [includePath]);
  });
});
