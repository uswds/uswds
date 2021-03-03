const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const axeTester = require("./axe-tester");
const { getComponents } = require("./delayed-root-suite");

let chrome;
let chromeHost;
let serverUrl;
let cdp;

async function launchChrome() {
  return chromeLauncher
    .launch({
      chromeFlags: ["--disable-gpu", "--headless"],
      logLevel: "verbose",
    })
    .then((newChrome) => {
      chrome = newChrome;
      chromeHost = chrome.host;
      serverUrl = "http://localhost:3000/";
    });
}

async function createChromeDevtoolsProtocol() {
  return CDP({
    host: chromeHost,
    port: chrome.port,
  });
}

async function loadPage(client, url) {
  const { Network, Page } = client;
  await Network.enable();
  await Page.enable();
  await Page.navigate({ url });
  await Page.loadEventFired();
}

async function loadPatternLabPreview(c, h) {
  const url = `${serverUrl}${h}`;
  return loadPage(c, url);
}

getComponents.then((handles) => {
  describe("a11y tests", function () {
    this.timeout(20000);

    before(async () => {
      await launchChrome();
    });

    describe(`looking for violations`, () => {
      handles.forEach((handle) => {
        before(async () => {
          await createChromeDevtoolsProtocol().then((client) => {
            cdp = client;
            return loadPatternLabPreview(cdp, handle);
          });
          axeTester.load(cdp);
        });
        after("shutdown chrome devtools protocol", () => cdp.close());
        // test cases
        it(`${handle} passes without a11y errors`, () =>
          axeTester.run({ cdp, warn: true }));
      });
    });
  });
});
