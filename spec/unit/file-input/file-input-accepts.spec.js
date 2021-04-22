const assert = require("assert");
const fileInput = require("../../../src/js/components/file-input");
const fs = require("fs");
const path = require("path");

const RENDER = "../../../build/components/render/";
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, RENDER, "file-input--multiple.html")
);

describe("file input component builds successfully", () => {
  const { body } = document;

  let dropZone;
  let instructions;
  let inputEl;
  let dragText;
  let box;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    fileInput.on();
    dropZone = body.querySelector(".usa-file-input__target");
    instructions = body.querySelector(".usa-file-input__instructions");
    inputEl = body.querySelector(".usa-file-input__input");
    box = body.querySelector(".usa-file-input__box");
    dragText = body.querySelector(".usa-file-input__drag-text");
    fileInput.on(body);
  });

  afterEach(() => {
    body.innerHTML = "";
    fileInput.off(body);
  });

  it("instructions are created", () => {
    assert.strictEqual(
      instructions.getAttribute("class"),
      "usa-file-input__instructions"
    );
  });

  it("target ui is created", () => {
    assert.strictEqual(
      dropZone.getAttribute("class"),
      "usa-file-input__target"
    );
  });

  it("input gets new class", () => {
    assert.strictEqual(inputEl.getAttribute("class"), "usa-file-input__input");
  });

  it("box is created", () => {
    assert.strictEqual(box.getAttribute("class"), "usa-file-input__box");
  });

  it('pluralizes "files" if there is a "multiple" attribute', () => {
    assert.strictEqual(dragText.innerHTML, "Drag files here or ");
  });
});

// mock file
function MockFile() {}

MockFile.prototype.create = (name, size, mimeType) => {
  name = name || 'mock.txt'; // eslint-disable-line no-param-reassign
  size = size || 1024; // eslint-disable-line no-param-reassign
  mimeType = mimeType || 'plain/txt'; // eslint-disable-line no-param-reassign

  function range(count) {
    let output = '';
    for (let i = 0; i < count; i++) { // eslint-disable-line no-plusplus
      output += 'a';
    }
    return output;
  }

  const blob = new Blob([range(size)], { type: mimeType });
  blob.lastModifiedDate = new Date();
  blob.name = name;

  return blob;
};

// mock file test harness
describe('Mock file for file upload testing', () => {
  it("should be defined", () => {
    const file = new MockFile();
    assert(file);
  });

  it("should have default values", () => {
    const mock = new MockFile();
    const file = mock.create();
    assert.strictEqual(file.name, "mock.txt");
    assert.strictEqual(file.size, 1024);
  });

  it("should have specific values", () => {
    const size = 1024 * 1024 * 2;
    const mock = new MockFile();
    const file = mock.create("pic.jpg", size, "image/jpeg");
    assert.strictEqual(file.name, "pic.jpg");
    assert.strictEqual(file.size, size);
    assert.strictEqual(file.type, "image/jpeg");
  });

  // preventInvalidFiles(e, fileInputEl, instructions, dropTarget);
  /**
   * When using an Accept attribute, invalid files will be hidden from
   * file browser, but they can still be dragged to the input. This
   * function prevents them from being dragged and removes error states
   * when correct files are added.
   * @param {event} file
   * @param {HTMLElement} fileInputEl - file input element
   * @param {HTMLElement} instructions - text to inform users to drag or select files
   * @param {HTMLElement} dropTarget - target area div that encases the input
   */
  const preventInvalidFiles = (upload) => {
    let TYPE_IS_VALID = true;
    const acceptedFilesAttr = '.pdf,.txt,.jpg'; // TODO: get accepted attr from template

    // Runs if only specific files are accepted
    if (acceptedFilesAttr) {
      const acceptedFiles = acceptedFilesAttr.split(',');

      // If multiple files are dragged, this iterates through them
      // and look for any files that are not accepted.
      let allFilesAllowed = true;
      const scannedFiles = [upload];
      for (let i = 0; i < scannedFiles.length; i += 1) {
        const file = scannedFiles[i];
        if (allFilesAllowed) {
          for (let j = 0; j < acceptedFiles.length; j += 1) {
            const fileType = acceptedFiles[j];
            allFilesAllowed =
              file.name.indexOf(fileType) > 0 ||
              file.type.includes(fileType.replace(/\*/g, ''));
            if (allFilesAllowed) {
              TYPE_IS_VALID = true;
              break;
            }
          }
        } else break;
      }

      // If dragged files are not accepted, this removes them from
      // the value of the input and creates and error state
      if (!allFilesAllowed) {
        TYPE_IS_VALID = false;
      }
      // return TYPE_IS_VALID;
    }
    return TYPE_IS_VALID;
  };

  it("should be allowed", () => {
    const size = 1024 * 1024 * 2;
    const mock = new MockFile();
    const file = mock.create("pic.jpg", size, "image/jpeg");
    assert.strictEqual(file.name, "pic.jpg");
    assert.strictEqual(file.size, size);
    assert.strictEqual(file.type, "image/jpeg");
    assert(preventInvalidFiles(file));
  });
});
