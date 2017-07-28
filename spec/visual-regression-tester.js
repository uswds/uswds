const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SCREENSHOTS_DIR = path.join(ROOT_DIR, 'screenshots');

const clone = obj => JSON.parse(JSON.stringify(obj));

const autobind = self => name => { self[ name ] = self[ name ].bind(self); };

class VisualRegressionTester {
  constructor ({ handle, metrics }) {
    this.handle = handle;
    this.metrics = metrics;
    this.failPath = path.join(SCREENSHOTS_DIR, `${handle}.fail.png`);
    this.relFailPath = path.relative(ROOT_DIR, this.failPath);
    this.goldenPath = path.join(SCREENSHOTS_DIR, `${handle}.png`);
    this.relGoldenPath = path.relative(ROOT_DIR, this.goldenPath);
    [ 'screenshot',
      'ensureMatchesGoldenFile',
      'saveToGoldenFile' ].forEach(autobind(this));
  }

  screenshot (cdp) {
    const { Page, Emulation } = cdp;
    const metrics = clone(this.metrics);

    metrics.fitWindow = true;

    return Emulation.setDeviceMetricsOverride(metrics)
      .then(() => Page.getLayoutMetrics())
      .then((result) => {
        metrics.height = result.contentSize.height;
        return Emulation.setDeviceMetricsOverride(metrics);
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
      return this._save(this.failPath, buf)
        .then(() => Promise.reject(new Error(
          `Screenshot of "${this.handle}", saved to ${this.relFailPath}, ` +
          `does not match golden screenshot at ${this.relGoldenPath}! ` +
          `If the golden screenshot represents an old screenshot that ` +
          `is no longer valid, please delete it.`
        )));
    }
    return this._deleteIfExists(this.failPath);
  }

  saveToGoldenFile (buf) {
    return this._save(this.goldenPath, buf)
      .then(() => this._deleteIfExists(this.failPath));
  }

  _deleteIfExists (filepath) {
    if (fs.existsSync()) {
      fs.unlinkSync(filepath);
    }
    return Promise.resolve();
  }

  _save (filepath, buf) {
    const dirname = path.dirname(filepath);

    // Obviously this only works for one directory level deep, but
    // that should be good enough for our needs.
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }

    fs.writeFileSync(filepath, buf);
    return Promise.resolve();
  }
}

module.exports = VisualRegressionTester;
