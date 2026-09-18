const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { pathToFileURL } = require("node:url");
const [repo, executablePath] = process.argv.slice(2);
const { chromium } = require(path.join(repo, "node_modules/playwright"));

(async () => {
  const browser = await chromium.launch({ executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1080 } });
  const results = {};
  try {
    for (const state of ["before", "after"]) {
      await page.goto(pathToFileURL(path.join(__dirname, `${state}.html`)).href);
      results[state] = await page.evaluate(() => {
        const cell = document.querySelector(".usa-table th");
        const styles = getComputedStyle(cell);
        return {
          error: document.querySelector(".result").textContent,
          validColor: getComputedStyle(document.querySelector(".valid-control")).color,
          tableHeader: { color: styles.color, backgroundColor: styles.backgroundColor, borderColor: styles.borderColor },
          documentHeight: document.documentElement.scrollHeight,
        };
      });
      const compiler = JSON.parse(fs.readFileSync(path.join(__dirname, `${state}.json`)));
      assert.equal(results[state].error, compiler.error);
      await page.screenshot({ path: path.join(__dirname, `${state}.png`) });
    }
    assert.match(results.before.error, /Undefined variable/);
    assert.match(results.after.error, /'default' is not a valid USWDS color token/);
    assert.equal(results.before.validColor, results.after.validColor);
    assert.deepEqual(results.before.tableHeader, results.after.tableHeader);
    fs.writeFileSync(path.join(__dirname, "browser-results.json"), JSON.stringify({ browser: browser.version(), results }, null, 2));
    console.log("Compiler messages match actual compilation; valid color and table appearance are unchanged.");
  } finally {
    await browser.close();
  }
})();
