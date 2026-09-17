const assert = require("assert");
const path = require("path");
const sass = require("sass-embedded");

const loadPaths = [path.resolve(__dirname, "../../..")];

const compile = (source) =>
  sass.compileString(source, {
    loadPaths,
    style: "compressed",
    logger: sass.Logger.silent,
  }).css;

const withCore = (source) => `@use "uswds-core" as *; ${source}`;

// Verify the public Sass entry point used by the shadow token documentation.
describe("shadow()", () => {
  const tokens = new Map([
    ["none", "none"],
    [1, "0 1px .25rem 0 rgba(0,0,0,.1)"],
    [2, "0 .25rem .5rem 0 rgba(0,0,0,.1)"],
    [3, "0 .5rem 1rem 0 rgba(0,0,0,.1)"],
    [4, "0 .75rem 1.5rem 0 rgba(0,0,0,.1)"],
    [5, "0 1rem 2rem 0 rgba(0,0,0,.1)"],
  ]);

  tokens.forEach((expected, token) => {
    it(`compiles shadow token ${token} to its CSS value`, () => {
      const css = compile(
        withCore(`.example { box-shadow: shadow(${token}); }`),
      );
      assert.strictEqual(css, `.example{box-shadow:${expected}}`);
    });
  });

  it("accepts the quoted none token", () => {
    const css = compile(withCore('.example { box-shadow: shadow("none"); }'));
    assert.strictEqual(css, ".example{box-shadow:none}");
  });

  it("exports shadow through the public module namespace", () => {
    const css = compile(
      '@use "uswds-core"; .example { box-shadow: uswds-core.shadow(2); }',
    );
    assert.strictEqual(css, `.example{box-shadow:${tokens.get(2)}}`);
  });

  it("exports shadow through the functions module", () => {
    const css = compile(
      '@use "uswds-core/src/styles/functions" as tokens; .example { box-shadow: tokens.shadow(2); }',
    );
    assert.strictEqual(css, `.example{box-shadow:${tokens.get(2)}}`);
  });

  it("respects the configured root font size", () => {
    const css = compile(`
      @use "uswds-core" as * with ($theme-respect-user-font-size: false, $theme-root-font-size: 20px);
      .example { box-shadow: shadow(2); }
    `);
    assert.strictEqual(
      css,
      ".example{box-shadow:0 .2rem .4rem 0 rgba(0,0,0,.1)}",
    );
  });

  it("supports multiple shadows in one declaration", () => {
    const css = compile(
      withCore(".example { box-shadow: shadow(1), shadow(2); }"),
    );
    assert.strictEqual(
      css,
      `.example{box-shadow:${tokens.get(1)},${tokens.get(2)}}`,
    );
  });

  [0, 6, '"unknown"'].forEach((token) => {
    it(`rejects invalid shadow token ${token}`, () => {
      assert.throws(
        () => compile(withCore(`.example { box-shadow: shadow(${token}); }`)),
        /is not a valid `box-shadow` token/,
      );
    });
  });
});
