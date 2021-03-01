const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const axeTester = require("./axe-tester");
const fs = require("fs");
const path = require("path");
const ROOT_DIR = path.join(__dirname, "..");
const PL_BUILD_PATTERNS_DIR = path.join(ROOT_DIR, "build/patterns/");

// get all rendered.html files
const handles = [
  "/patterns/components-usa-accordion-usa-accordion/components-usa-accordion-usa-accordion.rendered.html",
];

// const handles = [];

// fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
//   if (err) console.log(err);
//   else {
//     files.forEach((file) => {
//       const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
//       fs.readdir(builtComponentDir, (err, dir) => {
//         if (err) console.log(err);
//         dir.forEach((component) => {
//           if (component.includes(".rendered.html")) {
//             // console.log(handles)
//             handles.push("/patterns/" + file + "/" + component);
//           }
//         });
//       });
//     });
//   }
// });

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

if (handles.length > 0) {
  describe("a11y tests", function () {
    this.timeout(20000);

    describe(`looking for violations`, () => {
      console.log(handles);
      handles.forEach((handle) => {
        before(async () => {
          await launchChrome();
          await createChromeDevtoolsProtocol().then((client) => {
            cdp = client;
            return loadPatternLabPreview(cdp, handle);
          });
          axeTester.load(cdp);
        });
        after("shutdown chrome devtools protocol", () => cdp.close());
        // test cases
        it("shows aXe warnings", () => axeTester.run({ cdp, warn: false }));
      });
    });
  });
}
