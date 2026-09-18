const assert = require("assert");
const fs = require("fs");
const Accordion = require("../index");

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);

// `aria` prefixed attributes
const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";
const MULTISELECTABLE = "data-allow-multiple";

const accordionSelector = () => document.querySelector(".usa-accordion");
const tests = [
  { name: "document.body", selector: () => document.body },
  { name: "accordion", selector: accordionSelector },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`Accordion behavior when initialized at ${name}`, () => {
    const { body } = document;

    let root;
    let button;
    let buttons;
    let content;

    beforeEach(() => {
      body.innerHTML = TEMPLATE;
      Accordion.on(containerSelector());

      root = accordionSelector();
      buttons = root.querySelectorAll(".usa-accordion__button");

      button = buttons[0];

      content = document.getElementById(button.getAttribute(CONTROLS));
    });

    afterEach(() => {
      Accordion.off(containerSelector());
      body.innerHTML = "";
    });

    describe("DOM state", () => {
      it('has an "aria-expanded" attribute', () => {
        assert(button.getAttribute(EXPANDED));
      });

      it('has an "aria-controls" attribute', () => {
        assert(button.getAttribute(CONTROLS));
      });

      describe("accordion.show()", () => {
        beforeEach(() => {
          Accordion.hide(button);
          Accordion.show(button);
        });

        it('toggles button aria-expanded="true"', () => {
          assert.strictEqual(button.getAttribute(EXPANDED), "true");
        });

        it('toggles content "hidden" off', () => {
          assert(content.getAttribute(HIDDEN) !== true);
        });
      });

      describe("accordion.hide()", () => {
        beforeEach(() => {
          Accordion.show(button);
          Accordion.hide(button);
        });

        it('toggles button aria-expanded="false"', () => {
          assert.strictEqual(button.getAttribute(EXPANDED), "false");
        });

        it('toggles content "hidden" on', () => {
          assert(content.hasAttribute(HIDDEN));
        });
      });
    });

    describe("interaction", () => {
      it("shows the second item when clicked", () => {
        const second = buttons[1];
        const target = document.getElementById(second.getAttribute(CONTROLS));
        second.click();
        // first button and section should be collapsed
        assert.strictEqual(button.getAttribute(EXPANDED), "false");
        assert(content.hasAttribute(HIDDEN));
        // second should be expanded
        assert.strictEqual(second.getAttribute(EXPANDED), "true");
        assert(target.getAttribute(HIDDEN) !== true);
      });

      it("keeps multiple sections open with data-allow-multiple", () => {
        root.setAttribute(MULTISELECTABLE, "");

        const second = buttons[1];
        second.click();
        button.click();

        assert.strictEqual(button.getAttribute(EXPANDED), "true");
        assert(content.getAttribute(HIDDEN) !== true);
        // second should be expanded
        assert.strictEqual(second.getAttribute(EXPANDED), "true");
        assert(content.getAttribute(HIDDEN) !== true);
      });
    });
  });
});

describe("Accordion behavior in a shadow root", () => {
  let shadowRoot;
  let buttons;
  let panels;

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE;
    const host = document.createElement("div");
    document.body.appendChild(host);
    shadowRoot = host.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = TEMPLATE;
    buttons = shadowRoot.querySelectorAll(".usa-accordion__button");
    panels = shadowRoot.querySelectorAll(".usa-accordion__content");
    buttons[0].setAttribute(EXPANDED, "true");
    buttons[1].setAttribute(EXPANDED, "false");
    Accordion.on(shadowRoot);
  });

  afterEach(() => {
    Accordion.off(shadowRoot);
    document.body.innerHTML = "";
  });

  it("initializes panels to their authored expanded state", () => {
    assert.strictEqual(panels[0].hidden, false);
    assert.strictEqual(panels[1].hidden, true);
  });

  it("does not initialize matching accordions outside the shadow root", () => {
    document.querySelectorAll(".usa-accordion__button").forEach((button) => {
      assert.strictEqual(button.hasAttribute(EXPANDED), false);
    });
  });

  it("toggles panels within the shadow root when clicked", () => {
    buttons[1].click();
    assert.strictEqual(panels[0].hidden, true);
    assert.strictEqual(panels[1].hidden, false);
    assert.strictEqual(buttons[0].getAttribute(EXPANDED), "false");
    assert.strictEqual(buttons[1].getAttribute(EXPANDED), "true");
    assert.strictEqual(document.getElementById(panels[0].id).hidden, false);
  });
});
