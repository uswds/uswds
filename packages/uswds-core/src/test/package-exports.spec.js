"use strict";

const assert = require("node:assert");
const { createRequire } = require("module");
const path = require("path");

// Resolve all imports the same way a real consumer would —
// using Node's real exports-map resolution against the root package.json.
const requireFromRoot = createRequire(
  path.resolve(__dirname, "../../../../package.json"),
);

// Helper: unwrap .default if the module has the __esModule marker.
// This makes every assertion pass unchanged both before and after
// a module's source is converted from CommonJS to ESM internally.
function unwrap(mod) {
  return mod.default !== undefined ? mod.default : mod;
}

// The 22 component subpaths exposed via package.json#exports["./js/*"].
// Derived from packages/uswds-core/src/js/index.js barrel and the
// packages/usa-*/src/index.js directory scan.
const COMPONENT_SUBPATHS = [
  "usa-accordion",
  "usa-banner",
  "usa-button",
  "usa-character-count",
  "usa-combo-box",
  "usa-date-picker",
  "usa-date-range-picker",
  "usa-file-input",
  "usa-footer",
  "usa-header",
  "usa-in-page-navigation",
  "usa-input-mask",
  "usa-language-selector",
  "usa-modal",
  "_usa-password",
  "usa-range",
  "usa-search",
  "usa-skipnav",
  "usa-table",
  "usa-time-picker",
  "usa-tooltip",
  "usa-validation",
];

// The 22 barrel keys exported by packages/uswds-core/src/js/index.js.
const BARREL_KEYS = [
  "accordion",
  "banner",
  "button",
  "characterCount",
  "comboBox",
  "datePicker",
  "dateRangePicker",
  "fileInput",
  "footer",
  "inPageNavigation",
  "inputMask",
  "languageSelector",
  "modal",
  "navigation",
  "password",
  "range",
  "search",
  "skipnav",
  "table",
  "timePicker",
  "tooltip",
  "validator",
];

describe("package exports surface", function () {
  // ── 1. Per-component subpath resolution ────────────────────────────────────
  // Each component subpath must resolve via require() to a value with
  // callable .on and .off methods, and via import() to a value with
  // callable .on. This assertion is written to pass unchanged both before
  // and after the internal source is converted to ESM.
  COMPONENT_SUBPATHS.forEach(function (name) {
    describe(`@uswds/uswds/js/${name}`, function () {
      it("resolves via require() with callable .on and .off", function () {
        let mod;
        assert.doesNotThrow(() => {
          mod = requireFromRoot(`@uswds/uswds/js/${name}`);
        }, `require('@uswds/uswds/js/${name}') must not throw`);
        const value = unwrap(mod);
        assert.strictEqual(
          typeof value.on,
          "function",
          `${name}: .on must be a function`,
        );
        assert.strictEqual(
          typeof value.off,
          "function",
          `${name}: .off must be a function`,
        );
      });
      it("resolves via import() with callable .on", async function () {
        const mod = await import(`@uswds/uswds/js/${name}`);
        // CJS modules loaded via import() expose the module as .default.
        // ESM modules may expose .on directly or via .default.
        // Check .default first, fall back to the namespace object itself.
        const value = mod.default !== undefined ? mod.default : mod;
        assert.strictEqual(
          typeof value.on,
          "function",
          `${name}: import().on must be a function`,
        );
      });
    });
  });

  // ── 2. Cross-component API surfaces ────────────────────────────────────────
  // These methods are consumed by sibling components and are the APIs most
  // likely to be silently dropped by a naive refactor.
  describe("usa-date-picker cross-component API", function () {
    it("exposes callable getDatePickerContext, isDateInputInvalid, and updateCalendarIfVisible", function () {
      const mod = unwrap(requireFromRoot("@uswds/uswds/js/usa-date-picker"));
      assert.strictEqual(
        typeof mod.getDatePickerContext,
        "function",
        "getDatePickerContext must be a function (used by usa-date-range-picker)",
      );
      assert.strictEqual(
        typeof mod.isDateInputInvalid,
        "function",
        "isDateInputInvalid must be a function (used by usa-date-range-picker)",
      );
      assert.strictEqual(
        typeof mod.updateCalendarIfVisible,
        "function",
        "updateCalendarIfVisible must be a function (used by usa-date-range-picker)",
      );
    });
  });

  describe("usa-combo-box cross-component API", function () {
    it("exposes COMBO_BOX_CLASS string and callable enhanceComboBox", function () {
      const mod = unwrap(requireFromRoot("@uswds/uswds/js/usa-combo-box"));
      assert.strictEqual(
        typeof mod.COMBO_BOX_CLASS,
        "string",
        "COMBO_BOX_CLASS must be a string (used by usa-time-picker)",
      );
      assert.strictEqual(
        typeof mod.enhanceComboBox,
        "function",
        "enhanceComboBox must be a function (used by usa-time-picker)",
      );
    });
  });

  // ── 3. Barrel exports ──────────────────────────────────────────────────────
  // Both barrel paths must resolve to an object with exactly 22 keys,
  // each exposing a callable .on method.
  describe("barrel exports", function () {
    ["@uswds/uswds/js", "@uswds/uswds/src/js/components"].forEach(
      function (barrelPath) {
        it(`${barrelPath} resolves to an object with exactly 22 keys each with callable .on`, function () {
          const barrel = requireFromRoot(barrelPath);
          const actualKeys = Object.keys(barrel).sort();
          const expectedKeys = [...BARREL_KEYS].sort();

          assert.strictEqual(
            actualKeys.length,
            22,
            `Expected 22 barrel keys, got ${actualKeys.length}: ${actualKeys.join(", ")}`,
          );
          assert.deepStrictEqual(
            actualKeys,
            expectedKeys,
            "Barrel keys must match the expected 22 component exports exactly",
          );
          BARREL_KEYS.forEach(function (key) {
            assert.strictEqual(
              typeof barrel[key].on,
              "function",
              `barrel.${key}.on must be a function`,
            );
          });
        });
      },
    );
  });
});
