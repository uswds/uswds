const fs = require("node:fs");
const path = require("node:path");

const [repo, output] = process.argv.slice(2);
const sass = require(path.join(repo, "node_modules/sass-embedded"));
const css = sass.compileString(`
  @use "uswds-core" as * with ($theme-show-notifications: false, $theme-image-path: "./img");
  @use "usa-checkbox";
  @use "usa-radio";
  .dark { @include checkbox-colors("gray-90"); @include radio-colors("gray-90"); }
`, { loadPaths: [path.join(repo, "packages")], logger: sass.Logger.silent }).css;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.mkdirSync(path.join(path.dirname(output), "img"), { recursive: true });
for (const name of ["correct8", "correct8-alt", "checkbox-indeterminate", "checkbox-indeterminate-alt"]) {
  fs.copyFileSync(path.join(repo, "dist/img", `${name}.svg`), path.join(path.dirname(output), "img", `${name}.svg`));
}
const cssFile = path.basename(output).replace(/\.html$/, ".css");
fs.writeFileSync(path.join(path.dirname(output), cssFile), css);
let content = "";
for (const theme of ["light", "dark"]) {
  content += `<section class="${theme}"><h2>${theme === "light" ? "Default colors" : "Dark colors"}</h2><div class="matrix"><div>State</div><div>Native, unchecked</div><div>Native, checked</div><div>Data attribute, unchecked</div><div>Data attribute, checked</div>`;
  for (const tile of [false, true]) {
    for (const disabled of ["enabled", "disabled", "aria-disabled"]) {
      content += `<div class="row-label">${tile ? "Tile" : "Default"}<small>${disabled}</small></div>`;
      for (const source of ["native", "data"]) {
        for (const checked of [false, true]) {
          const id = [theme, tile ? "tile" : "default", disabled, source, checked].join("-");
          content += `<div class="usa-checkbox"><input id="${id}" class="usa-checkbox__input${tile ? " usa-checkbox__input--tile" : ""}" type="checkbox" ${checked ? "checked" : ""} ${disabled === "disabled" ? "disabled" : ""} ${disabled === "aria-disabled" ? 'aria-disabled="true"' : ""} ${source === "data" ? "data-indeterminate" : 'data-native'}><label class="usa-checkbox__label" for="${id}">Selected items</label></div>`;
        }
      }
    }
  }
  content += "</div></section>";
}
content += '<section class="controls"><h2>Ordinary checked controls</h2><div class="usa-checkbox"><input class="usa-checkbox__input" id="ordinary-checkbox" type="checkbox" checked><label class="usa-checkbox__label" for="ordinary-checkbox">Checked checkbox</label></div><div class="usa-radio"><input class="usa-radio__input" id="ordinary-radio" type="radio" checked><label class="usa-radio__label" for="ordinary-radio">Checked radio</label></div></section>';
fs.writeFileSync(output, `<!doctype html><html lang="en"><meta charset="utf-8"><title>Checkbox indeterminate state matrix</title><link rel="stylesheet" href="${cssFile}"><style>body{margin:0;padding:28px;font:16px/1.4 system-ui;background:#f0f0f0;color:#1b1b1b}h1{font-size:26px;margin:0 0 6px}p{margin:0 0 20px}h2{font-size:20px;margin:0 0 12px}section{padding:20px;background:white;margin-bottom:20px}.dark{background:#1b1b1b;color:white}.matrix{display:grid;grid-template-columns:130px repeat(4,1fr);gap:8px 12px;align-items:center}.matrix>div{min-width:0}.matrix>.row-label{font-weight:600}.row-label small{display:block;font-weight:400}.usa-checkbox__label{font-size:16px;margin-top:0!important}.usa-checkbox__input--tile+.usa-checkbox__label{padding-top:14px;padding-bottom:14px}.controls .usa-checkbox,.controls .usa-radio{display:inline-block;margin-right:32px}</style><h1>Checkbox indeterminate states</h1><p>Indeterminate should display a dash for either checked value. Native property and data attribute use the same indicator.</p>${content}<script>document.querySelectorAll('[data-native]').forEach(input=>input.indeterminate=true)</script></html>`);
