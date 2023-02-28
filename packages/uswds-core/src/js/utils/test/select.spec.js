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
});
