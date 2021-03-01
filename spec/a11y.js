const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
// const { loadPatternLab } = require("./delayed-root-suite");
// const ChromePatternLabTester = require("./chrome-patternlab-tester");
const axeTester = require("./axe-tester");

const handles = [
  "/patterns/components-usa-accordion-usa-accordion/components-usa-accordion-usa-accordion.rendered.html"
];

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
      // console.log(newChrome);
      chrome = newChrome;
      chromeHost = chrome.host;
      serverUrl = "http://localhost:3000";
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

describe("a11y tests", function () {
  this.timeout(20000);

  handles.forEach((handle) => {
    before(async () => {
      await launchChrome();
      await createChromeDevtoolsProtocol().then((client) => {
        cdp = client;
        return loadPatternLabPreview(cdp, handle);
      });
      axeTester.load(cdp);
    });

    describe(`looking for violations on ${handle}`, () => {
      // test cases
      it("shows aXe warnings", () => axeTester.run({ cdp, warn: false }));
    });
  });
});
