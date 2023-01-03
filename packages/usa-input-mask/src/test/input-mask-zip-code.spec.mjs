import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import assert from "assert";
import InputMask from "../index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask-zip-code.template.html")
);

const EVENTS = {};

/**
 * send an input event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.input = (el) => {
  el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
};

const inputMaskingSelector = () => document.querySelector(".usa-input-masking");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "input mask", selector: inputMaskingSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`input mask component initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let input;
    let shell;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      InputMask.on(containerSelector());

      root = inputMaskingSelector();
      input = root.querySelector(".usa-input");
    });

    afterEach(() => {
      InputMask.off(containerSelector());
      body.textContent = "";
    });

    it("formats a US zip code to 12345-6789", () => {
      input.value = "123456789";

      EVENTS.input(input);
      shell = root.querySelector(".usa-input-mask--content");
      assert.strictEqual(shell.textContent, "12345-6789");
    });
  });
});
