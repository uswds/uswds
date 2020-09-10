const os = require("os");
const urlParse = require("url").parse;
const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const fractal = require("../fractal.config");

const { REMOTE_CHROME_URL } = process.env;
const HOSTNAME = REMOTE_CHROME_URL ? os.hostname().toLowerCase() : "localhost";

function launchChromeLocally(headless = true) {
  return chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", headless ? "--headless" : ""]
  });
}

function getRemoteChrome() {
  const info = urlParse(REMOTE_CHROME_URL);
  if (info.protocol !== "http:") {
    throw new Error(`Unsupported protocol: ${info.protocol}`);
  }
  return Promise.resolve({
    host: info.hostname,
    port: info.port,
    kill() {
      return Promise.resolve();
    }
  });
}

function loadPage({ cdp, url }) {
  const { Page, Network } = cdp;

  return Promise.all([Page.enable(), Network.enable()]).then(
    () =>
      new Promise((resolve, reject) => {
        Network.responseReceived(({ response }) => {
          if (response.status < 400) return;
          reject(
            new Error(`${response.url} returned HTTP ${response.status}!`)
          );
        });
        Network.loadingFailed(details => {
          reject(
            new Error(
              "A network request failed to load: " +
                JSON.stringify(details, null, 2)
            )
          );
        });
        Page.loadEventFired(() => {
          resolve();
        });
        Page.navigate({ url });
      })
  );
}

function getHandles() {
  return Array.from(fractal.components.flatten().map(c => c.handle));
}

const getChrome = REMOTE_CHROME_URL ? getRemoteChrome : launchChromeLocally;
const server = fractal.web.server({ sync: false });

// eslint-disable-next-line no-param-reassign, no-return-assign
const autobind = self => name => (self[name] = self[name].bind(self));

class ChromeFractalTester {
  constructor() {
    this.chrome = null;
    this.chromeHost = null;
    this.serverUrl = null;
    this.handles = getHandles();
    [
      "setup",
      "createChromeDevtoolsProtocol",
      "loadFractalPreview",
      "teardown"
    ].forEach(autobind(this));
  }

  setup() {
    // Note that we're not killing the server; this is because
    // the remote chrome instance (if we're using one) may be
    // keeping some network connections to the server alive, which
    // makes it harder to kill, so it's easier to just let mocha
    // terminate the process when it's done running tests.
    return server
      .start()
      .then(getChrome)
      .then(newChrome => {
        this.chrome = newChrome;
        this.chromeHost = this.chrome.host || "localhost";
        this.serverUrl = `http://${HOSTNAME}:${server.port}`;
      });
  }

  createChromeDevtoolsProtocol() {
    return CDP({
      host: this.chromeHost,
      port: this.chrome.port
    });
  }

  loadFractalPreview(cdp, handle) {
    const url = `${this.serverUrl}/components/preview/${handle}`;
    return loadPage({ url, cdp });
  }

  teardown() {
    return this.chrome.kill();
  }
}

ChromeFractalTester.getHandles = () => {
  return fractal.components.load().then(getHandles);
};

module.exports = ChromeFractalTester;
