const fs = require("fs");
const path = require("path");
const assert = require("assert");
const validator = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/template-textarea.html"),
);

const TEXTAREA_SELECTOR = "[data-validation-element]";
const VALIDATORS = "[data-validator]";
const VALIDATOR_SUMMARY = "[data-validation-status]";
const CHECKED_CLASS = "usa-checklist__item--checked";

const textareaSelector = () => document.querySelector(TEXTAREA_SELECTOR);

const keyup = (el) => {
  el.dispatchEvent(new Event("change", { bubbles: true }));
};

const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "textarea", selector: textareaSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`validator component initialized at ${name}`, () => {
    const { body } = document;

    let validated;
    let validators;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;

      validator.on(containerSelector());

      validated = textareaSelector();
      validators = Array.from(document.querySelectorAll(VALIDATORS));
    });

    afterEach(() => {
      validator.off(containerSelector());
      body.textContent = "";
    });

    describe("initialization", () => {
      it("creates a hidden span element for accessibility status summary readout", () => {
        if (validators) {
          assert.notStrictEqual(
            document.querySelector(VALIDATOR_SUMMARY),
            null,
          );
        }
      });
    });

    describe("validation state", () => {
      it(`adds .${CHECKED_CLASS} for all successful validations`, () => {
        validated.value = "This is one great comment!";
        keyup(validated);
        validators.forEach((checkbox) => {
          assert.strictEqual(checkbox.classList.contains(CHECKED_CLASS), true);
        });
      });

      it(`removes .${CHECKED_CLASS} for failed validations`, () => {
        validated.value = "";
        keyup(validated);
        validators.forEach((checkbox) => {
          const checked = checkbox.classList.contains(CHECKED_CLASS);
          if (checkbox.getAttribute("data-validator") === "empty") {
            assert.strictEqual(checked, false);
          } else {
            assert.strictEqual(checked, true);
          }
        });
      });
    });
  });
});
