const chromeLauncher = require("chrome-launcher");
const CDP = require("chrome-remote-interface");
const axeTester = require("./axe-tester");
const { getComponents } = require("./delayed-root-suite");
// const fs = require("fs");
// const path = require("path");
// const ROOT_DIR = path.join(__dirname, "..");
// const PL_BUILD_PATTERNS_DIR = path.join(ROOT_DIR, "build/patterns/");

// get all rendered.html files
const handles = [
  "/patterns/components-usa-accordion-usa-accordion/components-usa-accordion-usa-accordion.rendered.html",
];

getComponents.then((components) => console.log({ components }));

// const components = [];

// fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
//   if (err) console.log(err);
//   else {
//     files.forEach((file) => {
//       const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
//       fs.readdir(builtComponentDir, (err, dir) => {
//         if (err) console.log(err);
//         dir.forEach((component) => {
//           if (component.includes(".rendered.html")) {
//             components.push("/patterns/" + file + "/" + component);
//           }
//         });
//       });
//     });
//   }
// });

// const getComponents = new Promise((resolve, reject) => {
//   const components = [];

//   async function findAllComponents() {
//     fs.readdir(PL_BUILD_PATTERNS_DIR, (err, files) => {
//       if (err) console.log(err);
//       else {
//         files.forEach((file) => {
//           const builtComponentDir = PL_BUILD_PATTERNS_DIR + file;
//           fs.readdir(builtComponentDir, (err, dir) => {
//             if (err) console.log(err);
//             dir.forEach((component) => {
//               if (component.includes(".rendered.html")) {
//                 components.push("/patterns/" + file + "/" + component);
//               }
//             });
//           });
//         });
//       }
//     });
//   }

//   resolve(findAllComponents().then(() => {
//     console.log(components);
//     return components;
//   }));
// });

// getComponents.then((value) => console.log(value));

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

describe("a11y tests", function () {
  this.timeout(20000);

  before(async () => {
    await launchChrome();
  });

  describe(`looking for violations`, () => {
    console.log(handles);
    // console.log(components);
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
        axeTester.run({ cdp, warn: false }));
    });
  });
});
// });
// }
