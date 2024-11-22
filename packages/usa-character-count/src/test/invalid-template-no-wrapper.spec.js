const fs = require("fs");
const path = require("path");
const assert = require("assert");
const CharacterCount = require("../index");

const INVALID_TEMPLATE_NO_WRAPPER = fs.readFileSync(
  path.join(__dirname, "/invalid-template-no-wrapper.template.html"),
);

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "character count",
    selector: () => document.querySelector(".usa-character-count"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`character count input without wrapping element initialized at ${name}`, () => {
    const { body } = document;

    afterEach(() => {
      body.textContent = "";
    });

    it("should throw an error when a character count component is created with no wrapping class", () => {
      body.innerHTML = INVALID_TEMPLATE_NO_WRAPPER;
      assert.throws(() => CharacterCount.on(containerSelector()), {
        message:
          ".usa-character-count__field is missing outer .usa-character-count",
      });
    });
  });
});
