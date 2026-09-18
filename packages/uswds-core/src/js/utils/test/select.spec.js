const fs = require("fs");
const assert = require("assert");
const select = require("../select");

const TEMPLATE = fs.readFileSync(`${__dirname}/select.template.html`);

const assertArrayWithLength = (array, length) => {
  assert(Array.isArray(array), `not an array: ${typeof array}`);
  assert.strictEqual(array.length, length);
};

describe("select", () => {
  before(() => {
    document.body.innerHTML = TEMPLATE;
  });

  after(() => {
    document.body.innerHTML = "";
  });

  it("returns an empty array if given a non-string selector", () => {
    assertArrayWithLength(select(undefined), 0);
  });

  it("returns an Array of selected DOM elements", () => {
    assertArrayWithLength(select("#id1"), 1);
    assertArrayWithLength(select(".firstclass"), 2);
  });

  it("returns an Array of selected DOM elements in a particular context", () => {
    assertArrayWithLength(select(".secondclass", select(".firstclass")), 1);
  });

  it("limits selection to the supplied element", () => {
    const context = document.createElement("div");
    context.innerHTML = '<span class="firstclass"></span>';
    assert.deepStrictEqual(select(".firstclass", context), [
      context.firstChild,
    ]);
  });

  it("queries a supplied document instead of the global document", () => {
    const context = document.implementation.createHTMLDocument();
    context.body.innerHTML = '<span class="firstclass"></span>';
    assert.deepStrictEqual(select(".firstclass", context), [
      context.body.firstChild,
    ]);
  });

  it("queries a document fragment", () => {
    const context = document.createDocumentFragment();
    const child = document.createElement("span");
    child.className = "firstclass";
    context.appendChild(child);
    assert.deepStrictEqual(select(".firstclass", context), [child]);
  });

  it("queries a shadow root without selecting matching light DOM nodes", () => {
    const host = document.createElement("div");
    const context = host.attachShadow({ mode: "open" });
    context.innerHTML = '<span class="firstclass"></span>';
    assert.deepStrictEqual(select(".firstclass", context), [
      context.firstChild,
    ]);
  });

  it("continues to use the document for unsupported contexts", () => {
    [null, {}, [], document.createTextNode("text")].forEach((context) => {
      assert.deepStrictEqual(select(".firstclass", context), [
        ...document.querySelectorAll(".firstclass"),
      ]);
    });
  });
});
