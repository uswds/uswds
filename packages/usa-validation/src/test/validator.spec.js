const fs = require("fs");
const path = require("path");
const assert = require("assert");
const validator = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const INPUT_SELECTOR = "[data-validation-element]";
const VALIDATORS = "[data-validator]";
const VALIDATOR_LABEL = "[data-checklist-label]";
const CHECKED_CLASS = "usa-checklist__item--checked";

const inputSelector = () => document.querySelector(INPUT_SELECTOR);

const keyup = (el) => {
  el.dispatchEvent(new Event("change", { bubbles: true }));
};

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input", selector: inputSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`validator component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let validated;
    let validators;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      validator.on(containerSelector());

      root = inputSelector();
      validated = inputSelector();
      validators = root.querySelectorAll(VALIDATORS);
    });

    afterEach(() => {
      validator.off(containerSelector());
      body.textContent = "";
    });

    describe("initialization", () => {
      it("creates a hidden span element in each list item", () => {
        validators.forEach((checkbox) => {
          assert.notStrictEqual(checkbox.queryElement(VALIDATOR_LABEL), null);
        });
      });
    });

    describe("validation state", () => {
      it(`adds .${CHECKED_CLASS} for all successful validations`, () => {
        validated.value = "GreatPassword1";
        keyup(validated);
        validators.forEach((checkbox) => {
          assert.strictEqual(checkbox.classList.contains(CHECKED_CLASS), true);
        });
      });

      it(`removes .${CHECKED_CLASS} for failed validations`, () => {
        validated.value = "GreatPassword";
        keyup(validated);
        validators.forEach((checkbox) => {
          const checked = checkbox.classList.contains(CHECKED_CLASS);
          if (checkbox.getAttribute("data-validator") === "numerical") {
            assert.strictEqual(checked, false);
          } else {
            assert.strictEqual(checked, true);
          }
        });
      });
    });
  });
});
