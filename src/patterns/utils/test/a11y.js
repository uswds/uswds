const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const axeTester = require("./axe-tester");
const { getComponents } = require("./patternlab-utils");

let chrome;
let chromeHost;
let serverUrl;
let cdp;

/**
 * start our headless chrome instance
 */
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
      serverUrl = "http://localhost:3333/";
    });
}

/**
 * binds host and port to init chrome dev tools protocol
 */
function createChromeDevtoolsProtocol() {
  return CDP({
    host: chromeHost,
    port: chrome.port,
  });
}

/**
 * load a page in headless chrome
 * @param {client} object - resolves from createChromeDevtoolsProtocol()
 * @param {url} string - our component path
 */
async function loadPage(client, url) {
  const { Network, Page } = client;
  await Network.enable();
  await Page.enable();
  await Page.navigate({ url });
  await Page.loadEventFired();
}

/**
 * load a page in headless chrome
 * @param {c} object - chrome dev tools protocol
 * @param {h} string - the path of our componetn we wish to handle
 */
function loadPatternLabPreview(c, h) {
  const url = `${serverUrl}${h}`;
  return loadPage(c, url);
}

// let's get our componets first
getComponents.then((handles) => {
  describe("a11y tests", function () {
    this.timeout(20000);

    before(async () => {
      await launchChrome();
    });
    describe(`looking for violations`, () => {
      handles.forEach((handle) => {
        // our handle returns as a path so we need to clean up
        const component = handle.replace(/.*(?=usa)/, '');
        const componentName = component.replace(/(\.).*/, '');

        before(async () => {
          await createChromeDevtoolsProtocol().then((client) => {
            cdp = client;
            return loadPatternLabPreview(cdp, handle);
          });
          axeTester.load(cdp);
        });
        after("shutdown chrome devtools protocol", () => cdp.close());
        // test cases
        describe(`testing ${componentName}`, () => {
          it("has no a11y errors", () => axeTester.run({ cdp, warn: false }));
          it("passes without warnings", () =>
            axeTester.run({ cdp, warn: true }));
        });
      });
    });
  });
});
