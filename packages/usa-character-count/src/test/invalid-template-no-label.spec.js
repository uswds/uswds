const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../index");

const INVALID_TEMPLATE_NO_LABEL = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-label.template.html")
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "character count",
    selector: () => document.querySelector(".usa-character-count"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count component without label initialized at ${name}`, () => {
    const { body } = document;

    afterEach(() => {
      CharacterCount.off(containerSelector());
      body.textContent = "";
    });

    it("should throw an error when a character count component is created with no label element", () => {
      body.innerHTML = INVALID_TEMPLATE_NO_LABEL;
      assert.throws(() => CharacterCount.on(containerSelector()), {
        message: ".usa-character-count is missing inner .usa-label",
      });
    });
  });
});
