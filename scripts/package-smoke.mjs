import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { extname, join, resolve, sep } from "node:path";
import { chromium } from "playwright";
import { compileString } from "sass-embedded";

const requested = process.argv[2] || "release-artifacts/package.tgz";
const tarball = requested.startsWith("@uswds/uswds@")
  ? requested
  : resolve(requested);
const directory = mkdtempSync(join(tmpdir(), "uswds-consumer-"));
let server;
let browser;
try {
  writeFileSync(
    join(directory, "package.json"),
    JSON.stringify({
      name: "uswds-consumer-test",
      version: "1.0.0",
      private: true,
    }),
  );
  execFileSync(
    "npm",
    ["install", "--ignore-scripts", "--no-audit", "--fund=false", tarball],
    { cwd: directory, stdio: "inherit" },
  );
  const require = createRequire(join(directory, "package.json"));
  for (const path of [
    "@uswds/uswds",
    "@uswds/uswds/css/uswds.css",
    "@uswds/uswds/css/uswds.min.css",
    "@uswds/uswds/scss/usa-button",
    "@uswds/uswds/js/usa-accordion",
    "@uswds/uswds/components/usa-banner",
  ]) {
    assert.ok(readFileSync(require.resolve(path)).length > 0, path);
  }
  const packageRoot = join(directory, "node_modules/@uswds/uswds");
  const theme = compileString(
    '@use "uswds-core" with ($theme-color-primary: "red-50"); @use "usa-button";',
    {
      loadPaths: [join(packageRoot, "packages")],
    },
  ).css;
  assert.match(theme, /\.usa-button/);
  assert.match(
    theme,
    /#d83933/i,
    "consumer theme override must reach compiled CSS",
  );
  writeFileSync(
    join(directory, "index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><title>USWDS consumer smoke test</title>
    <link rel="stylesheet" href="/node_modules/@uswds/uswds/dist/css/uswds.min.css">
    <div class="usa-accordion"><h2 class="usa-accordion__heading"><button class="usa-accordion__button" aria-expanded="false" aria-controls="panel">Example</button></h2><div id="panel" class="usa-accordion__content" hidden>Content</div></div>
    <usa-banner></usa-banner>
    <script src="/node_modules/@uswds/uswds/dist/js/uswds.min.js"></script>
    <script type="module" src="/node_modules/@uswds/uswds/dist/components/usa-banner.js.mjs"></script></html>`,
  );
  server = createServer((request, response) => {
    const path = resolve(
      directory,
      `.${new URL(request.url, "http://localhost").pathname}`,
    );
    if (!path.startsWith(directory + sep)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      };
      response.setHeader(
        "Content-Type",
        types[extname(path)] || "application/octet-stream",
      );
      response.end(readFileSync(path));
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
  await page.waitForFunction(
    () => window.uswdsPresent && customElements.get("usa-banner"),
  );
  const button = page.locator(".usa-accordion__button").first();
  await button.click();
  assert.equal(await button.getAttribute("aria-expanded"), "true");
  assert.equal(await page.locator("#panel").isVisible(), true);
  await button.focus();
  await page.keyboard.press("Space");
  assert.equal(await button.getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator("#panel").isVisible(), false);
  await page.waitForFunction(() =>
    document.querySelector("usa-banner").shadowRoot?.querySelector("button"),
  );
  assert.deepEqual(
    errors,
    [],
    "shipped JavaScript must execute without browser errors",
  );
  console.log(
    "Packed consumer smoke passed: installed exports, themed Sass, legacy keyboard behavior, and web component.",
  );
} finally {
  await browser?.close();
  if (server) await new Promise((done) => server.close(done));
  rmSync(directory, { recursive: true, force: true });
}
