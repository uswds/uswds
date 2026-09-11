const assert = require("assert");
const sinon = require("sinon");
const FocusTrap = require("../focus-trap");

const keydownTab = (el = document.body) => {
  el.dispatchEvent(
    new KeyboardEvent("keydown", { bubbles: true, key: "Tab", keyCode: 9 }),
  );
};

const keydownShiftTab = (el = document.body) => {
  el.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true,
      key: "Tab",
      keyCode: 9,
      shiftKey: true,
    }),
  );
};

describe("focus trap", () => {
  let container;
  let firstButton;
  let lastButton;
  let outsideButton;
  let trap;

  beforeEach(() => {
    document.body.innerHTML = `
      <button type="button" id="outside">Outside</button>
      <div id="trap">
        <button type="button" id="first">First</button>
        <button type="button" id="last">Last</button>
      </div>
    `;

    container = document.getElementById("trap");
    firstButton = document.getElementById("first");
    lastButton = document.getElementById("last");
    outsideButton = document.getElementById("outside");
  });

  afterEach(() => {
    if (trap) {
      trap.update(false);
    }

    document.body.innerHTML = "";
    trap = null;
  });

  describe("autoFocus", () => {
    it("defaults to true and focuses the first tab stop when activated", () => {
      outsideButton.focus();
      assert.strictEqual(document.activeElement, outsideButton);

      trap = FocusTrap(container);
      trap.update(true);

      assert.strictEqual(document.activeElement, firstButton);
    });

    it("does not auto-focus when autoFocus is false", () => {
      outsideButton.focus();
      assert.strictEqual(document.activeElement, outsideButton);

      trap = FocusTrap(container, { autoFocus: false });
      trap.update(true);

      assert.strictEqual(document.activeElement, outsideButton);
    });

    it("still binds Escape when autoFocus is false", () => {
      const onEscape = sinon.stub();

      trap = FocusTrap(container, { autoFocus: false, Escape: onEscape });
      trap.update(true);

      document.body.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Escape" }),
      );

      assert(onEscape.calledOnce);
    });
  });

  describe("tab cycling", () => {
    beforeEach(() => {
      trap = FocusTrap(container);
      trap.update(true);
    });

    it("wraps Tab from the last tab stop to the first", () => {
      lastButton.focus();
      keydownTab();

      assert.strictEqual(document.activeElement, firstButton);
    });

    it("wraps Shift+Tab from the first tab stop to the last", () => {
      firstButton.focus();
      keydownShiftTab();

      assert.strictEqual(document.activeElement, lastButton);
    });
  });

  describe("hidden inputs", () => {
    // Hidden inputs are not focusable, so the focus trap must not treat them
    // as tab stops. Otherwise a leading hidden input becomes the first tab
    // stop, and tabbing forward from the last element has nowhere to go —
    // focus stays stuck on the last element. See #6056.
    beforeEach(() => {
      document.body.innerHTML = `
        <div id="trap">
          <input type="hidden" id="hidden" />
          <button type="button" id="first">First</button>
          <button type="button" id="last">Last</button>
        </div>
      `;
      container = document.getElementById("trap");
      firstButton = document.getElementById("first");
      lastButton = document.getElementById("last");

      trap = FocusTrap(container);
      trap.update(true);
    });

    it("does not treat a leading hidden input as the first tab stop", () => {
      assert.strictEqual(document.activeElement, firstButton);
    });

    it("wraps Tab from the last tab stop past the hidden input to the first", () => {
      lastButton.focus();
      keydownTab();

      assert.strictEqual(document.activeElement, firstButton);
    });
  });
});
