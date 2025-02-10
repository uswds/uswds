const assert = require("assert");
const fs = require("fs");
const jsdomUtils = require("jsdom/lib/jsdom/living/generated/utils");
const jsdomFileList = require("jsdom/lib/jsdom/living/generated/FileList");
const fileInput = require("../index");

const TEMPLATE = fs.readFileSync(`${__dirname}/template.html`);

// allows us to create mock files
function MockFile() {}
/**
 *
 * @param {String} name
 * @param {Number} size
 * @param {String} mimeType
 * @returns {Object} Blob "file" w/ size, type, name, and lastModified
 */
MockFile.prototype.create = (name, size, mimeType) => {
  function range(count) {
    let output = "";
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < count; i++) {
      // eslint-disable-line no-plusplus
      output += "a";
    }
    return output;
  }

  const blob = new Blob([range(size)], { type: mimeType });
  blob.lastModified = new Date();
  blob.name = name;

  return blob;
};

/**
 * Leverages JSdom library to instantiate a FileList
 * @param  {...any} files
 * @returns {Object} of FileList Type
 */
function makeFileList(...files) {
  const impl = jsdomFileList.createImpl(window);
  const ret = Object.assign([...files], {
    item: (ix) => ret[ix],
    [jsdomUtils.implSymbol]: impl,
  });
  impl[jsdomUtils.wrapperSymbol] = ret;
  Object.setPrototypeOf(ret, FileList.prototype);
  return ret;
}

const tests = [
  { name: "document.body", selector: () => document.body },
  {
    name: "file input",
    selector: () => document.querySelector(".usa-file-input"),
  },
];

tests.forEach(({ name, selector: containerSelector }) => {
  describe(`File input initialized at ${name}`, () => {
    describe("file input component should respond to file type on change", () => {
      const { body } = document;
      const INVALID_FILE_CLASS = "has-invalid-file";
      const size = 1024 * 1024 * 2;
      const mock = new MockFile();
      const file = mock.create("pic.jpg", size, "image/jpeg");
      const fileList = makeFileList(file);
      const defaultErrorMessage = "Error: This is not a valid file type.";
      const customErrorMessage = "Please upload a valid file";

      let dropZone;
      let instructions;
      let inputEl;
      let dragText;
      let box;
      let visibleErrorMessage;
      let ariaLabel;

      const addFiles = () => {
        inputEl.files = fileList;
        const e = new Event("change");
        inputEl.dispatchEvent(e);
      };

      beforeEach(() => {
        body.innerHTML = TEMPLATE;
        fileInput.on(containerSelector());
        dropZone = body.querySelector(".usa-file-input__target");
        instructions = body.querySelector(".usa-file-input__instructions");
        inputEl = document.getElementById("file-input-specific");
        box = body.querySelector(".usa-file-input__box");
        dragText = body.querySelector(".usa-file-input__drag-text");
      });

      afterEach(() => {
        fileInput.off(containerSelector());
        body.innerHTML = "";
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

      it("mock file should be defined with specific values", () => {
        assert(file);
        assert.strictEqual(file.name, "pic.jpg");
        assert.strictEqual(file.size, size);
        assert.strictEqual(file.type, "image/jpeg");
      });

      it("mock file should not be allowed", () => {
        // add to our elements FileList
        addFiles();
        assert.strictEqual(
          dropZone.classList.contains(INVALID_FILE_CLASS),
          true,
        );
      });

      it("should provide a default error message for invalid file type", () => {
        // add to our elements FileList
        addFiles();

        // Error message appended to DOM after change event.
        visibleErrorMessage = body.querySelector(
          ".usa-file-input__accepted-files-message",
        );
        ariaLabel = inputEl.getAttribute("aria-label");

        assert.strictEqual(
          visibleErrorMessage.textContent,
          defaultErrorMessage,
        );
        assert.strictEqual(ariaLabel.startsWith(defaultErrorMessage), true);
      });

      it("should allow a custom error message for invalid file type", () => {
        inputEl.dataset.errormessage = customErrorMessage;
        addFiles();

        // Error message appended to DOM after change event.
        visibleErrorMessage = body.querySelector(
          ".usa-file-input__accepted-files-message",
        );
        ariaLabel = inputEl.getAttribute("aria-label");

        assert.strictEqual(visibleErrorMessage.textContent, customErrorMessage);
        assert.strictEqual(ariaLabel.startsWith(customErrorMessage), true);
      });
    });
  });
});
