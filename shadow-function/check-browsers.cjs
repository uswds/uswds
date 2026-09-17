const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
const [repo, chromiumExecutable] = process.argv.slice(2);
const playwright = require(path.join(repo,'node_modules/playwright'));
(async () => {
  const results = [];
  for (const name of ['chromium']) {
    const browser = await playwright[name].launch({headless:true,executablePath:chromiumExecutable});
    try {
      const page=await browser.newPage({viewport:{width:1280,height:800}});
      const values={};
      for (const state of ['before','after']) {
        await page.goto(pathToFileURL(path.join(__dirname,`${state}.html`)).href);
        values[state]=await page.evaluate(()=>Object.fromEntries([...document.querySelectorAll('.surface')].map(el=>[el.className,getComputedStyle(el).boxShadow])));
      }
      let assertions=0;
      for (const token of ['two','five']) {
        const fn=`surface function-${token}`,mixin=`surface mixin-${token}`;
        assert.equal(values.before[fn],'none');assertions++;
        assert.notEqual(values.before[mixin],'none');assertions++;
        assert.equal(values.after[fn],values.after[mixin]);assertions++;
        assert.equal(values.before[mixin],values.after[mixin]);assertions++;
      }
      results.push({browser:name,version:browser.version(),assertions,status:'passed',computedShadows:values});
      console.log(`${name}: ${assertions} assertions passed`);
    } finally {await browser.close();}
  }
  fs.writeFileSync(path.join(__dirname,'browser-results.json'),JSON.stringify(results,null,2)+'\n');
})().catch(error=>{console.error(error);process.exitCode=1;});
