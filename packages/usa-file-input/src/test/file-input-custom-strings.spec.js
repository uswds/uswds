const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-custom-strings.template.html`,
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
    describe("file input: custom instruction strings", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dragText;
      let chooseText;
      let inputEl;

      beforeEach(() => {
        window.matchMedia = mockMatchMedia(true).matchMedia;
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

      it("uses the custom drag text when data-text-drag is set", () => {
        assert.strictEqual(dragText.textContent, "Arrastre el archivo aquí o");
      });

      it("uses the custom choose text when data-text-choose is set", () => {
        assert.strictEqual(chooseText.textContent, "elija de la carpeta");
      });

      it("applies the custom strings to the aria-label", () => {
        assert.strictEqual(
          inputEl.getAttribute("aria-label"),
          "Arrastre el archivo aquí o elija de la carpeta",
        );
      });

      it("uses the custom no-file status text", () => {
        const statusMessage = body.querySelector(".usa-sr-only");
        assert.strictEqual(
          statusMessage.textContent,
          "No se ha seleccionado ningún archivo.",
        );
      });
    });
  });
});
