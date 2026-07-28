const assert = require("assert");
const fs = require("fs");
const path = require("path");
const LanguageSelector = require("../index");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

const EVENTS = {
  escape(el) {
    const escapeKeyEvent = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
    });

    el.dispatchEvent(escapeKeyEvent);
  },
  focusOut(el) {
    const focusOutEvent = new Event("focusout", {
      bubbles: true,
      cancelable: true,
    });

    el.dispatchEvent(focusOutEvent);
  },
};

describe("language selector component", () => {
  const { body } = document;

  let language;
  let languageList;
  let languageButton;
  let languageLink;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    language = body.querySelector(".usa-language-container");
    languageList = body.querySelector(".usa-language__submenu");
    languageButton = body.querySelector(".usa-language__link");
    languageLink = language.querySelector("a");
    LanguageSelector.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    LanguageSelector.off(body);
  });

  it("shows the language dropdown when the language button is clicked", () => {
    const languageMenu = body.querySelector("#language-options");

    languageButton.click();
    assert.strictEqual(languageMenu.getAttribute("hidden"), null);
  });

  it("hides the visible language menu when the body is clicked", () => {
    const languageMenu = body.querySelector("#language-options");

    languageButton.click();
    assert.strictEqual(languageMenu.getAttribute("hidden"), null);
    body.click();
    assert.strictEqual(languageMenu.hasAttribute("hidden"), true);
  });

  it("collapses dropdown when a language link is clicked", () => {
    languageButton.click();
    languageLink.click();
    assert.strictEqual(languageButton.getAttribute("aria-expanded"), "false");
  });

  it("collapses dropdown when the Escape key is hit", () => {
    languageButton.click();
    EVENTS.escape(languageButton);
    assert.strictEqual(languageButton.getAttribute("aria-expanded"), "false");
  });

  it("collapses dropdown via the FocusTrap Escape callback", () => {
    languageButton.click();
    // Activate the FocusTrap so its keydown/Escape binding is attached and
    // fires when Escape is dispatched from within the submenu.
    LanguageSelector.focusTrap.update(true);

    // jsdom swallows errors thrown inside event listeners; use `window.onerror`
    // to surface them so a broken Escape callback fails this test.
    let listenerError = null;
    const prevOnError = window.onerror;
    window.onerror = (_msg, _src, _line, _col, err) => {
      listenerError = err;
      return true;
    };

    try {
      EVENTS.escape(languageLink);
    } finally {
      window.onerror = prevOnError;
      LanguageSelector.focusTrap.update(false);
    }

    assert.strictEqual(
      listenerError,
      null,
      `FocusTrap Escape callback threw an error: ${listenerError}`,
    );
    assert.strictEqual(languageButton.getAttribute("aria-expanded"), "false");
  });

  it("contains a role of button", () => {
    assert.strictEqual(languageButton.getAttribute("role"), "button");
  });

  it("contains aria-controls of language-options", () => {
    assert.strictEqual(
      languageButton.getAttribute("aria-controls"),
      "language-options",
    );
  });

  it("contains an id of language-options", () => {
    assert.strictEqual(languageList.getAttribute("id"), "language-options");
  });
});
