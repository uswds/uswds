'use strict';

const os = require('os');
const urlParse = require('url').parse;
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const chalk = require('chalk');
const fractal = require('../fractal');
const server = fractal.web.server({ sync: false });
const { fractalLoad } = require('./delayed-root-suite');
const VisualRegressionTester = require('./visual-regression-tester');
const axeTester = require('./axe-tester');

const HOSTNAME = os.hostname().toLowerCase();
const REMOTE_CHROME_URL = process.env[ 'REMOTE_CHROME_URL' ];
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

function launchChromeLocally (headless=true) {
  return chromeLauncher.launch({
    chromeFlags: [
      '--disable-gpu',
      headless ? '--headless' : '',
    ],
  });
}

function getRemoteChrome () {
  const info = urlParse(REMOTE_CHROME_URL);
  if (info.protocol !== 'http:')
    throw new Error(`Unsupported protocol: ${info.protocol}`);
  return new Promise(resolve => {
    resolve({
      host: info.hostname,
      port: info.port,
      kill () { return Promise.resolve(); },
    });
  });
}

function loadPage ({ cdp, url }) {
  const { Page, Network } = cdp;

  return Promise.all([
    Page.enable(),
    Network.enable(),
  ]).then(() => new Promise((resolve, reject) => {
    Network.responseReceived(({ response }) => {
      if (response.status < 400) return;
      reject(new Error(
        `${response.url} returned HTTP ${response.status}!`
      ));
    });
    Network.loadingFailed(details => {
      reject(new Error('A network request failed to load: ' +
                       JSON.stringify(details, null, 2)));
    });
    Page.loadEventFired(() => {
      resolve();
    });
    Page.navigate({ url });
  }));
}

let getChrome = REMOTE_CHROME_URL ? getRemoteChrome : launchChromeLocally;

fractalLoad.then(() => {
  const handles = Array.from(fractal.components.flatten().map(c => c.handle));

  describe('fractal component', () => {
    let chrome;
    let chromeHost;
    let serverUrl;

    // Note that we're not killing the server; this is because
    // the remote chrome instance (if we're using one) may be
    // keeping some network connections to the server alive, which
    // makes it harder to kill, so it's easier to just let mocha
    // terminate the process when it's done running tests.
    before('start fractal server', () => server.start());

    before('initialize chrome', done => {
      getChrome().then(newChrome => {
        chrome = newChrome;
        chromeHost = chrome.host || 'localhost';
        serverUrl = `http://${HOSTNAME}:${server.port}`;
        done();
      }).catch(done);
    });

    after('shutdown chrome', () => {
      return chrome.kill();
    });

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

        before('init chrome debug protocol', done => {
          CDP({
            host: chromeHost,
            port: chrome.port,
          }, client => {
            cdp = client;
            done();
          });
        });

        before(`load component in chrome`, function () {
          const url = `${serverUrl}/components/preview/${handle}`;

          this.timeout(20000);
          return loadPage({ url, cdp });
        });

        before('inject aXe', () => axeTester.load(cdp));

        after('shutdown chrome debug protocol', () => cdp.close());

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
