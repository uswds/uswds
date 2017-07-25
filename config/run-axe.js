'use strict';

const fs = require('fs');
const os = require('os');
const urlParse = require('url').parse;
const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');
const chalk = require('chalk');
const fractal = require('../fractal');
const server = fractal.web.server({ sync: false });

const HOSTNAME = os.hostname().toLowerCase();
const REMOTE_CHROME_URL = process.env['REMOTE_CHROME_URL'];
const AXE_JS = fs.readFileSync(__dirname + '/../node_modules/axe-core/axe.js');
const AXE_OPTIONS = JSON.stringify({
  rules: {
    'document-title': { enabled: false},  // TODO: Remove eventually.
    'html-has-lang': { enabled: false},   // TODO: Remove eventually.
    'frame-title': { enabled: false},     // TODO: Remove eventually.
    // Not all our examples need "skip to main content" links, so
    // ignore that rule.
    'bypass': { enabled: false},
  },
});
const SKIP_COMPONENTS = [
  'header',          // TODO: Resolve duplicate id errors and remove.
  'buttons',         // TODO: Resolve color contrast issues and remove.
];

function launchChromeLocally(headless=true) {
  return chromeLauncher.launch({
    chromeFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      headless ? '--headless' : ''
    ]
  });
}

function getRemoteChrome() {
  const info = urlParse(REMOTE_CHROME_URL);
  if (info.protocol !== 'http:')
    throw new Error(`Unsupported protocol: ${info.protocol}`);
  return new Promise(resolve => {
    resolve({
      host: info.hostname,
      port: info.port,
      kill() { return Promise.resolve(); }
    });
  });
}

// This function is only here so it can be easily .toString()'d
// and run in the context of a web page by Chrome. It will not
// be run in the node context.
const RUN_AXE_FUNC_JS = function runAxe(options) {
  return new Promise((resolve, reject) => {
    window.axe.run(options, (err, results) => {
      if (err) return reject(err);
      resolve(JSON.stringify(results.violations));
    });
  });
}.toString();

let getChrome = REMOTE_CHROME_URL ? getRemoteChrome : launchChromeLocally;

Promise.all([
  getChrome(),
  server.start(),
  fractal.components.load(),
]).then(([chrome]) => {
  const pages = [];
  const chromeHost = chrome.host || 'localhost';
  const serverUrl = `http://${HOSTNAME}:${server.port}`;

  console.log(`Fractal server is listening at ${serverUrl}.`);
  console.log(`Chrome is debuggable on http://${chromeHost}:${chrome.port}.`);
  console.log(`Running aXe on:`);

  for (let item of fractal.components.flatten()) {
    if (!SKIP_COMPONENTS.includes(item.handle)) {
      pages.push(`/components/preview/${item.handle}`);
    }
  }

  CDP({
    host: chromeHost,
    port: chrome.port,
  }, client => {
    const {Page, Network, Runtime} = client;
    const pagesLeft = pages.slice();
    const loadNextPage = () => {
      if (pagesLeft.length === 0) {
        console.log(`Finished visiting ${pages.length} pages with no errors.`);
        terminate(0);
      } else {
        const page = pagesLeft.pop();
        const url = `${serverUrl}${page}`;
        process.stdout.write(`  ${page} `);
        Page.navigate({url});
      }
    };
    const terminate = exitCode => {
      client.close().then(() => {
        chrome.kill().then(() => {
          // Note that we're not killing the server; this is because
          // the remote chrome instance (if we're using one) may be
          // keeping some network connections to the server alive, which
          // makes it harder to kill, so it's easier to just terminate.
          const color = exitCode === 0 ? chalk.green : chalk.red;
          console.log(color(`Terminating with exit code ${exitCode}.`));
          process.exit(exitCode);
        });
      });
    };

    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at:', p, 'reason:', reason);
      terminate(1);
    });

    Promise.all([
      Page.enable(),
      Network.enable(),
    ]).then(() => {
      Network.responseReceived(({response}) => {
        if (response.status < 400) return;
        console.log(`${response.url} returned HTTP ${response.status}!`);
        terminate(1);
      });
      Network.loadingFailed(details => {
        console.log("A network request failed to load.");
        console.log(details);
        terminate(1);
      });
      Page.loadEventFired(() => {
        Runtime.evaluate({
          expression: `${AXE_JS};(${RUN_AXE_FUNC_JS})(${AXE_OPTIONS})`,
          awaitPromise: true,
        }).then(details => {
          let errorFound = false;
          if (details.result.type === 'string') {
            const viols = JSON.parse(details.result.value);
            if (viols.length === 0) {
              console.log(chalk.green('OK'));
            } else {
              console.log(chalk.red(`Found ${viols.length} aXe violations.`));
              console.log(viols);
              console.log(chalk.cyan(
                `\nTo debug these violations, install aXe at:\n\n` +
                `  https://www.deque.com/products/axe/\n`
              ));
              errorFound = true;
            }
          } else {
            console.log('Unexpected result from aXe JS evaluation!');
            console.log(details.result);
            errorFound = true;
          }
          // Note that this means we're terminating on the first error we
          // find, rather than reporting the error and moving on to the
          // next page. We're doing this because it's possible that the
          // error is caused by a layout or include, which may result
          // in the same errors being reported across multiple pages, so
          // we'd rather avoid the potential spam and just exit early.
          if (errorFound) {
            terminate(1);
          } else {
            loadNextPage();
          }
        });
      });

      loadNextPage();
    });
  });
}).catch(e => {
  console.log(chalk.red("An error occurred during initialization."));
  console.log(e);
  process.exit(1);
});
