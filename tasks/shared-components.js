/* Shared Components Script - this comment added for dummy commit */
const fs = require("fs");
const path = require("path");
const dutil = require("./utils/doc-util");
const pkg = require("../package.json");

const projectRoot = path.resolve(__dirname, "..");
const packagesDir = path.join(projectRoot, "packages");
const reportDir = path.join(projectRoot, "reports");
const reportPath = path.join(reportDir, "shared-components.html");

const SOURCE_EXT = new Set([".scss", ".js", ".twig", ".ts"]);
const ignoreDirs = new Set(["test", "tests", "__tests__", "node_modules"]);

const FORWARD = /@forward\s+"([^"]+)"/g;
const TWIG = /(?:include|embed|from|import)\s+['"]@components\/([^/'"]+)/g;
const REQUIRE = /require\(\s*['"](?:\.\.\/)+([a-z0-9_-]+)\//g;
const IMPORT = /from\s+['"](?:\.\.\/)+([a-z0-9_-]+)\//g;

const foundation = new Set([
  "uswds-core",
  "uswds-fonts",
  "uswds-helpers",
  "uswds-elements",
  "uswds-tokens",
  "usa-fonts",
]);

const bundles = new Set([
  "uswds",
  "uswds-form-controls",
  "uswds-typography",
  "uswds-form-templates",
  "uswds-validation",
  "uswds-global",
  "uswds-utilities",
]);

const tagClass = {
  component: "usa-tag bg-primary",
  foundation: "usa-tag bg-primary-darker",
  bundle: "usa-tag bg-base-dark",
  template: "usa-tag bg-success-dark",
  other: "usa-tag bg-base-lighter text-ink",
};

const kindLabel = {
  component: "UI component",
  foundation: "Foundation",
  bundle: "Bundle",
  template: "Template",
  other: "Other",
};

function kindOf(pkgName) {
  if (pkgName === "templates") return "template";
  if (bundles.has(pkgName)) return "bundle";
  if (foundation.has(pkgName)) return "foundation";
  if (pkgName.startsWith("usa-") || pkgName.startsWith("_usa-")) {
    return "component";
  }
  return "other";
}

function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function skipFile(file) {
  const bits = file.split(path.sep);
  for (let i = 0; i < bits.length; i += 1) {
    if (ignoreDirs.has(bits[i])) return true;
  }
  return file.endsWith(".stories.js") || file.endsWith(".stories.ts");
}

function walk(dir, out) {
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i];
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) walk(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function grab(re, src) {
  const found = [];
  re.lastIndex = 0;
  let m = re.exec(src);
  while (m) {
    found.push(m[1]);
    m = re.exec(src);
  }
  return found;
}

function loc(src) {
  if (!src) return 0;
  const n = src.split(/\n/).length;
  return src.endsWith("\n") ? n - 1 : n;
}

function scanPackages() {
  const names = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  const known = new Set(names);
  const byName = {};

  names.forEach((pkgName) => {
    const dir = path.join(packagesDir, pkgName);
    const files = walk(dir, []).filter((file) => {
      return SOURCE_EXT.has(path.extname(file)) && !skipFile(file);
    });

    let lines = 0;
    const sassDeps = new Set();
    const jsDeps = new Set();
    const twigDeps = new Set();

    const indexScss = path.join(dir, "_index.scss");
    if (fs.existsSync(indexScss)) {
      const src = fs.readFileSync(indexScss, "utf8");
      grab(FORWARD, src).forEach((token) => {
        if (token.startsWith("src/") || token.startsWith("./")) return;
        const dep = token.split("/")[0];
        if (dep && known.has(dep) && dep !== pkgName) sassDeps.add(dep);
      });
    }

    files.forEach((file) => {
      const src = fs.readFileSync(file, "utf8");
      lines += loc(src);
      const ext = path.extname(file);
      if (ext === ".js") {
        grab(REQUIRE, src)
          .concat(grab(IMPORT, src))
          .forEach((dep) => {
            if (known.has(dep) && dep !== pkgName) jsDeps.add(dep);
          });
      }
      if (ext === ".twig") {
        grab(TWIG, src).forEach((dep) => {
          if (known.has(dep) && dep !== pkgName) twigDeps.add(dep);
        });
      }
    });

    byName[pkgName] = {
      name: pkgName,
      kind: kindOf(pkgName),
      lines,
      nFiles: files.length,
      deps: [...new Set([...sassDeps, ...jsDeps, ...twigDeps])].sort(),
      usedBy: [],
      twigFiles: [],
    };
  });

  Object.keys(byName).forEach((pkgName) => {
    byName[pkgName].deps.forEach((dep) => {
      byName[dep].usedBy.push(pkgName);
    });
  });

  names.forEach((pkgName) => {
    const dir = path.join(packagesDir, pkgName);
    walk(dir, []).forEach((file) => {
      if (path.extname(file) !== ".twig" || skipFile(file)) return;
      const rel = path.relative(dir, file).split(path.sep).join("/");
      grab(TWIG, fs.readFileSync(file, "utf8")).forEach((dep) => {
        if (!byName[dep] || dep === pkgName) return;
        const hit = `${pkgName}/${rel}`;
        if (!byName[dep].twigFiles.includes(hit)) {
          byName[dep].twigFiles.push(hit);
        }
      });
    });
  });

  Object.keys(byName).forEach((pkgName) => {
    const item = byName[pkgName];
    item.usedBy = [...new Set(item.usedBy)].sort();
    item.twigFiles.sort();
    item.reusedBy = item.usedBy.filter((n) => kindOf(n) === "component");
    item.inBundles = item.usedBy.filter(
      (n) => bundles.has(n) || n === "uswds-core",
    );
    item.uses = item.reusedBy.length;
    item.isShared = item.kind === "component" && item.uses > 0;
  });

  return names
    .map((pkgName) => byName[pkgName])
    .sort((a, b) => {
      if (b.uses !== a.uses) return b.uses - a.uses;
      if (b.lines !== a.lines) return b.lines - a.lines;
      return a.name.localeCompare(b.name);
    });
}

let accN = 0;

function collapse(heading, body) {
  accN += 1;
  const id = `shared-acc-${accN}`;
  return `<div class="usa-accordion">
    <h4 class="usa-accordion__heading">
      <button type="button" class="usa-accordion__button" aria-expanded="false" aria-controls="${id}">
        ${esc(heading)}
      </button>
    </h4>
    <div id="${id}" class="usa-accordion__content" hidden>${body}</div>
  </div>`;
}

function tags(list, kinds, collapseAfter) {
  if (!list.length) return '<span class="text-base">—</span>';
  const limit = collapseAfter == null ? 8 : collapseAfter;
  const inner = `<div class="tag-wrap">${list
    .map((n) => {
      const k = kinds[n] || kindOf(n);
      const cls = tagClass[k] || "usa-tag";
      return `<span class="${cls}">${esc(n)}</span>`;
    })
    .join(" ")}</div>`;
  if (list.length <= limit) return inner;
  return collapse(`${list.length} packages`, inner);
}

function usedInCell(item) {
  const hits = item.twigFiles;
  const extra = item.inBundles;
  if (!hits.length && !extra.length) {
    if (item.reusedBy.length) {
      return '<span class="text-base">SCSS/JS dependency only (no Twig include)</span>';
    }
    return '<span class="text-base">—</span>';
  }

  let html = "";
  if (hits.length) {
    html += '<ul class="usa-list usa-list--unstyled font-mono-2xs">';
    hits.slice(0, 6).forEach((hit) => {
      html += `<li><code>${esc(hit)}</code></li>`;
    });
    html += "</ul>";
    if (hits.length > 6) {
      const rest = hits
        .slice(6)
        .map((hit) => `<li><code>${esc(hit)}</code></li>`)
        .join("");
      html += collapse(
        `${hits.length - 6} more files`,
        `<ul class="usa-list usa-list--unstyled font-mono-2xs">${rest}</ul>`,
      );
    }
  }
  if (extra.length) {
    const label = hits.length ? "Also bundled in" : "Bundled in";
    html += `<p class="font-body-2xs text-base margin-top-1">${label}: ${extra
      .map((n) => `<code>${esc(n)}</code>`)
      .join(", ")}</p>`;
  }
  return html;
}

function tableRow(item, kinds) {
  return `<tr data-name="${esc(item.name)}" data-kind="${esc(item.kind)}" data-uses="${item.uses}" data-lines="${item.lines}" data-shared="${item.isShared ? "1" : "0"}" data-depends="${item.deps.length}">
      <th scope="row" data-sort-value="${esc(item.name.toLowerCase())}">
        <span class="text-bold text-no-wrap">${esc(item.name)}</span>
        <span class="display-block margin-top-05">
          <span class="${tagClass[item.kind]}">${esc(kindLabel[item.kind])}</span>
          <span class="text-base font-body-3xs"> ${item.nFiles} files</span>
        </span>
      </th>
      <td data-sort-value="${item.lines}" class="font-mono-sm text-tabular text-right">${item.lines.toLocaleString()}</td>
      <td data-sort-value="${item.uses}" class="text-right"><span class="usa-tag ${item.uses ? "bg-success-dark" : "bg-base-lighter text-ink"}">${item.uses}</span></td>
      <td>${tags(item.reusedBy, kinds)}</td>
      <td data-sort-value="${item.deps.length}">${tags(item.deps, kinds, 10)}</td>
      <td>${usedInCell(item)}</td>
    </tr>`;
}

function buildHtml(packages) {
  accN = 0;
  const ui = packages.filter((item) => item.kind === "component");
  const shared = ui.filter((item) => item.isShared);
  const allLines = packages.reduce((n, item) => n + item.lines, 0);
  const sharedLines = shared.reduce((n, item) => n + item.lines, 0);
  const top = shared.slice(0, 8);
  const biggest = ui.slice().sort((a, b) => b.lines - a.lines).slice(0, 5);
  const kinds = {};
  packages.forEach((item) => {
    kinds[item.name] = item.kind;
  });
  const fontsPkg = packages.find((item) => item.name === "uswds-fonts");
  const corePkg = packages.find((item) => item.name === "uswds-core");
  const today = new Date().toISOString().slice(0, 10);
  const cdn = `https://cdn.jsdelivr.net/npm/@uswds/uswds@${pkg.version}`;

  const topCards = top
    .slice(0, 4)
    .map(
      (item) => `
        <li class="usa-card tablet:grid-col-6 desktop:grid-col-3">
          <div class="usa-card__container">
            <div class="usa-card__header">
              <h2 class="usa-card__heading">${esc(item.name)}</h2>
            </div>
            <div class="usa-card__body">
              <p class="font-lang-3xl text-bold text-primary margin-y-0">${item.uses}</p>
              <p class="font-body-2xs text-base margin-bottom-0">other components · ${item.lines.toLocaleString()} lines</p>
            </div>
          </div>
        </li>`,
    )
    .join("");

  let topTable = "";
  top.forEach((item, i) => {
    let sample = item.reusedBy.slice(0, 6).join(", ");
    if (item.reusedBy.length > 6) sample += "…";
    topTable += `<tr>
      <th scope="row">${i + 1}</th>
      <td class="text-bold text-no-wrap">${esc(item.name)}</td>
      <td class="font-mono-sm text-tabular text-right">${item.lines.toLocaleString()}</td>
      <td class="text-right">${item.uses}</td>
      <td>${esc(sample)}</td>
    </tr>`;
  });

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>USWDS component sharing report</title>
    <link rel="stylesheet" href="${cdn}/dist/css/uswds.min.css">
    <style>
      .tag-wrap { display: flex; flex-wrap: wrap; gap: 0.25rem; }
      #report-table { min-width: 68rem; }
      #report-table td, #report-table th[scope="row"] { vertical-align: top; }
      .usa-accordion { margin-top: 0; }
      .filter-toolbar .usa-label { margin-top: 0; }
      .filter-toolbar__row {
        display: flex;
        flex-wrap: nowrap;
        align-items: stretch;
        gap: 1rem;
      }
      .filter-toolbar__row .usa-input {
        flex: 1 1 0;
        min-width: 8rem;
        max-width: none;
        width: auto;
        margin-top: 0;
        min-height: 2.5rem;
      }
      .filter-toolbar .filter-group {
        flex: 0 0 auto;
        margin: 0;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: stretch;
      }
      .filter-toolbar .filter-group .usa-button-group__item {
        margin-top: 0;
        margin-bottom: 0;
      }
      .filter-toolbar .filter-group .usa-button {
        margin-top: 0;
        white-space: nowrap;
        min-height: 2.5rem;
      }
      @media (max-width: 39.99em) {
        .filter-toolbar__row { flex-wrap: wrap; }
        .filter-toolbar__row .usa-input { flex: 1 1 100%; }
      }
    </style>
  </head>
  <body>
    <a class="usa-skipnav" href="#main-content">Skip to main content</a>
    <section class="usa-section usa-section--dark">
      <div class="grid-container">
        <p class="font-body-2xs text-uppercase margin-bottom-1">USWDS packages analysis</p>
        <h1 class="margin-top-0">Component sharing report</h1>
        <p class="usa-intro">Inventory of how packages in <code>packages/</code> depend on and reuse one another. <strong>Uses</strong> and <strong>reused by</strong> count other UI components only — not the <code>uswds</code> aggregator or the <code>uswds-core</code> JS registry.</p>
      </div>
    </section>
    <main id="main-content">
      <div class="grid-container usa-section">
        <ul class="usa-card-group">
          <li class="usa-card tablet:grid-col-6 desktop:grid-col-3">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">Packages analyzed</h2>
              </div>
              <div class="usa-card__body">
                <p class="font-lang-3xl text-bold text-primary margin-y-0">${packages.length}</p>
              </div>
            </div>
          </li>
          <li class="usa-card tablet:grid-col-6 desktop:grid-col-3">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">UI components</h2>
              </div>
              <div class="usa-card__body">
                <p class="font-lang-3xl text-bold text-primary margin-y-0">${ui.length}</p>
                <p class="font-body-2xs text-base margin-bottom-0">${shared.length} shared across other components</p>
              </div>
            </div>
          </li>
          <li class="usa-card tablet:grid-col-6 desktop:grid-col-3">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">Shared component lines</h2>
              </div>
              <div class="usa-card__body">
                <p class="font-lang-3xl text-bold text-primary margin-y-0">${sharedLines.toLocaleString()}</p>
                <p class="font-body-2xs text-base margin-bottom-0">of ${allLines.toLocaleString()} total source lines</p>
              </div>
            </div>
          </li>
          <li class="usa-card tablet:grid-col-6 desktop:grid-col-3">
            <div class="usa-card__container">
              <div class="usa-card__header">
                <h2 class="usa-card__heading">Top shared component</h2>
              </div>
              <div class="usa-card__body">
                <p class="font-sans-lg text-bold margin-y-0">${esc(top[0] ? top[0].name : "—")}</p>
                <p class="font-body-2xs text-base margin-bottom-0">reused by ${top[0] ? top[0].uses : 0} components</p>
              </div>
            </div>
          </li>
        </ul>

        <h2>Most reused</h2>
        <ul class="usa-card-group">${topCards}</ul>

        <div class="usa-summary-box margin-bottom-4" role="region" aria-labelledby="sharing-findings">
          <div class="usa-summary-box__body">
            <h3 class="usa-summary-box__heading" id="sharing-findings">Sharing findings</h3>
            <div class="usa-summary-box__text">
              <ul class="usa-list">
                <li><strong>${shared.length} of ${ui.length} UI components</strong> are reused by at least one other UI component (Sass <code>@forward</code>, JS <code>require</code>, or Twig include).</li>
                <li><strong>${esc(top[0].name)}</strong> is the most shared UI component (${top[0].uses} consumers), followed by <strong>${esc(top[1].name)}</strong> (${top[1].uses}) and <strong>${esc(top[2].name)}</strong> (${top[2].uses}).</li>
                <li>Foundation package <strong>uswds-fonts</strong> is forwarded by ${fontsPkg ? fontsPkg.uses : 0} UI components; <strong>uswds-core</strong> is the shared settings/JS runtime (${corePkg ? corePkg.lines.toLocaleString() : 0} lines).</li>
                <li>Largest UI implementations: ${biggest.map((item) => `${esc(item.name)} (${item.lines.toLocaleString()} lines)`).join(", ")}.</li>
                <li>Page templates live under <code>templates</code> and compose banner, header, footer, identifier, skipnav, and sidenav. Those sites appear in <strong>used in</strong>.</li>
              </ul>
            </div>
          </div>
        </div>

        <h3>Top shared UI components</h3>
        <div class="usa-table-container--scrollable" tabindex="0">
          <table class="usa-table usa-table--compact usa-table--striped">
            <caption>Highest-reuse UI components</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Component</th>
                <th scope="col" class="text-right">Lines</th>
                <th scope="col" class="text-right">Uses</th>
                <th scope="col">Reused by (sample)</th>
              </tr>
            </thead>
            <tbody>${topTable}</tbody>
          </table>
        </div>

        <h2 class="margin-top-6">Component table</h2>
        <p class="usa-hint" id="row-count"></p>
        <div class="filter-toolbar margin-bottom-2">
          <label class="usa-label" for="search">Filter table</label>
          <div class="filter-toolbar__row">
            <input class="usa-input" id="search" name="search" type="search" placeholder="Filter by component, reused by, depends on, used in…">
            <ul class="usa-button-group usa-button-group--segmented filter-group" role="group" aria-label="Package filters">
              <li class="usa-button-group__item">
                <button type="button" class="usa-button filter-btn" data-filter="shared" aria-pressed="true">Shared</button>
              </li>
              <li class="usa-button-group__item">
                <button type="button" class="usa-button usa-button--outline filter-btn" data-filter="component" aria-pressed="false">UI components</button>
              </li>
              <li class="usa-button-group__item">
                <button type="button" class="usa-button usa-button--outline filter-btn" data-filter="foundation" aria-pressed="false">Foundation</button>
              </li>
              <li class="usa-button-group__item">
                <button type="button" class="usa-button usa-button--outline filter-btn" data-filter="bundle" aria-pressed="false">Bundles</button>
              </li>
              <li class="usa-button-group__item">
                <button type="button" class="usa-button usa-button--outline filter-btn" data-filter="all" aria-pressed="false">All packages</button>
              </li>
            </ul>
          </div>
        </div>
        <p class="font-body-2xs text-base">
          <span class="usa-tag bg-primary">UI component</span>
          <span class="usa-tag bg-primary-darker">Foundation</span>
          <span class="usa-tag bg-base-dark">Bundle</span>
          <span class="usa-tag bg-success-dark">Template</span>
        </p>
        <div class="usa-table-container--scrollable" tabindex="0">
          <table class="usa-table usa-table--compact usa-table--striped usa-table--sticky-header" id="report-table">
            <caption>All packages and how they are shared</caption>
            <thead>
              <tr>
                <th data-sortable scope="col" role="columnheader">Component</th>
                <th data-sortable scope="col" role="columnheader">Lines</th>
                <th data-sortable scope="col" role="columnheader" aria-sort="descending">Uses</th>
                <th scope="col">Reused by</th>
                <th data-sortable scope="col" role="columnheader">Depends on</th>
                <th scope="col">Used in</th>
              </tr>
            </thead>
            <tbody>
              ${packages.map((item) => tableRow(item, kinds)).join("\n")}
            </tbody>
          </table>
        </div>

        <h2 class="font-heading-md">How this was counted</h2>
        <ul class="usa-list font-body-xs text-base">
          <li><strong>Component</strong> — a directory under <code>packages</code>.</li>
          <li><strong>Lines</strong> — physical lines in <code>.scss</code>, <code>.js</code>, and <code>.twig</code> source files. Tests and Storybook stories are excluded.</li>
          <li><strong>Depends on</strong> — other packages referenced from <code>_index.scss</code> <code>@forward</code>, JS <code>require</code>/<code>import</code>, or Twig <code>include</code>/<code>embed</code>.</li>
          <li><strong>Reused by / uses</strong> — other <em>UI components</em> that depend on this package. Aggregators (<code>uswds</code>, <code>uswds-form-controls</code>, <code>uswds-typography</code>, and the <code>uswds-core</code> JS component registry) are omitted from this count so the table shows real composition, not “included in the full library.”</li>
          <li><strong>Used in</strong> — Twig files in other packages (including <code>templates</code>) that include this component. If composition is Sass/JS only, that is noted. Bundle membership is listed when relevant.</li>
        </ul>
        <p class="font-body-2xs text-base">Generated ${esc(today)} with <code>npm run shared:components</code>.</p>
      </div>
    </main>
    <script src="${cdn}/dist/js/uswds.min.js"></script>
    <script>
      const q = document.getElementById("search");
      const filterBtns = document.querySelectorAll(".filter-btn");
      const tableRows = [].slice.call(document.querySelectorAll("#report-table tbody tr"));
      const countEl = document.getElementById("row-count");
      let current = "shared";

      function matches(tr) {
        const kind = tr.dataset.kind;
        const sharedRow = tr.dataset.shared === "1";
        if (current === "shared" && !(sharedRow && kind === "component")) return false;
        if (current === "component" && kind !== "component") return false;
        if (current === "foundation" && kind !== "foundation") return false;
        if (current === "bundle" && kind !== "bundle") return false;
        const needle = q.value.trim().toLowerCase();
        if (needle && tr.innerText.toLowerCase().indexOf(needle) === -1) return false;
        return true;
      }

      function refresh() {
        let n = 0;
        for (let i = 0; i < tableRows.length; i += 1) {
          const show = matches(tableRows[i]);
          tableRows[i].hidden = !show;
          if (show) n += 1;
        }
        countEl.textContent = n + " of " + tableRows.length + " packages";
      }

      for (let i = 0; i < filterBtns.length; i += 1) {
        filterBtns[i].addEventListener("click", function onFilter(e) {
          current = e.currentTarget.dataset.filter;
          for (let j = 0; j < filterBtns.length; j += 1) {
            const on = filterBtns[j].dataset.filter === current;
            filterBtns[j].classList.toggle("usa-button--outline", !on);
            filterBtns[j].setAttribute("aria-pressed", on ? "true" : "false");
          }
          refresh();
        });
      }
      q.addEventListener("input", refresh);
      refresh();
    </script>
  </body>
</html>
`;
}

dutil.logIntroduction("USWDS shared components");
dutil.logMessage(
  "shared:components",
  "Scanning packages for Sass, JS, and Twig reuse…",
);

const packages = scanPackages();
const nShared = packages.filter((item) => item.isShared).length;
const html = buildHtml(packages);

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(reportPath, html, "utf8");

dutil.logMessage(
  "shared:components",
  `Found ${nShared} shared UI components across ${packages.length} packages.`,
);
dutil.logMessage(
  "shared:components",
  `Wrote ${path.relative(projectRoot, reportPath)}`,
);
