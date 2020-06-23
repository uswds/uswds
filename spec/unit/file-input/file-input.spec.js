const assert = require("assert");
const fileInput = require("../../../src/js/components/file-input");
const fs = require("fs");
const path = require("path");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("file input", () => {
 const { body } = document;

 let dropZone;
 let instructions;
 let parentEl;

 beforeEach(() => {
   body.innerHTML = TEMPLATE;
   fileInput.on();
   dropZone = body.querySelector(".usa-file-input__target");
   instructions = body.querySelector(".usa-file-input__instructions");
   parentEl = body.querySelector("div.usa-file-input");
   fileInput.on(body);
 });

 afterEach(() => {
   body.innerHTML = "";
   fileInput.off(body);
 });

 it('file input is created', () => {
   assert.equal(instructions.getAttribute("class"), "usa-file-input__instructions");
 });

})
