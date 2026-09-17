const fs = require('node:fs');
const path = require('node:path');
const [repo, output] = process.argv.slice(2);
const sass = require(path.join(repo, 'node_modules/sass-embedded'));
const source = `@use "uswds-core" as *;
.function-two { box-shadow: shadow(2); }
.mixin-two { @include u-shadow(2); }
.function-five { box-shadow: shadow(5); }
.mixin-five { @include u-shadow(5); }`;
const css = sass.compileString(source, {loadPaths: [path.join(repo,'packages')], style:'compressed', logger:sass.Logger.silent}).css;
const examples = [
  ['Function, token 2','function-two','box-shadow: shadow(2);'],
  ['Mixin, token 2','mixin-two','@include u-shadow(2);'],
  ['Function, token 5','function-five','box-shadow: shadow(5);'],
  ['Mixin, token 5','mixin-five','@include u-shadow(5);'],
];
const markup = examples.map(([title,cls,code])=>`<section><h2>${title}</h2><code>${code}</code><div class="surface ${cls}"><strong>Example surface</strong><p>Shadow should match the corresponding mixin.</p></div></section>`).join('');
const html = `<!doctype html><html lang="en"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>USWDS shadow token rendering</title><style>*{box-sizing:border-box}html{font-size:16px}body{margin:0;background:#f5f6f7;color:#1b1b1b;font-family:Arial,sans-serif}main{max-width:1100px;margin:48px auto;padding:0 28px}h1{font-size:30px;margin:0 0 12px}.intro{font-size:17px;line-height:1.5;margin:0 0 32px}article{display:grid;grid-template-columns:1fr 1fr;gap:32px 56px}section{padding:0 8px}h2{font-size:19px;margin:0 0 10px}code{font-size:14px}.surface{margin-top:22px;background:white;padding:25px;min-height:124px;line-height:1.5}.surface p{margin:8px 0 0;font-size:15px}footer{font-size:13px;margin-top:36px;color:#565c65}${css}</style><main><h1>USWDS shadow token rendering</h1><p class="intro">Synthetic fixture using the documented function and existing mixin.<br>Same markup, theme, and 1280px viewport in both captures.</p><article>${markup}</article><footer>Local fixture. Default USWDS root font size. No JavaScript interaction.</footer></main></html>`;
fs.writeFileSync(output,html);
fs.writeFileSync(output.replace('.html','.css'),css+'\n');
console.log(output);
