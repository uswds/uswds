const assert = require("assert");
const {
  generateDynamicRegExp
} = require("../../../src/js/components/combo-box");

describe("generateDynamicRegExp function", () => {
  it("allows for static string", () => {
    const regex = generateDynamicRegExp("something", "");
    assert.ok(regex.test("something"));
    assert.equal(regex.test("something else"), false);
  });

  it("allows for string replacement", () => {
    const regex = generateDynamicRegExp("something{{ query }}", " else");
    assert.ok(regex.test("something else"));
    assert.equal(regex.test("something"), false);
  });

  it("allows for string replacement with filter", () => {
    const regex = generateDynamicRegExp("something{{ filter }}", " Else", {
      filter: "([LS]+)"
    });
    assert.ok(regex.test("somethingLS"));
    assert.equal(regex.test("something"), false);
    assert.equal(regex.test("something Else"), false);
  });

  it("allows for escaped string", () => {
    const regex = generateDynamicRegExp("something\\{\\{else\\}\\}", " else");
    assert.ok(regex.test("something{{else}}"));
    assert.equal(regex.test("something else"), false);
  });

  it("escapes regular expression inputs", () => {
    const regex = generateDynamicRegExp("something {{query}}", ".* else");
    assert.ok(regex.test("something .* else"));
    assert.equal(regex.test("something ?? else"), false);
  });
});
