const assert = require("assert");
const sinon = require("sinon");
const FocusTrap = require("../focus-trap");
const datePicker = require("../../../../../usa-date-picker/src/index");
const comboBox = require("../../../../../usa-combo-box/src/index");

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

  [
    ["hidden controls", "<button hidden>Hidden</button>"],
    ["hidden ancestors", "<div hidden><button>Hidden</button></div>"],
    ["inert ancestors", "<div inert><button>Inert</button></div>"],
    ["invisible controls", '<button style="visibility:hidden">Hidden</button>'],
    [
      "collapsed controls",
      '<button style="visibility:collapse">Collapsed</button>',
    ],
    ["negative tab stops", '<button tabindex="-1">Programmatic</button>'],
    ["hidden inputs with tabindex", '<input type="hidden" tabindex="0">'],
    [
      "disabled controls with tabindex",
      '<button disabled tabindex="0">Disabled</button>',
    ],
    [
      "CSS-hidden ancestors",
      '<div style="display:none"><button>Hidden</button></div>',
    ],
  ].forEach(([name, markup]) => {
    describe(name, () => {
      beforeEach(() => {
        container.insertAdjacentHTML("afterbegin", markup);
        container.insertAdjacentHTML("beforeend", markup);
        trap = FocusTrap(container);
        trap.update(true);
      });

      it("initially focuses a usable control", () => {
        assert.strictEqual(document.activeElement, firstButton);
      });

      it("wraps forward to a usable control", () => {
        lastButton.focus();
        keydownTab();
        assert.strictEqual(document.activeElement, firstButton);
      });

      it("wraps backward to a usable control", () => {
        firstButton.focus();
        keydownShiftTab();
        assert.strictEqual(document.activeElement, lastButton);
      });
    });
  });

  [
    '<button hidden style="display:block">Revealed</button>',
    '<div hidden style="display:block"><button>Revealed</button></div>',
  ].forEach((markup) => {
    it(`includes a CSS-revealed hidden element: ${markup}`, () => {
      container.insertAdjacentHTML("afterbegin", markup);
      container.insertAdjacentHTML("beforeend", markup);
      const buttons = container.querySelectorAll("button");
      const firstRevealed = buttons[0];
      const lastRevealed = buttons[buttons.length - 1];
      trap = FocusTrap(container);
      trap.update(true);
      assert.strictEqual(document.activeElement, firstRevealed);

      lastRevealed.focus();
      keydownTab();
      assert.strictEqual(document.activeElement, firstRevealed);
      keydownShiftTab();
      assert.strictEqual(document.activeElement, lastRevealed);
    });
  });

  describe("dynamic controls", () => {
    beforeEach(() => {
      trap = FocusTrap(container);
      trap.update(true);
    });

    it("includes a control added after activation in both directions", () => {
      const added = document.createElement("button");
      container.appendChild(added);

      added.focus();
      keydownTab();
      assert.strictEqual(document.activeElement, firstButton);

      keydownShiftTab();
      assert.strictEqual(document.activeElement, added);
    });

    it("stops targeting a removed control", () => {
      lastButton.remove();
      firstButton.focus();
      keydownShiftTab();
      assert.strictEqual(document.activeElement, firstButton);
      keydownTab();
      assert.strictEqual(document.activeElement, firstButton);
    });

    it("stops targeting a control hidden after activation", () => {
      lastButton.hidden = true;
      firstButton.focus();
      keydownShiftTab();
      assert.strictEqual(document.activeElement, firstButton);
      keydownTab();
      assert.strictEqual(document.activeElement, firstButton);
    });
  });

  it("evaluates visibility after a previously hidden container opens", () => {
    container.hidden = true;
    trap = FocusTrap(container);
    container.hidden = false;
    trap.update(true);
    assert.strictEqual(document.activeElement, firstButton);

    lastButton.focus();
    keydownTab();
    assert.strictEqual(document.activeElement, firstButton);
  });

  it("finds controls added between construction and activation", () => {
    firstButton.remove();
    lastButton.remove();
    trap = FocusTrap(container);
    container.append(firstButton, lastButton);
    trap.update(true);
    assert.strictEqual(document.activeElement, firstButton);

    lastButton.focus();
    keydownTab();
    assert.strictEqual(document.activeElement, firstButton);
    keydownShiftTab();
    assert.strictEqual(document.activeElement, lastButton);
  });

  it("cycles past internal controls in an enhanced date picker and combo box", () => {
    container.insertAdjacentHTML(
      "afterbegin",
      `
      <label for="date">Date</label>
      <div class="usa-date-picker"><input id="date" name="date"></div>
      <label for="choice">Choice</label>
      <div class="usa-combo-box">
        <select id="choice"><option>First</option><option>Second</option></select>
      </div>
    `,
    );
    datePicker.on(container);
    comboBox.on(container);

    try {
      const dateInput = document.getElementById("date");
      trap = FocusTrap(container);
      trap.update(true);
      assert.strictEqual(document.activeElement, dateInput);

      lastButton.focus();
      keydownTab();
      assert.strictEqual(document.activeElement, dateInput);

      keydownShiftTab();
      assert.strictEqual(document.activeElement, lastButton);
    } finally {
      datePicker.off(container);
      comboBox.off(container);
    }
  });

  it("does not throw when all controls are excluded from the tab order", () => {
    firstButton.hidden = true;
    lastButton.hidden = true;
    trap = FocusTrap(container);
    trap.update(true);
    assert.strictEqual(document.activeElement, document.body);

    const onError = sinon.spy();
    window.addEventListener("error", onError);
    try {
      keydownTab();
      keydownShiftTab();
      assert.strictEqual(onError.callCount, 0);
    } finally {
      window.removeEventListener("error", onError);
    }
  });
});
