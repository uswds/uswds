const fs = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const [repo, executablePath, html, output] = process.argv.slice(2);
const browserName = process.env.TEST_BROWSER || "chromium";
const browserType = require(path.join(repo, "node_modules/playwright"))[browserName];

(async () => {
  const browser = await browserType.launch({ executablePath: executablePath === "-" ? undefined : executablePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1250 } });
  const results = [];
  try {
    for (const forcedColors of ["none", "active"]) {
      await page.emulateMedia({ forcedColors });
      await page.goto(pathToFileURL(html).href);
      const rows = await page.evaluate(() => Array.from(document.querySelectorAll('input[data-native],input[data-indeterminate]'), input => {
        const label = input.nextElementSibling;
        const style = getComputedStyle(label, "::before");
        return { id: input.id, checked: input.checked, indeterminate: input.indeterminate, image: style.backgroundImage, background: style.backgroundColor, shadow: style.boxShadow, expected: "checkbox-indeterminate", pass: style.backgroundImage.includes("checkbox-indeterminate") };
      }));
      results.push({ forcedColors, rows });
    }
    await page.emulateMedia({ forcedColors: "none" });
    await page.goto(pathToFileURL(html).href);
    if (process.env.CAPTURE_SCREENSHOT === "true") {
      await page.screenshot({ path: html.replace(/\.html$/, ".png") });
    }
    const restoration = await page.evaluate(() => {
      const rows = [];
      for (const input of document.querySelectorAll('input[data-native],input[data-indeterminate]')) {
        input.indeterminate = false;
        input.removeAttribute("data-indeterminate");
        const image = getComputedStyle(input.nextElementSibling, "::before").backgroundImage;
        rows.push({ id: input.id, image, pass: input.checked ? image.includes("correct8") : image === "none" });
      }
      return rows;
    });
    results.push({ restoration });
    fs.writeFileSync(output, JSON.stringify({ browserName, browser: browser.version(), results }, null, 2));
    const rows = results.flatMap(result => result.rows || result.restoration);
    const failed = rows.filter(row => !row.pass);
    console.log(JSON.stringify({ assertions: rows.length, passed: rows.length - failed.length, failures: failed.map(row => row.id) }, null, 2));
    process.exitCode = failed.length ? 1 : 0;
  } finally {
    await browser.close();
  }
})();
