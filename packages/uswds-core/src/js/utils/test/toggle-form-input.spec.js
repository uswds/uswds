const assert = require("assert");
const fs = require("fs");
const path = require("path");
const toggleFormInput = require("../toggle-form-input");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/toggle.template.html"));

const CONTROL_SELECTOR = ".usa-show-password";
const PASSWORD_SELECTOR = "#password";
const CONFIRM_SELECTOR = "#confirmPassword";
const HIDE_TEXT = "Hide my typing";
const SHOW_TEXT = "Show my typing";

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
});
