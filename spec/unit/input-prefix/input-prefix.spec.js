const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../../../src/js/components/input-prefix-suffix");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("input prefix", () => {
  const { body } = document;

  let input;
  let container;
  let prefix;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    input = body.querySelector(".usa-input");
    container = body.querySelector(".usa-input-group");
    prefix = body.querySelector(".usa-input-prefix");
    behavior.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    behavior.off(body);
  });

  it('it should add "is-focused" class name to container when the prefix is clicked', () => {
    prefix.click();
    assert.strictEqual(container.classList.contains("is-focused"), true);
  });

  it('it should add "is-focused" class name to container when input recieves focus()', () => {
    input.focus();
    assert.strictEqual(container.classList.contains("is-focused"), true);
  });

  it('it should remove "is-focused" class name from container on input blur() event', () => {
    input.focus();
    input.blur();
    assert.strictEqual(container.classList.contains("is-focused"), false);
  });
});
