const fs = require("fs");
const path = require("path");
const assert = require("assert");
const InputMask = require("../index");

const TEMPLATE = fs.readFileSync(
  path.join(__dirname, "/input-mask.template.html"),
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

    it("formats a nine digit social security number to 999 99 9999", () => {
      input.value = "999999999";

      EVENTS.input(input);
      shell = root.querySelector(".usa-input-mask--content");
      assert.strictEqual(shell.textContent, "999 99 9999");
    });
  });
});

const NO_ID_TEMPLATE = `
<div class="usa-input-masking">
  <label class="usa-label">Social Security Number</label>
  <input
    type="text"
    inputmode="numeric"
    name="ssn-first"
    placeholder="___ __ ____"
    class="usa-input usa-masked"
  />
  <label class="usa-label">Second Social Security Number</label>
  <input
    type="text"
    inputmode="numeric"
    name="ssn-second"
    placeholder="___ __ ____"
    class="usa-input usa-masked"
  />
</div>`;

describe("input mask component with inputs that have no id", () => {
  const { body } = document;

  let inputs;

  beforeEach(() => {
    body.innerHTML = NO_ID_TEMPLATE;
    InputMask.on(document.body);

    inputs = Array.from(document.querySelectorAll(".usa-masked"));
  });

  afterEach(() => {
    InputMask.off(document.body);
    body.textContent = "";
  });

  it("wraps each input in a shell with its own mask content", () => {
    inputs.forEach((input) => {
      const shell = input.closest(".usa-input-mask");
      assert.ok(shell, "input should be wrapped in a mask shell");
      assert.strictEqual(
        shell.querySelector(".usa-input-mask--content").textContent,
        "___ __ ____",
      );
    });
  });

  it("does not generate a mask content id from an empty input id", () => {
    document.querySelectorAll(".usa-input-mask--content").forEach((el) => {
      assert.strictEqual(el.hasAttribute("id"), false);
    });
    assert.strictEqual(document.getElementById("Mask"), null);
  });

  it("formats the value without throwing", () => {
    const [input] = inputs;
    input.value = "999999999";

    assert.doesNotThrow(() => EVENTS.input(input));
    assert.strictEqual(input.value, "999 99 9999");
    assert.strictEqual(
      input.closest(".usa-input-mask").querySelector(".usa-input-mask--content")
        .textContent,
      "999 99 9999",
    );
  });

  it("updates only the mask that belongs to the edited input", () => {
    const [first, second] = inputs;
    const contentOf = (input) =>
      input
        .closest(".usa-input-mask")
        .querySelector(".usa-input-mask--content");

    second.value = "12345";
    EVENTS.input(second);

    assert.strictEqual(contentOf(first).textContent, "___ __ ____");
    assert.strictEqual(contentOf(second).textContent, "123 45 ____");
  });
});
