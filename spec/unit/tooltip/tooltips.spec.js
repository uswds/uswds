const assert = require("assert");
const tooltip = require("../../../src/js/components/tooltip");
const fs = require("fs");
const path = require("path");

const TEMPLATE = fs.readFileSync(path.join(__dirname, "/template.html"));

describe("tooltips", () => {
 const { body } = document;
 let tooltipBody;
 let tooltipTrigger

 beforeEach(() => {
   body.innerHTML = TEMPLATE;
   tooltip.on();
   tooltipBody = body.querySelector(".usa-tooltip__body");
   tooltipTrigger = body.querySelector(".usa-tooltip__trigger")
   tooltip.on(body);
 });

 afterEach(() => {
   body.textContent = '';
 });

 it('trigger is created', () => {
   assert.equal(tooltipTrigger.getAttribute("class"), "usa-button usa-tooltip__trigger");
 });

 it('title attribute on trigger is cleared', () => {
   assert.equal(tooltipTrigger.getAttribute("title"), "");
 });

 it('tooltip body is created', () => {
   assert.equal(tooltipBody.innerHTML, "This is a tooltip");
 });

 it('tooltip is visible on focus', () => {
   tooltipTrigger.focus();
   assert.equal(tooltipBody.classList.contains("is-set"), true);
 });

 it('tooltip is hidden on blur', () => {
   tooltipTrigger.blur();
   assert.equal(tooltipBody.classList.contains("is-set"), false);
 });
})
