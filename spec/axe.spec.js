'use strict';

const fs = require('fs');
const os = require('os');
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
    'document-title': { enabled: false },  // TODO: Remove eventually.
    'html-has-lang': { enabled: false },   // TODO: Remove eventually.
    'frame-title': { enabled: false },     // TODO: Remove eventually.
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    'bypass': { enabled: false },
  },
});
const SKIP_COMPONENTS = [
  'header',          // TODO: Resolve duplicate id errors and remove.
  'buttons',         // TODO: Resolve color contrast issues and remove.
];
const DEVICE_METRICS = {
  width: 412,
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

function runAxe ({ cdp, url }) {
  const { Page, Network, Runtime, Emulation } = cdp;

  return Promise.all([
    Page.enable(),
    Network.enable(),
    Emulation.setDeviceMetricsOverride(DEVICE_METRICS),
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
      Runtime.evaluate({
        expression: `${AXE_JS};(${RUN_AXE_FUNC_JS})(${AXE_OPTIONS})`,
        awaitPromise: true,
      }).then(details => {
        if (details.result.type !== 'string') {
          return reject(new Error(
            'Unexpected result from aXe JS evaluation: ' +
            JSON.stringify(details.result, null, 2)
          ));
        }
        const viols = JSON.parse(details.result.value);
        if (viols.length > 0) {
          return reject(new Error(
            `Found ${viols.length} aXe violations: ` +
            JSON.stringify(viols, null, 2) +
            `\nTo debug these violations, install aXe at:\n\n` +
            `  https://www.deque.com/products/axe/\n`
          ));
        }
        resolve();
      });
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
      if (SKIP_COMPONENTS.includes(item.handle)) continue;

      let cdp;

      describe(`"${item.handle}"`, () => {
        before('init chrome debug protocol', done => {
          CDP({
            host: chromeHost,
            port: chrome.port,
          }, client => {
            cdp = client;
            done();
          });
        });

        after('shutdown chrome debug protocol', () => {
          return cdp.close();
        });

        it('reports no aXe violations', function () {
          this.timeout(10000);
          return runAxe({
            url: `${serverUrl}/components/preview/${item.handle}`,
            cdp,
          });
        });
      });
    }
  });
});
