const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const axeTester = require("./axe-tester");
const { getComponents } = require("./patternlab-utils");

let chrome;
let chromeHost;
let serverUrl;
let cdp;

function launchChrome() {
  console.log("launching headless chrome");
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

function createChromeDevtoolsProtocol() {
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

function loadPatternLabPreview(c, h) {
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
        const regex = /(usa).*.\//g;

        const componentName = handle.match(regex);

        describe(`testing ${componentName[0]}`, () => {
          it("has no a11y errors", () => axeTester.run({ cdp, warn: false }));
          it("passes without warnings", () =>
            axeTester.run({ cdp, warn: true }));
        });
      });
    });
  });
});
