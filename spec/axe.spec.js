'use strict';

const fs = require('fs');
const os = require('os');
const assert = require('assert');
const urlParse = require('url').parse;
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const chalk = require('chalk');
const fractal = require('../fractal');
const server = fractal.web.server({ sync: false });
const { fractalLoad } = require('./delayed-root-suite');

const HOSTNAME = os.hostname().toLowerCase();
const REMOTE_CHROME_URL = process.env[ 'REMOTE_CHROME_URL' ];
const AXE_JS = fs.readFileSync(__dirname + '/../node_modules/axe-core/axe.js');
const AXE_OPTIONS = JSON.stringify({
  rules: {
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    'bypass': { enabled: false },
  },
});
const SKIP_COMPONENTS = [
  'buttons',         // TODO: Resolve color contrast issues and remove.
  'search',          // TODO: Resolve discernible text issues and remove.
];
const SMALL_DESKTOP = {
  width: 412,
  height: 732,
  deviceScaleFactor: 1,
  mobile: false,
  fitWindow: false,
};
const LARGE_DESKTOP = {
  width: 1280,
  height: 732,
  deviceScaleFactor: 1,
  mobile: false,
  fitWindow: false,
};

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

function loadAxe (cdp) {
  return cdp.Runtime.evaluate({
    expression: `${AXE_JS};`,
  }).then(details => {
    assert.deepEqual(details, { result: { type: 'undefined' } },
                     'Evaluating aXe source code should succeed');
  });
}

function runAxe (cdp) {
  return cdp.Runtime.evaluate({
    expression: `(${RUN_AXE_FUNC_JS})(${AXE_OPTIONS})`,
    awaitPromise: true,
  }).then(details => {
    if (details.result.type !== 'string') {
      return Promise.reject(new Error(
        'Unexpected result from aXe JS evaluation: ' +
        JSON.stringify(details.result, null, 2)
      ));
    }
    const viols = JSON.parse(details.result.value);
    if (viols.length > 0) {
      return Promise.reject(new Error(
        `Found ${viols.length} aXe violations: ` +
        JSON.stringify(viols, null, 2) +
        `\nTo debug these violations, install aXe at:\n\n` +
        `  https://www.deque.com/products/axe/\n`
      ));
    }
    return Promise.resolve();
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

// This function is only here so it can be easily .toString()'d
// and run in the context of a web page by Chrome. It will not
// be run in the node context.
const RUN_AXE_FUNC_JS = function runAxe (options) {
  return new Promise((resolve, reject) => {
    window.axe.run(options, (err, results) => {
      if (err) return reject(err);
      resolve(JSON.stringify(results.violations));
    });
  });
}.toString();

let getChrome = REMOTE_CHROME_URL ? getRemoteChrome : launchChromeLocally;

fractalLoad.then(() => {
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

    for (let item of fractal.components.flatten()) {
      let cdp;

      describe(`"${item.handle}"`, () => {
        if (SKIP_COMPONENTS.includes(item.handle)) {
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

        before(`load component in chrome and inject aXe`, function () {
          const url = `${serverUrl}/components/preview/${item.handle}`;

          this.timeout(20000);
          return loadPage({ url, cdp }).then(() => loadAxe(cdp));
        });

        after('shutdown chrome debug protocol', () => {
          return cdp.close();
        });

        it('has no aXe violations on large desktops', () => {
          return cdp.Emulation.setDeviceMetricsOverride(LARGE_DESKTOP)
            .then(() => runAxe(cdp));
        });

        it('has no aXe violations on small desktops', () => {
          return cdp.Emulation.setDeviceMetricsOverride(SMALL_DESKTOP)
            .then(() => runAxe(cdp));
        });

        if (process.env.ENABLE_SCREENSHOTS) {
          const ROOT_DIR = `${__dirname}/..`;
          const REL_DIR = `screenshots`;
          const ABS_DIR = `${ROOT_DIR}/${REL_DIR}`;
          const REL_PATH = `${REL_DIR}/${item.handle}.png`;
          const ABS_PATH = `${ROOT_DIR}/${REL_PATH}`;
          let doCompare = fs.existsSync(ABS_PATH);

          it(doCompare ? 'is identical to previous screenshot'
                       : 'saves screenshot for comparison later', () => {
            const metrics = JSON.parse(JSON.stringify(SMALL_DESKTOP));
            const { Page, Emulation } = cdp;

            metrics.fitWindow = true;

            return Emulation.setDeviceMetricsOverride(metrics)
              .then(() => Page.getLayoutMetrics())
              .then((result) => {
                metrics.height = result.contentSize.height;
                return Emulation.setDeviceMetricsOverride(metrics);
              })
              .then(() => Page.captureScreenshot({ format: 'png' }))
              .then(result => {
                const data = Buffer.from(result.data, 'base64');

                if (doCompare) {
                  const goldenData = fs.readFileSync(ABS_PATH);
                  if (!goldenData.equals(data)) {
                    return Promise.reject(new Error(
                      `Screenshot of "${item.handle}" does not match ` +
                      `${REL_PATH}! If ${REL_PATH} represents an old ` +
                      `screenshot that is no longer valid, please delete it.`
                    ));
                  }
                } else {
                  if (!fs.existsSync(ABS_DIR)) {
                    fs.mkdirSync(ABS_DIR);
                  }

                  fs.writeFileSync(ABS_PATH, data);
                }
              });
          });
        }
      });
    }
  });
});
