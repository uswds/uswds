import assert from "node:assert";
import UsaBanner from "../usa-banner.component.js";

const CONTROLS = "aria-controls";
const EXPANDED = "aria-expanded";
const EXPANDED_CLASS = "usa-banner__header--expanded";
const HIDDEN = "hidden";

const { body } = document;

// Attributes and light DOM must be in place before the element upgrades.
async function render(markup = "<usa-banner></usa-banner>") {
  body.innerHTML = markup;
  const element = body.querySelector("usa-banner");
  await element.updateComplete;
  return { element, shadow: element.shadowRoot };
}

function guidanceHeadings(shadow) {
  return Array.from(
    shadow.querySelectorAll(
      'slot[name="domain-heading"], slot[name="https-heading"]',
    ),
  )
    .map((node) => node.textContent.replace(/\s+/g, " ").trim())
    .join(" | ");
}

// Resolve an IDREF the way assistive technology does: within the control's own
// tree, so an id in a shadow root is only visible to controls in that root.
function controlledBy(control) {
  return control.getRootNode().getElementById(control.getAttribute(CONTROLS));
}

function assertExpandedMatchesContent(shadow) {
  assert.strictEqual(
    shadow.querySelector(".usa-banner__button").getAttribute(EXPANDED) ===
      "true",
    !shadow.querySelector(".usa-banner__content").hasAttribute(HIDDEN),
  );
}

describe("usa-banner web component", () => {
  afterEach(() => {
    body.innerHTML = "";
  });

  it("is registered as a custom element", async () => {
    const { element } = await render();

    assert.strictEqual(customElements.get("usa-banner"), UsaBanner);
    assert.ok(element instanceof UsaBanner);
    assert.ok(element.shadowRoot);
  });

  describe("toggle", () => {
    it("renders collapsed", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        shadow
          .querySelector(".usa-banner__header")
          .classList.contains(EXPANDED_CLASS),
        false,
      );
      assert.strictEqual(
        shadow.querySelector(".usa-banner__button").getAttribute(EXPANDED),
        "false",
      );
      assert.ok(
        shadow.querySelector(".usa-banner__content").hasAttribute(HIDDEN),
      );
    });

    it("expands when the button is clicked", async () => {
      const { element, shadow } = await render();
      const button = shadow.querySelector(".usa-banner__button");

      button.click();
      await element.updateComplete;

      assert.strictEqual(
        shadow
          .querySelector(".usa-banner__header")
          .classList.contains(EXPANDED_CLASS),
        true,
      );
      assert.strictEqual(button.getAttribute(EXPANDED), "true");
      assert.strictEqual(
        shadow.querySelector(".usa-banner__content").hasAttribute(HIDDEN),
        false,
      );
    });

    it("collapses when the button is clicked again", async () => {
      const { element, shadow } = await render();
      const button = shadow.querySelector(".usa-banner__button");

      button.click();
      await element.updateComplete;
      button.click();
      await element.updateComplete;

      assert.strictEqual(
        shadow
          .querySelector(".usa-banner__header")
          .classList.contains(EXPANDED_CLASS),
        false,
      );
      assert.strictEqual(button.getAttribute(EXPANDED), "false");
      assert.ok(
        shadow.querySelector(".usa-banner__content").hasAttribute(HIDDEN),
      );
    });
  });

  describe("lang", () => {
    it("renders English by default", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        shadow.querySelector(".usa-banner__header-text").textContent.trim(),
        "An official website of the United States government",
      );
      assert.strictEqual(
        shadow.querySelector(".usa-banner__button-text").textContent.trim(),
        "Here's how you know",
      );
    });

    it("renders Spanish for lang='es'", async () => {
      const { shadow } = await render('<usa-banner lang="es"></usa-banner>');

      assert.strictEqual(
        shadow.querySelector(".usa-banner__header-text").textContent.trim(),
        "Un sitio oficial del Gobierno de Estados Unidos",
      );
      assert.strictEqual(
        shadow.querySelector(".usa-banner__button-text").textContent.trim(),
        "Así es como usted puede verificarlo",
      );
    });

    it("falls back to English for an unsupported lang", async () => {
      const { shadow } = await render('<usa-banner lang="zy"></usa-banner>');

      assert.strictEqual(
        shadow.querySelector(".usa-banner__header-text").textContent.trim(),
        "An official website of the United States government",
      );
    });

    it("reflects lang to the host attribute", async () => {
      const { element } = await render();

      element.lang = "es";
      await element.updateComplete;

      assert.strictEqual(element.getAttribute("lang"), "es");
    });
  });

  describe("tld", () => {
    it("renders .gov guidance by default", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        guidanceHeadings(shadow),
        "Official websites use .gov | Secure .gov websites use HTTPS",
      );
    });

    it("renders .mil guidance for tld='mil'", async () => {
      const { shadow } = await render('<usa-banner tld="mil"></usa-banner>');

      assert.strictEqual(
        guidanceHeadings(shadow),
        "Official websites use .mil | Secure .mil websites use HTTPS",
      );
    });

    it("falls back to .gov for an unsupported tld", async () => {
      const { shadow } = await render('<usa-banner tld="zzz"></usa-banner>');

      assert.strictEqual(
        guidanceHeadings(shadow),
        "Official websites use .gov | Secure .gov websites use HTTPS",
      );
    });

    it("reflects tld to the host attribute", async () => {
      const { element } = await render();

      element.tld = "mil";
      await element.updateComplete;

      assert.strictEqual(element.getAttribute("tld"), "mil");
    });
  });

  describe("author overrides", () => {
    it("names the landmark from the language strings by default", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        shadow.querySelector("section").getAttribute("aria-label"),
        "Official website of the United States government",
      );
    });

    it("uses the label attribute as the landmark name", async () => {
      const { shadow } = await render(
        '<usa-banner label="Custom label"></usa-banner>',
      );

      assert.strictEqual(
        shadow.querySelector("section").getAttribute("aria-label"),
        "Custom label",
      );
    });

    it("uses banner-action slot content as the button text", async () => {
      const { shadow } = await render(
        '<usa-banner><span slot="banner-action">Slotted action</span></usa-banner>',
      );

      assert.strictEqual(
        shadow.querySelector(".usa-banner__button-text").textContent.trim(),
        "Slotted action",
      );
    });
  });

  describe("accessibility", () => {
    it("hides decorative images from assistive technology", async () => {
      const { shadow } = await render();
      const images = Array.from(shadow.querySelectorAll("img"));

      assert.strictEqual(images.length, 3);
      images.forEach((image) => {
        assert.strictEqual(image.getAttribute("alt"), "");
        assert.strictEqual(image.getAttribute("aria-hidden"), "true");
      });
    });

    it("names the lock icon", async () => {
      const { shadow } = await render();
      const lock = shadow.querySelector(".usa-banner__icon-lock");

      assert.strictEqual(lock.getAttribute("role"), "img");
      assert.strictEqual(
        lock.getAttribute("aria-label"),
        "Locked padlock icon",
      );
    });

    it("renders the toggle as a non-submitting button", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        shadow.querySelector(".usa-banner__button").getAttribute("type"),
        "button",
      );
    });

    it("points aria-controls at the content in the same shadow root", async () => {
      const { shadow } = await render();

      assert.strictEqual(
        controlledBy(shadow.querySelector(".usa-banner__button")),
        shadow.querySelector(".usa-banner__content"),
      );
    });

    it("keeps each banner's aria-controls scoped to its own content", async () => {
      body.innerHTML = "<usa-banner></usa-banner><usa-banner></usa-banner>";
      const [first, second] = Array.from(body.querySelectorAll("usa-banner"));
      await Promise.all([first.updateComplete, second.updateComplete]);

      first.shadowRoot.querySelector(".usa-banner__button").click();
      await first.updateComplete;

      [first, second].forEach((element) => {
        const shadow = element.shadowRoot;
        assert.strictEqual(
          controlledBy(shadow.querySelector(".usa-banner__button")),
          shadow.querySelector(".usa-banner__content"),
        );
      });
      assertExpandedMatchesContent(first.shadowRoot);
      assertExpandedMatchesContent(second.shadowRoot);
      assert.strictEqual(
        second.shadowRoot
          .querySelector(".usa-banner__button")
          .getAttribute(EXPANDED),
        "false",
      );
    });

    it("shows the content when isOpen is set as a property", async () => {
      const { element, shadow } = await render();

      element.isOpen = true;
      await element.updateComplete;

      assert.strictEqual(
        shadow.querySelector(".usa-banner__button").getAttribute(EXPANDED),
        "true",
      );
      assertExpandedMatchesContent(shadow);
    });

    it("shows the content when rendered with the isopen attribute", async () => {
      const { shadow } = await render("<usa-banner isopen></usa-banner>");

      assert.strictEqual(
        shadow.querySelector(".usa-banner__button").getAttribute(EXPANDED),
        "true",
      );
      assertExpandedMatchesContent(shadow);
    });
  });
});
