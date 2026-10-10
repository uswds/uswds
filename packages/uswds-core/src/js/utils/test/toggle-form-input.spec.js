const assert = require("assert");
const fs = require("fs");
const path = require("path");
const toggleFormInput = require("../toggle-form-input");

const { resolveIdRefs } = toggleFormInput;

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/toggle.template.html"));

const CONTROL_SELECTOR = ".usa-show-password";
const PASSWORD_SELECTOR = "#password";
const CONFIRM_SELECTOR = "#confirmPassword";
const HIDE_TEXT = "Hide my typing";
const SHOW_TEXT = "Show my typing";

describe("resolveIdRefs", () => {
  /** @type {HTMLElement} */
  let aElement;

  /** @type {HTMLElement} */
  let bElement;

  beforeEach(() => {
    aElement = document.createElement("span");
    aElement.id = "a";
    document.body.appendChild(aElement);
    bElement = document.createElement("span");
    bElement.id = "b";
    document.body.appendChild(bElement);
  });

  afterEach(() => {
    aElement.remove();
    bElement.remove();
  });

  it("returns matched elements ignoring excess whitespace", () => {
    const elements = resolveIdRefs(" a  b ");

    assert.strictEqual(elements.length, 2);
    assert.strictEqual(elements[0], aElement);
    assert.strictEqual(elements[1], bElement);
  });

  it("silently ignores ids without corresponding element", () => {
    const elements = resolveIdRefs("a c b");

    assert.strictEqual(elements.length, 2);
    assert.strictEqual(elements[0], aElement);
    assert.strictEqual(elements[1], bElement);
  });
});

describe("toggleFormInput", () => {
  const { body } = document;
  let maskControl;
  let password;
  let confirmPassword;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;

    maskControl = body.querySelector(CONTROL_SELECTOR);
    password = body.querySelector(PASSWORD_SELECTOR);
    confirmPassword = body.querySelector(CONFIRM_SELECTOR);
  });

  afterEach(() => {
    body.textContent = "";
  });

  it("defaults to masked", () => {
    assert.strictEqual(password.type, "password");
    assert.strictEqual(maskControl.textContent, SHOW_TEXT);
  });

  it("switches type of inputs from password to text when true", () => {
    toggleFormInput(maskControl);
    assert.strictEqual(password.type, "text");
    assert.strictEqual(confirmPassword.type, "text");
  });

  it("changes text of mask control element to match show/hide text", () => {
    toggleFormInput(maskControl);
    assert.strictEqual(maskControl.textContent, HIDE_TEXT);

    toggleFormInput(maskControl);
    assert.strictEqual(maskControl.textContent, SHOW_TEXT);
  });

  it("toggles existing fields around a missing reference", () => {
    maskControl.setAttribute(
      "aria-controls",
      "password missing confirmPassword",
    );

    toggleFormInput(maskControl);
    assert.strictEqual(password.type, "text");
    assert.strictEqual(confirmPassword.type, "text");

    toggleFormInput(maskControl);
    assert.strictEqual(password.type, "password");
    assert.strictEqual(confirmPassword.type, "password");
  });

  ["missing", "", "   ", null].forEach((references) => {
    it(`preserves the control when no fields resolve from ${JSON.stringify(references)}`, () => {
      if (references === null) {
        maskControl.removeAttribute("aria-controls");
      } else {
        maskControl.setAttribute("aria-controls", references);
      }
      const before = maskControl.outerHTML;

      assert.strictEqual(toggleFormInput(maskControl), false);
      assert.strictEqual(toggleFormInput(maskControl), false);
      assert.strictEqual(maskControl.outerHTML, before);
      assert.strictEqual(password.type, "password");
      assert.strictEqual(confirmPassword.type, "password");
    });
  });

  it("preserves an existing pressed state when no fields resolve", () => {
    maskControl.setAttribute("aria-controls", "missing");
    maskControl.setAttribute("aria-pressed", "true");
    const before = maskControl.outerHTML;

    assert.strictEqual(toggleFormInput(maskControl), true);
    assert.strictEqual(maskControl.outerHTML, before);
  });
});
