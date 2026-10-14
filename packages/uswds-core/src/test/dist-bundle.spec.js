"use strict";

const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("module");
const { JSDOM, VirtualConsole } = require("jsdom");

// Paths to the built artifacts under test.
const DIST = path.resolve(__dirname, "../../../../dist/js");
const BUNDLE_PATH = path.join(DIST, "uswds.min.js");
const BUNDLE_MAP_PATH = path.join(DIST, "uswds.min.js.map");
const INIT_PATH = path.join(DIST, "uswds-init.js");
const INIT_MIN_PATH = path.join(DIST, "uswds-init.min.js");

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
        addEventListener: function () {},
        removeEventListener: function () {},
      };
    };
}

// Use jsdom's actual browser global so globals and event errors are observable.
const browsers = [];
async function loadBundleIntoDOM(
  html = "<!DOCTYPE html><html><body></body></html>",
) {
  const errors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => errors.push(error));
  const dom = new JSDOM(html, { runScripts: "outside-only", virtualConsole });
  const { window: win } = dom;
  stubMatchMedia(win);
  const globalsBefore = new Set(Reflect.ownKeys(win));
  const browser = { dom, win, errors, globalsBefore };
  browsers.push(browser);

  vm.runInContext(
    fs.readFileSync(BUNDLE_PATH, "utf-8"),
    dom.getInternalVMContext(),
  );
  if (win.document.readyState === "loading") {
    await new Promise((resolve) => {
      win.document.addEventListener("DOMContentLoaded", resolve, {
        once: true,
      });
    });
  }
  assert.deepStrictEqual(
    errors,
    [],
    "bundle initialization must not emit browser errors",
  );
  return browser;
}

describe("dist-bundle behavioral characterization", function () {
  // Loading the full 785K bundle takes longer than the default 2s timeout.
  this.timeout(30000);

  let browser;
  let win;

  before(async function () {
    browser = await loadBundleIntoDOM();
    ({ win } = browser);
  });

  afterEach(function () {
    browsers.forEach(({ errors }) => {
      assert.deepStrictEqual(
        errors,
        [],
        "bundle events must not emit browser errors",
      );
    });
  });

  after(function () {
    browsers.forEach(({ dom }) => dom.window.close());
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
  describe("source component barrel", function () {
    it("exposes exactly 22 keys", function () {
      const barrel = requireFromRoot("@uswds/uswds/js");
      assert.deepStrictEqual(
        Object.keys(barrel).sort(),
        [...BARREL_KEYS].sort(),
      );
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
    it("adds only the documented presence flag to window", function () {
      const added = Reflect.ownKeys(win).filter(
        (key) => !browser.globalsBefore.has(key),
      );
      assert.deepStrictEqual(added, ["uswdsPresent"]);
    });

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
    it("toggles aria-expanded and hidden on button click", async function () {
      const { win: testWin } = await loadBundleIntoDOM(
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

  // ── uswds-init ES5 compliance ───────────────────────────────────────────────
  // uswds-init runs in <head> before any feature detection. It must be
  // plain ES5 — no arrow functions, no const/let, no template literals —
  // so it works in the oldest browsers USWDS supports. Both artifacts are
  // checked: minification is its own chance to reintroduce modern syntax.
  [
    ["uswds-init.js", INIT_PATH],
    ["uswds-init.min.js", INIT_MIN_PATH],
  ].forEach(function (artifact) {
    const name = artifact[0];
    const artifactPath = artifact[1];

    describe(name + " ES5 compliance", function () {
      let initCode;

      before(function () {
        initCode = fs.readFileSync(artifactPath, "utf-8");
      });

      it("contains no arrow functions", function () {
        assert.ok(
          !/=>/.test(initCode),
          name + " must not contain arrow functions (=>)",
        );
      });

      it("contains no const or let declarations", function () {
        assert.ok(
          !/\b(const|let)\b/.test(initCode),
          name + " must not use const or let",
        );
      });

      it("contains no template literals", function () {
        assert.ok(
          !/`/.test(initCode),
          name + " must not contain template literals",
        );
      });
    });
  });
});
