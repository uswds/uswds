"use strict";
const fs = require("fs");
const assert = require("assert");
const select = require("../../../src/js/utils/select");

const TEMPLATE = fs.readFileSync(__dirname + "/select.template.html");

const assertArrayWithLength = (array, length) => {
  assert(Array.isArray(array), "not an array: " + typeof array);
  assert.equal(array.length, length);
};

describe("select", function() {
  before(function() {
    document.body.innerHTML = TEMPLATE;
  });

  after(function() {
    document.body.innerHTML = "";
  });

  it("returns an empty array if given a non-string selector", function() {
    assertArrayWithLength(select(undefined), 0);
  });

  it("returns an Array of selected DOM elements", function() {
    assertArrayWithLength(select("#id1"), 1);
    assertArrayWithLength(select(".firstclass"), 2);
  });

  it("returns an Array of selected DOM elements in a particular context", function() {
    assertArrayWithLength(select(".secondclass", select(".firstclass")), 1);
  });
});
