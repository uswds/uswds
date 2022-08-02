const assert = require("assert");
const fs = require("fs");
const path = require("path");
const skipnav = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("skip nav link", () => {
  const { body } = document;

  let skipLink;
  let topLink;
  let main;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    skipLink = body.querySelector(".usa-skipnav");
    topLink = body.querySelector(".usa-footer__return-to-top a");
    main = body.querySelector("main");
    skipnav.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    skipnav.off(body);
  });

  it('skipnav link sets tabindex="0" when clicked', () => {
    skipLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");
  });

  it('skipnav link sets tabindex="-1" when blurred', () => {
    skipLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");

    main.focus(); // XXX jsdom doesn't do this for us
    main.blur();
    assert.strictEqual(main.getAttribute("tabindex"), "-1");
  });

  it('return to top link sets tabindex="0" when clicked', () => {
    topLink.click();
    assert.strictEqual(main.getAttribute("tabindex"), "0");
  });
});
