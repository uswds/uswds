"use strict";

const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("module");
const { JSDOM } = require("jsdom");

// Paths to the built artifacts under test.
const DIST = path.resolve(__dirname, "../../../../dist/js");
const BUNDLE_PATH = path.join(DIST, "uswds.min.js");
const BUNDLE_MAP_PATH = path.join(DIST, "uswds.min.js.map");
const INIT_PATH = path.join(DIST, "uswds-init.js");

// The 22 component barrel keys exposed by the bundle.
// Two do not match their package directory name 1:1:
//   navigation -> usa-header package
//   password   -> _usa-password package
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

// The 22 component subpaths used to verify the shared behavior interface.
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

// Resolve imports the same way a real consumer would — using Node's real
// exports-map resolution against the root package.json.
const requireFromRoot = createRequire(
  path.resolve(__dirname, "../../../../package.json"),
);

// Helper: unwrap .default if the module has the __esModule marker or .default
// is present (CJS modules loaded via import() expose the module as .default).
function unwrap(mod) {
  return mod.default !== undefined ? mod.default : mod;
}

// Stub matchMedia — jsdom does not implement it but USWDS components use it.
function stubMatchMedia(win) {
  win.matchMedia =
    win.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };
}

// Build a vm context wired to the given jsdom window with all browser
// globals the USWDS bundle expects.
function buildContext(win) {
  return vm.createContext({
    window: win,
    document: win.document,
    navigator: win.navigator,
    location: win.location,
    Element: win.Element,
    HTMLElement: win.HTMLElement,
    MutationObserver: win.MutationObserver,
    NodeList: win.NodeList,
    Event: win.Event,
    CustomEvent: win.CustomEvent,
    MouseEvent: win.MouseEvent,
    console,
  });
}

// Load the built JS bundle into a fresh jsdom window context and return
// the window object. Uses Node's vm module so the bundle runs as a plain
// browser script (no module system), matching how a real browser loads it.
function loadBundleIntoDOM() {
  const bundleCode = fs.readFileSync(BUNDLE_PATH, "utf-8");
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", {
    runScripts: "outside-only",
    resources: "usable",
  });
  const { window: win } = dom;
  stubMatchMedia(win);
  const context = buildContext(win);
  vm.runInContext(bundleCode, context);
  return win;
}

describe("dist-bundle behavioral characterization", function () {
  // Loading the full 785K bundle takes longer than the default 2s timeout.
  this.timeout(30000);

  let win;

  before(function () {
    win = loadBundleIntoDOM();
  });

  // ── window.uswdsPresent ─────────────────────────────────────────────────────
  // THE most important assertion. If dead-code elimination ever strips
  // window.uswdsPresent = true from start.js, every USWDS site silently
  // stops initializing with no error and no visible difference in a screenshot.
  describe("window.uswdsPresent", function () {
    it("is set to true after the bundle runs", function () {
      assert.strictEqual(
        win.uswdsPresent,
        true,
        "window.uswdsPresent must be true — it is polled by uswds-init.js to know when USWDS has loaded",
      );
    });
  });

  // ── Component barrel ────────────────────────────────────────────────────────
  describe("component barrel", function () {
    it("exposes exactly 22 keys", function () {
      assert.strictEqual(BARREL_KEYS.length, 22);
    });
  });

  // ── Component behavior interface ────────────────────────────────────────────
  // Every component must expose callable .on, .off, .add, and .remove methods.
  // This is the shared behavior interface all USWDS components implement.
  describe("component behavior interface", function () {
    COMPONENT_SUBPATHS.forEach(function (name) {
      it(`${name} has callable .on, .off, .add, and .remove`, function () {
        const mod = unwrap(requireFromRoot(`@uswds/uswds/js/${name}`));
        assert.strictEqual(
          typeof mod.on,
          "function",
          `${name}.on must be a function`,
        );
        assert.strictEqual(
          typeof mod.off,
          "function",
          `${name}.off must be a function`,
        );
        assert.strictEqual(
          typeof mod.add,
          "function",
          `${name}.add must be a function`,
        );
        assert.strictEqual(
          typeof mod.remove,
          "function",
          `${name}.remove must be a function`,
        );
      });
    });
  });

  // ── No global leaks ─────────────────────────────────────────────────────────
  // README documents that USWDS components are NOT accessible in the global
  // browser scope by default. Assert this stays true.
  describe("no global leaks", function () {
    const FORBIDDEN_GLOBALS = [
      "uswds",
      "USWDS",
      "require",
      "module",
      "exports",
      "define",
    ];

    FORBIDDEN_GLOBALS.forEach(function (name) {
      it(`window.${name} is undefined`, function () {
        assert.strictEqual(
          win[name],
          undefined,
          `window.${name} must not be exposed globally by the bundle`,
        );
      });
    });
  });

  // ── End-to-end accordion interaction ────────────────────────────────────────
  // Exercises the full behavior-wiring chain through actual minification,
  // not just "the file parses."
  describe("accordion end-to-end interaction", function () {
    it("toggles aria-expanded and hidden on button click", function () {
      const dom = new JSDOM(
        `<!DOCTYPE html><html><body>
          <ul class="usa-accordion">
            <li>
              <button
                type="button"
                class="usa-accordion__button"
                aria-expanded="false"
                aria-controls="collapsible-1"
              >
                Section one
              </button>
              <div
                id="collapsible-1"
                class="usa-accordion__content"
                hidden
              ></div>
            </li>
          </ul>
        </body></html>`,
        { runScripts: "outside-only" },
      );

      const { window: testWin } = dom;
      stubMatchMedia(testWin);

      const bundleCode = fs.readFileSync(BUNDLE_PATH, "utf-8");
      const context = buildContext(testWin);
      vm.runInContext(bundleCode, context);

      // DOMContentLoaded has already fired in jsdom before the bundle runs
      // in a vm context. Re-dispatch it so USWDS wires up component behaviors.
      testWin.document.dispatchEvent(
        new testWin.Event("DOMContentLoaded", { bubbles: true }),
      );

      const button = testWin.document.querySelector(".usa-accordion__button");
      const panel = testWin.document.querySelector(".usa-accordion__content");

      assert.ok(button, "accordion button must exist in the DOM");
      assert.ok(panel, "accordion content panel must exist in the DOM");

      button.dispatchEvent(new testWin.MouseEvent("click", { bubbles: true }));

      assert.strictEqual(
        button.getAttribute("aria-expanded"),
        "true",
        "aria-expanded must flip to 'true' after click",
      );
      assert.strictEqual(
        panel.hasAttribute("hidden"),
        false,
        "hidden attribute must be removed from the panel after click",
      );
    });
  });

  // ── Sourcemap sanity ────────────────────────────────────────────────────────
  describe("sourcemap", function () {
    it("exists and contains sourcesContent", function () {
      assert.ok(
        fs.existsSync(BUNDLE_MAP_PATH),
        `sourcemap must exist at ${BUNDLE_MAP_PATH}`,
      );
      const map = JSON.parse(fs.readFileSync(BUNDLE_MAP_PATH, "utf-8"));
      assert.ok(
        Array.isArray(map.sourcesContent) && map.sourcesContent.length > 0,
        "sourcemap must have a non-empty sourcesContent array",
      );
    });

    it("sources array references a real USWDS package", function () {
      const map = JSON.parse(fs.readFileSync(BUNDLE_MAP_PATH, "utf-8"));
      assert.ok(
        Array.isArray(map.sources) &&
          map.sources.some((s) => s.includes("usa-accordion")),
        "sourcemap sources must contain at least one path referencing usa-accordion",
      );
    });
  });

  // ── uswds-init.js ES5 compliance ────────────────────────────────────────────
  // uswds-init.js runs in <head> before any feature detection. It must be
  // plain ES5 — no arrow functions, no const/let, no template literals —
  // so it works in the oldest browsers USWDS supports.
  describe("uswds-init.js ES5 compliance", function () {
    let initCode;

    before(function () {
      initCode = fs.readFileSync(INIT_PATH, "utf-8");
    });

    it("contains no arrow functions", function () {
      assert.ok(
        !/=>/.test(initCode),
        "uswds-init.js must not contain arrow functions (=>)",
      );
    });

    it("contains no const or let declarations", function () {
      assert.ok(
        !/\b(const|let)\b/.test(initCode),
        "uswds-init.js must not use const or let",
      );
    });

    it("contains no template literals", function () {
      assert.ok(
        !/`/.test(initCode),
        "uswds-init.js must not contain template literals",
      );
    });
  });
});
