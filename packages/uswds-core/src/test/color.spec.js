const assert = require("assert");
const path = require("path");
const sass = require("sass-embedded");

const compile = (source) =>
  sass.compileString(source, {
    loadPaths: [path.resolve(__dirname, "../../..")],
    style: "compressed",
    logger: sass.Logger.silent,
  }).css;

describe("color() token validation", () => {
  [
    { value: '"not-a-color"', token: "not-a-color" },
    { value: '"default"', token: "default" },
    { value: "$theme-table-header-text-color", token: "default" },
  ].forEach(({ value, token }) => {
    it(`reports the invalid token for color(${value})`, () => {
      assert.throws(
        () =>
          compile(
            `@use "uswds-core" as *; .example { color: color(${value}); }`,
          ),
        (error) => {
          assert.ok(
            error.message.includes(
              `'${token}' is not a valid USWDS color token`,
            ),
            error.message,
          );
          assert.ok(!error.message.includes("Undefined variable"));
          return true;
        },
      );
    });
  });

  it("reports the token error through the legacy import entry point", () => {
    assert.throws(
      () =>
        compile(
          '@import "uswds-core"; .example { color: color($theme-table-header-text-color); }',
        ),
      /'default' is not a valid USWDS color token/,
    );
  });

  [
    ['"ink"', "#1b1b1b"],
    ['"blue-60v"', "#005ea2"],
    ['"primary"', "#005ea2"],
    ['"error"', "#d54309"],
  ].forEach(([value, expected]) => {
    it(`preserves the resolved color for ${value}`, () => {
      assert.strictEqual(
        compile(`@use "uswds-core" as *; .example { color: color(${value}); }`),
        `.example{color:${expected}}`,
      );
    });
  });

  it("preserves custom theme colors", () => {
    assert.strictEqual(
      compile(`
        @use "uswds-core" as * with ($theme-color-primary: #123456);
        .example { color: color("primary"); }
      `),
      ".example{color:#123456}",
    );
  });

  it("preserves explicit custom color overrides", () => {
    assert.strictEqual(
      compile(`
        @use "uswds-core" as *;
        .example { color: color(#123456, override, no-warn); }
      `),
      ".example{color:#123456}",
    );
  });

  it("preserves the error for unflagged literal colors", () => {
    assert.throws(
      () =>
        compile('@use "uswds-core" as *; .example { color: color(#123456); }'),
      /Only use quoted color tokens in USWDS functions and mixins/,
    );
  });

  it("preserves the disabled theme token diagnostic", () => {
    assert.throws(
      () =>
        compile(
          '@use "uswds-core" as *; .example { color: color("primary-lightest"); }',
        ),
      /`primary-lightest` is a color that does not exist or is set to false/,
    );
  });
});
