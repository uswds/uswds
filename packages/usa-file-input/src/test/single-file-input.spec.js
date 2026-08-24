const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-single.template.html`,
);
const FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";

const mockMatchMedia = (matches) => {
  const listeners = [];
  const mediaQueryList = {
    matches,
    media: FINE_POINTER_MEDIA_QUERY,
    addEventListener(type, listener) {
      if (type === "change") {
        listeners.push(listener);
      }
    },
    removeEventListener(type, listener) {
      if (type === "change") {
        listeners.splice(listeners.indexOf(listener), 1);
      }
    },
  };

  return {
    mediaQueryList,
    matchMedia: () => mediaQueryList,
    setMatches(nextMatches) {
      mediaQueryList.matches = nextMatches;
      listeners.forEach((listener) =>
        listener({ matches: nextMatches, media: FINE_POINTER_MEDIA_QUERY }),
      );
    },
    listenerCount() {
      return listeners.length;
    },
  };
};

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "file input",
    selector: () => document.querySelector(".usa-file-input"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input: single file input", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dragText;
      let inputEl;

      beforeEach(() => {
        window.matchMedia = mockMatchMedia(true).matchMedia;
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it('uses singular "file" if there is not a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag file here or");
      });

      it("uses the desktop drag instruction as its default aria label", () => {
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Drag file here or choose from folder",
        );
      });
    });

    describe("file input: mobile-safe instructions", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dragText;
      let chooseText;
      let inputEl;

      beforeEach(() => {
        window.matchMedia = mockMatchMedia(false).matchMedia;
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
        chooseText = body.querySelector(".usa-file-input__choose");
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it("removes the drag instruction", () => {
        assert.strictEqual(dragText, null);
      });

      it("uses a mobile-safe choose instruction", () => {
        assert.strictEqual(chooseText.innerHTML, "Choose from folder");
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          chooseText.innerHTML,
        );
      });
    });

    describe("file input: unsupported media queries", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dragText;
      let chooseText;
      let inputEl;

      beforeEach(() => {
        window.matchMedia = undefined;
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dragText = body.querySelector(".usa-file-input__drag-text");
        chooseText = body.querySelector(".usa-file-input__choose");
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it("defaults to the mobile-safe instruction", () => {
        assert.strictEqual(dragText, null);
        assert.strictEqual(chooseText.innerHTML, "Choose from folder");
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Choose from folder",
        );
      });
    });

    describe("file input: pointer changes", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let matchMediaMock;
      let inputEl;

      beforeEach(() => {
        matchMediaMock = mockMatchMedia(false);
        window.matchMedia = matchMediaMock.matchMedia;
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        inputEl = body.querySelector(".usa-file-input__input");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it("updates instructions when a fine pointer is attached", () => {
        assert.strictEqual(
          body.querySelector(".usa-file-input__drag-text"),
          null,
        );

        matchMediaMock.setMatches(true);

        assert.strictEqual(
          body.querySelector(".usa-file-input__drag-text").innerHTML,
          "Drag file here or",
        );
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Drag file here or choose from folder",
        );
      });

      it("updates instructions when a fine pointer is detached", () => {
        matchMediaMock.setMatches(true);
        matchMediaMock.setMatches(false);

        assert.strictEqual(
          body.querySelector(".usa-file-input__drag-text"),
          null,
        );
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Choose from folder",
        );
      });

      it("removes the media query change listener on teardown", () => {
        assert.strictEqual(matchMediaMock.listenerCount(), 1);

        fileInput.off(containerSelector());

        assert.strictEqual(matchMediaMock.listenerCount(), 0);
      });
    });
  });
});
