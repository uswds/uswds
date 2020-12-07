const { fractalLoad } = require("./delayed-root-suite");
const VisualRegressionTester = require("./visual-regression-tester");
const ChromeFractalTester = require("./chrome-fractal-tester");
const axeTester = require("./axe-tester");

class Device {
  constructor(name, metrics) {
    this.name = name;
    this.metrics = Object.assign(
      {
        deviceScaleFactor: 1,
        mobile: false,
        fitWindow: false
      },
      metrics
    );
  }

  get description() {
    const m = this.metrics;
    const parts = [`${m.width}x${m.height}`];

    if (m.deviceScaleFactor !== 1) parts.push(`@ ${m.deviceScaleFactor}x`);
    if (m.mobile) parts.push("mobile");

    return `${this.name} (${parts.join(" ")})`;
  }
}

const SKIP_COMPONENTS = [
  // Any components that need to be temporarily skipped can be put
  // here. They will be regarded as a "pending test" by Mocha.
  "layout--docs",
  "layout--docs-inner",
  "layout--landing-inner",
  "layout--sign-in",
  "layout--sign-in-inner",
  "layout--sign-in-multiple",
  "layout--sign-in-multiple-inner",
  "layout--create-account",
  "layout--create-account-inner",
  "layout--header-empty",
  "layout--federal-employee-sign-in",
  "layout--value-props",
  "header",
  "fonts"
];

const DEVICES = [
  new Device("small-desktop", {
    width: 412,
    height: 732
  }),
  new Device("large-desktop", {
    width: 1280,
    height: 732
  })
];

fractalLoad.then(() => {
  const chromeFractalTester = new ChromeFractalTester();
  const { handles } = chromeFractalTester;

  describe("fractal component", function setupTester() {
    this.timeout(20000);

    before("setup ChromeFractalTester", chromeFractalTester.setup);

    after("teardown ChromeFractalTester", chromeFractalTester.teardown);

    if (process.env.ENABLE_SCREENSHOTS) {
      if (process.env.UPDATE_GOLDEN_SCREENSHOTS) {
        VisualRegressionTester.cleanSync(handles, DEVICES);
      }

      after("create visual regression testing metadata", () =>
        VisualRegressionTester.writeMetadata(handles, DEVICES)
      );
    }

    handles.forEach(handle => {
      let cdp;

      describe(`"${handle}"`, () => {
        if (SKIP_COMPONENTS.includes(handle)) {
          it("Skipping for now. TODO: fix this test!");
          return;
        }

        before("init chrome devtools protocol", () => {
          return chromeFractalTester
            .createChromeDevtoolsProtocol()
            .then(client => {
              cdp = client;
            });
        });

        before("load fractal component in chrome", function waitBeforeChrome() {
          this.timeout(20000);
          return chromeFractalTester.loadFractalPreview(cdp, handle);
        });

        before("inject aXe", () => axeTester.load(cdp));

        after("shutdown chrome devtools protocol", () => cdp.close());

        DEVICES.forEach(device => {
          describe(`on ${device.description}`, () => {
            before("set device metrics", () =>
              cdp.Emulation.setDeviceMetricsOverride(device.metrics)
            );

            it('has no aXe violations', () => axeTester.run({ cdp }));
            it('shows aXe warnings', () => axeTester.run({ cdp, warn: true }));

            if (process.env.ENABLE_SCREENSHOTS) {
              const vrt = new VisualRegressionTester({ handle, device });
              if (vrt.doesGoldenFileExist()) {
                it("matches golden screenshot", () =>
                  vrt.screenshot(cdp).then(vrt.ensureMatchesGoldenFile));
              } else {
                it("is the new golden screenshot", () =>
                  vrt.screenshot(cdp).then(vrt.saveToGoldenFile));
              }
            }
          });
        });
      });
    });
  });
});
