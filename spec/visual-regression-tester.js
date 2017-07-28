const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'spec', 'screenshots');
const METADATA_PATH = path.join(SCREENSHOTS_DIR, 'metadata.js');

const clone = obj => JSON.parse(JSON.stringify(obj));

const autobind = self => name => { self[ name ] = self[ name ].bind(self); };

const failName = handle => `${handle}.fail.png`;

const goldenName = handle => `${handle}.png`;

const screenshotsPath = filename => path.join(SCREENSHOTS_DIR, filename);

class VisualRegressionTester {
  constructor ({ handle, metrics }) {
    this.handle = handle;
    this.metrics = metrics;
    this.failPath = screenshotsPath(failName(handle));
    this.relFailPath = path.relative(ROOT_DIR, this.failPath);
    this.goldenPath = screenshotsPath(goldenName(handle));
    this.relGoldenPath = path.relative(ROOT_DIR, this.goldenPath);
    [ 'screenshot',
      'ensureMatchesGoldenFile',
      'saveToGoldenFile' ].forEach(autobind(this));
  }

  screenshot (cdp) {
    const { Page, Emulation } = cdp;
    const metrics = clone(this.metrics);

    return Emulation.setDeviceMetricsOverride(metrics)
      .then(() => Page.getLayoutMetrics())
      .then((result) => {
        // This is weird, I'm not really sure what I'm doing, but after
        // a bunch of experimentation, this seems to do what we want, i.e.
        // capture a full-size screenshot of the entire page.
        //
        // At the time of this writing, though, Emulation.setVisibleSize()
        // is documented as being both experimental *and* deprecated, so
        // this code may not work for long. - AV 7/28/2017
        return Emulation.setVisibleSize({
          width: metrics.width,
          height: result.contentSize.height,
        }).then(() => {
          metrics.height = result.contentSize.height;
          metrics.dontSetVisibleSize = true;
          return Emulation.setDeviceMetricsOverride(metrics);
        });
      })
      .then(() => Page.captureScreenshot({ format: 'png' }))
      .then(result => Buffer.from(result.data, 'base64'));
  }

  doesGoldenFileExist () {
    return fs.existsSync(this.goldenPath);
  }

  ensureMatchesGoldenFile (buf) {
    const goldenData = fs.readFileSync(this.goldenPath);
    if (!goldenData.equals(buf)) {
      const indexHtml = path.join(path.relative(ROOT_DIR, SCREENSHOTS_DIR),
                                  'index.html');
      return this._save(this.failPath, buf)
        .then(() => Promise.reject(new Error(
          `Screenshot of "${this.handle}", saved to ${this.relFailPath}, ` +
          `does not match golden screenshot at ${this.relGoldenPath}!\n\n` +
          `If the golden screenshot represents an old screenshot that ` +
          `is no longer valid, please delete it.\n\n` +
          `To learn more, open ${indexHtml} in a browser.`
        )));
    }
    return this._deleteIfExists(this.failPath);
  }

  saveToGoldenFile (buf) {
    return this._save(this.goldenPath, buf)
      .then(() => this._deleteIfExists(this.failPath));
  }

  _deleteIfExists (filepath) {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return Promise.resolve();
  }

  _save (filepath, buf) {
    fs.writeFileSync(filepath, buf);
    return Promise.resolve();
  }
}

VisualRegressionTester.writeMetadata = handles => {
  const exists = filename => fs.existsSync(screenshotsPath(filename));
  const metadata = handles
    .filter(handle => exists(goldenName(handle)))
    .map(handle => ({
      handle,
      failed: exists(failName(handle)),
      goldenName: goldenName(handle),
      failName: failName(handle),
    }));
  const js = `// This file is auto-generated, please do not edit it.\n\n` +
             `window.metadata = ${JSON.stringify(metadata, null, 2)};\n`;
  fs.writeFileSync(METADATA_PATH, js, 'utf-8');
  return Promise.resolve();
};

module.exports = VisualRegressionTester;
