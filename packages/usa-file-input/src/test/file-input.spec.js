const assert = require("assert");
const fs = require("fs");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(
  `${__dirname}/file-input-multiple.template.html`,
);
const FINE_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)";
const matchFinePointer = () => ({
  matches: true,
  media: FINE_POINTER_MEDIA_QUERY,
  addEventListener() {},
  removeEventListener() {},
});

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "file input",
    selector: () => document.querySelector(".usa-file-input"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input component builds successfully", () => {
      const { body } = document;
      const originalMatchMedia = window.matchMedia;

      let dropZone;
      let instructions;
      let inputEl;
      let dragText;
      let box;
      let statusMessage;

      beforeEach(() => {
        window.matchMedia = matchFinePointer;
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dropZone = body.querySelector(".usa-file-input__target");
        instructions = body.querySelector(".usa-file-input__instructions");
        inputEl = body.querySelector(".usa-file-input__input");
        box = body.querySelector(".usa-file-input__box");
        dragText = body.querySelector(".usa-file-input__drag-text");
        statusMessage = body.querySelector(".usa-sr-only");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
        window.matchMedia = originalMatchMedia;
      });

      it("instructions are created", () => {
        assert.strictEqual(
          instructions.getAttribute("class"),
          "usa-file-input__instructions",
        );
      });

      it("target ui is created", () => {
        assert.strictEqual(
          dropZone.getAttribute("class"),
          "usa-file-input__target",
        );
      });

      it("input gets new class", () => {
        assert.strictEqual(
          inputEl.getAttribute("class"),
          "usa-file-input__input",
        );
      });

      it("box is created", () => {
        assert.strictEqual(box.getAttribute("class"), "usa-file-input__box");
      });

      it('pluralizes "files" if there is a "multiple" attribute', () => {
        assert.strictEqual(dragText.innerHTML, "Drag files here or");
      });

      it("creates a status message element", () => {
        assert.strictEqual(statusMessage.getAttribute("class"), "usa-sr-only");
      });

      it("adds a default status message", () => {
        assert.strictEqual(statusMessage.innerHTML, "No files selected.");
      });
    });
  });
});

describe("Returning to a multiple-file input", () => {
  let input;
  let selection;
  const description = () =>
    (input.getAttribute("aria-describedby") || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((id) => document.getElementById(id).textContent);

  beforeEach(() => {
    document.body.innerHTML = `<form><span id="hint">Choose documents</span>
      <span id="error">Check the dates</span>
      <input class="usa-file-input" type="file" multiple aria-describedby="hint error">
      <button type="button">Continue</button></form>`;
    input = document.querySelector("input");
    selection = [];
    Object.defineProperty(input, "files", { get: () => selection });
    fileInput.on(document.body);
  });

  afterEach(() => {
    fileInput.off(document.body);
    document.body.innerHTML = "";
  });

  const revisit = (...names) => {
    document.querySelector("button").focus();
    selection = names.map((name) => new window.File([], name));
    input.focus();
  };

  it("describes the current filenames alongside the hint and error", () => {
    revisit("june.txt", "july.txt");
    assert.deepStrictEqual(description(), [
      "Choose documents",
      "Check the dates",
      "june.txt, july.txt",
    ]);
    revisit("july.txt", "Q3 & <notes>.txt");
    assert.deepStrictEqual(description(), [
      "Choose documents",
      "Check the dates",
      "july.txt, Q3 & <notes>.txt",
    ]);
    revisit("july.txt");
    assert.deepStrictEqual(description(), [
      "Choose documents",
      "Check the dates",
    ]);
    revisit();
    assert.deepStrictEqual(description(), [
      "Choose documents",
      "Check the dates",
    ]);
  });

  it("keeps descriptions added by the application when the component is removed", () => {
    revisit("june.txt", "july.txt");
    const ids = input.getAttribute("aria-describedby");
    const addedId = ids.split(" ").at(-1);
    assert.strictEqual(
      document.getElementById(addedId).textContent,
      "june.txt, july.txt",
    );
    input.setAttribute("aria-describedby", `${ids} extra`);
    fileInput.off(document.body);
    assert.strictEqual(
      input.getAttribute("aria-describedby"),
      "hint error extra",
    );
    assert.strictEqual(document.getElementById(addedId), null);
    revisit("one.txt", "two.txt");
    assert.strictEqual(
      input.getAttribute("aria-describedby"),
      "hint error extra",
    );
  });
});
