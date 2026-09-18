import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve, extname, sep } from "node:path";
import { chromium } from "playwright";

const roots = {
  base: resolve(process.argv[2]),
  candidate: resolve(process.argv[3]),
};
const output = resolve("visual-review");
mkdirSync(output, { recursive: true });
const stories = [
  "components-button--default",
  "components-accordion--default",
  "components-form-inputs-text-input--input",
  "components-table--default",
];
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};
const servers = [];
let browser;
try {
  browser = await chromium.launch();
  for (const [label, root] of Object.entries(roots)) {
    const index = JSON.parse(readFileSync(resolve(root, "index.json"), "utf8"));
    const server = createServer((request, response) => {
      const path = resolve(
        root,
        `.${new URL(request.url, "http://localhost").pathname}`,
      );
      if (!path.startsWith(root + sep)) {
        response.writeHead(403).end();
        return;
      }
      try {
        response.setHeader(
          "Content-Type",
          types[extname(path)] || "application/octet-stream",
        );
        response.end(readFileSync(path));
      } catch {
        response.writeHead(404).end();
      }
    });
    servers.push(server);
    await new Promise((done) => server.listen(0, "127.0.0.1", done));
    for (const width of [390, 1280]) {
      const page = await browser.newPage({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      for (const story of stories) {
        if (!index.entries[story])
          throw new Error(`Missing visual story: ${label}/${story}`);
        await page.goto(
          `http://127.0.0.1:${server.address().port}/iframe.html?id=${story}&viewMode=story`,
          { waitUntil: "networkidle" },
        );
        await page.locator("#storybook-root > *").first().waitFor();
        await page.evaluate(() => document.fonts.ready);
        await page.addStyleTag({
          content:
            "*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }",
        });
        await page.screenshot({
          path: resolve(output, `${label}-${story}-${width}.png`),
          fullPage: true,
        });
      }
      await page.close();
    }
  }
  const rows = stories
    .flatMap((story) =>
      [390, 1280].map(
        (width) =>
          `<section><h2>${story} (${width}px)</h2><div class="pair"><figure><figcaption>Base</figcaption><img src="base-${story}-${width}.png" alt="Base ${story}"></figure><figure><figcaption>Candidate</figcaption><img src="candidate-${story}-${width}.png" alt="Candidate ${story}"></figure></div></section>`,
      ),
    )
    .join("");
  writeFileSync(
    resolve(output, "index.html"),
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>USWDS visual review</title><style>body{font:16px system-ui;margin:24px;background:#f4f4f4}h1,h2{line-height:1.3}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0;overflow:auto;background:white;border:1px solid #999}figcaption{padding:12px;font-weight:bold}img{width:100%;height:auto;display:block}section{margin:32px 0}</style><h1>USWDS visual review</h1><p>Compare base and candidate at mobile and desktop sizes. Successful capture is not design approval. Record intentional visual changes in the PR.</p>${rows}</html>`,
  );
  writeFileSync(
    resolve(output, "revisions.json"),
    JSON.stringify(
      {
        base: process.env.BASE_SHA,
        candidate: process.env.HEAD_SHA,
        stories,
        widths: [390, 1280],
      },
      null,
      2,
    ),
  );
} finally {
  await browser?.close();
  await Promise.all(
    servers.map((server) => new Promise((done) => server.close(done))),
  );
}
