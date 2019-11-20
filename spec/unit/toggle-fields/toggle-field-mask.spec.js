const assert = require("assert");
const toggleFieldMask = require("../../../src/js/utils/toggle-field-mask");

const createElement = (name, attrs) => {
  const el = document.createElement(name);

  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));

  return el;
};

describe("toggleFieldMask()", () => {
  it("switches the type of an input from text to password when true", () => {
    const text = createElement("input", {
      type: "text",
      autocapitalize: "off",
      autocorrect: "off"
    });
    toggleFieldMask(text, true);
    assert.equal(text.getAttribute("type"), "password");
  });

  it("switches the type of an input from password to text when false", () => {
    const password = createElement("input", {
      type: "password",
      autocapitalize: "off",
      autocorrect: "off"
    });
    toggleFieldMask(password, false);
    assert.equal(password.getAttribute("type"), "text");
  });
});
