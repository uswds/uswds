const assert = require("assert");
const fs = require("fs");
const path = require("path");
const toggleFormInput = require("../../../src/js/utils/toggle-form-input");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const CONTROL_SELECTOR = ".usa-show-multipassword";
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
    assert.equal(password.type, "password");
    assert.equal(maskControl.textContent, SHOW_TEXT);
  });

  it("switches type of inputs from password to text when true", () => {
    toggleFormInput(maskControl);
    assert.equal(password.type, "text");
    assert.equal(confirmPassword.type, "text");
  });

  it("changes text of mask control element to match show/hide text", () => {
    toggleFormInput(maskControl);
    assert.equal(maskControl.textContent, HIDE_TEXT);

    toggleFormInput(maskControl);
    assert.equal(maskControl.textContent, SHOW_TEXT);
  });
});
