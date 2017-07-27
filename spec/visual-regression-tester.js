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
      return Promise.reject(new Error(
        `Screenshot of "${this.handle}" does not match ` +
        `${this.relGoldenPath}! If this file represents an old ` +
        `screenshot that is no longer valid, please delete it.`
      ));
    }
    return Promise.resolve();
  }

  saveToGoldenFile (buf) {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
      fs.mkdirSync(SCREENSHOTS_DIR);
    }

    fs.writeFileSync(this.goldenPath, buf);
    return Promise.resolve();
  }
}

module.exports = VisualRegressionTester;
