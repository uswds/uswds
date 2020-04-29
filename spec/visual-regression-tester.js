/* eslint-disable */
const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "..");
const SPEC_DIR = path.join(ROOT_DIR, "spec");
const SCREENSHOTS_DIR = path.join(SPEC_DIR, "screenshots");
const METADATA_PATH = path.join(SCREENSHOTS_DIR, "metadata.js");

const clone = obj => JSON.parse(JSON.stringify(obj));

const autobind = self => name => {
  self[name] = self[name].bind(self);
}; // eslint-disable-line

const failName = (handle, device) => `${handle}_${device.name}.fail.png`;

const goldenName = (handle, device) => `${handle}_${device.name}.png`;

const screenshotsPath = filename => path.join(SCREENSHOTS_DIR, filename);

const safeDeleteSync = f => {
  if (fs.existsSync(f)) fs.unlinkSync(f);
};

class VisualRegressionTester {
  constructor({ handle, device }) {
    this.handle = handle;
    this.device = device;
    this.failPath = screenshotsPath(failName(handle, device));
    this.relFailPath = path.relative(ROOT_DIR, this.failPath);
    this.goldenPath = screenshotsPath(goldenName(handle, device));
    this.relGoldenPath = path.relative(ROOT_DIR, this.goldenPath);
    ["screenshot", "ensureMatchesGoldenFile", "saveToGoldenFile"].forEach(
      autobind(this)
    );
  }

  screenshot(cdp) {
    const { Page, Emulation } = cdp;
    const metrics = clone(this.device.metrics);

    return Emulation.setDeviceMetricsOverride(metrics)
      .then(() => Page.getLayoutMetrics())
      .then(result => {
        // This is weird, I'm not really sure what I'm doing, but after
        // a bunch of experimentation, this seems to do what we want, i.e.
        // capture a full-size screenshot of the entire page.
        //
        // At the time of this writing, though, Emulation.setVisibleSize()
        // is documented as being both experimental *and* deprecated, so
        // this code may not work for long. - AV 7/28/2017
        return Emulation.setVisibleSize({
          width: metrics.width,
          height: result.contentSize.height
        }).then(() => {
          metrics.height = result.contentSize.height;
          metrics.dontSetVisibleSize = true;
          return Emulation.setDeviceMetricsOverride(metrics);
        });
      })
      .then(() => Page.captureScreenshot({ format: "png" }))
      .then(result => Buffer.from(result.data, "base64"));
  }

  doesGoldenFileExist() {
    return fs.existsSync(this.goldenPath);
  }

  ensureMatchesGoldenFile(buf) {
    const goldenData = fs.readFileSync(this.goldenPath);
    if (!goldenData.equals(buf)) {
      const indexHtml = path.join(
        path.relative(ROOT_DIR, SCREENSHOTS_DIR),
        "index.html"
      );
      return this._save(this.failPath, buf).then(() =>
        Promise.reject(
          new Error(
            `Screenshot of "${this.handle}", saved to ${this.relFailPath}, ` +
              `does not match golden screenshot at ${this.relGoldenPath}!\n\n` +
              `If the golden screenshot represents an old screenshot that ` +
              `is no longer valid, please run the visual regression tester ` +
              `with the --updateGolden option.\n\n` +
              `To learn more, open ${indexHtml} in a browser.`
          )
        )
      );
    }
    return this._deleteIfExists(this.failPath);
  }

  saveToGoldenFile(buf) {
    return this._save(this.goldenPath, buf).then(() =>
      this._deleteIfExists(this.failPath)
    );
  }

  _deleteIfExists(filepath) {
    safeDeleteSync(filepath);
    return Promise.resolve();
  }

  _save(filepath, buf) {
    fs.writeFileSync(filepath, buf);
    return Promise.resolve();
  }
}

VisualRegressionTester.writeMetadata = (handles, devices) => {
  const exists = filename => fs.existsSync(screenshotsPath(filename));
  const metadata = [];

  handles.forEach(handle => {
    devices.forEach(device => {
      const golden = goldenName(handle, device);
      const fail = failName(handle, device);

      if (!exists(golden)) return;

      metadata.push({
        handle,
        device: device.description,
        failed: exists(fail),
        goldenName: golden,
        failName: fail
      });
    });
  });

  const js =
    `// This file is auto-generated, please do not edit it.\n\n` +
    `window.metadata = ${JSON.stringify(metadata, null, 2)};\n`;
  fs.writeFileSync(METADATA_PATH, js, "utf-8");
  return Promise.resolve();
};

VisualRegressionTester.cleanSync = (handles, devices) => {
  const files = [METADATA_PATH];

  handles.forEach(handle => {
    devices.forEach(device => {
      files.push(
        screenshotsPath(goldenName(handle, device)),
        screenshotsPath(failName(handle, device))
      );
    });
  });

  files.forEach(safeDeleteSync);
};

module.exports = VisualRegressionTester;

if (!module.parent) {
  require("yargs")
    .strict()
    .demandCommand()
    .command(
      ["test"],
      "run visual regression tests",
      yargs => {
        yargs
          .alias("g", "grep")
          .describe("g", "only run tests matching a pattern")
          .nargs("g", 1);
        yargs
          .alias("u", "updateGolden")
          .describe("u", "update golden screenshot");
      },
      argv => {
        const mocha = path.join(ROOT_DIR, "node_modules", ".bin", "mocha");
        const mochaArgs = [
          "--config",
          path.join(SPEC_DIR, ".mocharc.json"),
          path.join(SPEC_DIR, "headless-chrome.js")
        ];
        if (argv.grep) {
          mochaArgs.push("-g", argv.grep);
        }
        process.env.ENABLE_SCREENSHOTS = "yup";
        if (argv.updateGolden) {
          process.env.UPDATE_GOLDEN_SCREENSHOTS = "yup";
        }
        require("child_process")
          .spawn(mocha, mochaArgs, {
            cwd: ROOT_DIR,
            stdio: "inherit"
          })
          .on("exit", code => {
            process.exit(code);
          });
      }
    )
    .command(
      ["list"],
      "list tests",
      () => {},
      argv => {
        require("./chrome-fractal-tester")
          .getHandles()
          .then(handles => {
            console.log(handles.join("\n"));
          });
      }
    )
    .help().argv;
}
/* eslint-enable */
