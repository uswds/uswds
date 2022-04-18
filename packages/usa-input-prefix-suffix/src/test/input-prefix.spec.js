const assert = require("assert");
const fs = require("fs");
const path = require("path");
const behavior = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const inputGroupSelector = () => document.querySelector(".usa-input-group");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input group", selector: inputGroupSelector }
];

tests.forEach(({name, selector: containerSelector}) => {
  describe(`input prefix initialized at ${name}`, () => {
    const { body } = document;

    let input;
    let container;
    let prefix;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      input = body.querySelector(".usa-input");
      container = inputGroupSelector();
      prefix = body.querySelector(".usa-input-prefix");
      behavior.on(containerSelector());
    });

    afterEach(() => {
      behavior.off(containerSelector());
      body.innerHTML = "";
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
});
