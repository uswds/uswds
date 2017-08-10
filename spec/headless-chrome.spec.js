'use strict';

const fractal = require('../fractal');
const { fractalLoad } = require('./delayed-root-suite');
const VisualRegressionTester = require('./visual-regression-tester');
const ChromeFractalTester = require('./chrome-fractal-tester');
const axeTester = require('./axe-tester');

const SKIP_COMPONENTS = [
  // Any components that need to be temporarily skipped can be put
  // here. They will be regarded as a "pending test" by Mocha.
];
const DEVICES = [
  {
    name: 'small-desktop',
    metrics: {
      width: 412,
      height: 732,
      deviceScaleFactor: 1,
      mobile: false,
      fitWindow: false,
    },
  },
  {
    name: 'large-desktop',
    metrics: {
      width: 1280,
      height: 732,
      deviceScaleFactor: 1,
      mobile: false,
      fitWindow: false,
    },
  },
];

DEVICES.forEach(d => {
  const m = d.metrics;
  const parts = [ `${m.width}x${m.height}` ];

  if (m.deviceScaleFactor !== 1) parts.push(`@ ${m.deviceScaleFactor}x`);
  if (m.mobile) parts.push('mobile');

  d.description = `${d.name} (${parts.join(' ')})`;
});

fractalLoad.then(() => {
  const handles = Array.from(fractal.components.flatten().map(c => c.handle));
  const chromeFractalTester = new ChromeFractalTester();

  describe('fractal component', () => {
    before('setup ChromeFractalTester', chromeFractalTester.setup);

    after('teardown ChromeFractalTester', chromeFractalTester.teardown);

    if (process.env.ENABLE_SCREENSHOTS) {
      after('create visual regression testing metadata',
            () => VisualRegressionTester.writeMetadata(handles, DEVICES));
    }

    for (let handle of handles) {
      let cdp;

      describe(`"${handle}"`, () => {
        if (SKIP_COMPONENTS.includes(handle)) {
          it('skipping for now. TODO: fix this test!');
          return;
        }

        before('init chrome devtools protocol', () => {
          return chromeFractalTester.createChromeDevtoolsProtocol()
            .then(client => { cdp = client; });
        });

        before(`load fractal component in chrome`, function () {
          this.timeout(20000);
          return chromeFractalTester.loadFractalPreview(cdp, handle);
        });

        before('inject aXe', () => axeTester.load(cdp));

        after('shutdown chrome devtools protocol', () => cdp.close());

        DEVICES.forEach(device => {
          describe(`on ${device.description}`, () => {
            before('set device metrics', () => {
              return cdp.Emulation.setDeviceMetricsOverride(device.metrics);
            });

            it('has no aXe violations', () => axeTester.run(cdp));

            if (process.env.ENABLE_SCREENSHOTS) {
              const vrt = new VisualRegressionTester({ handle, device });
              if (vrt.doesGoldenFileExist()) {
                it('matches golden screenshot',
                   () => vrt.screenshot(cdp)
                            .then(vrt.ensureMatchesGoldenFile));
              } else {
                it('is the new golden screenshot',
                   () => vrt.screenshot(cdp).then(vrt.saveToGoldenFile));
              }
            }
          });
        });
      });
    }
  });
});
