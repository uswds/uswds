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
    const regex = generateDynamicRegExp("something$", " else");
    assert.ok(regex.test("something else"));
    assert.equal(regex.test("something"), false);
  });

  it("allows for string replacement with filter", () => {
    const regex = generateDynamicRegExp("something$([LS]+)", " Else");
    assert.ok(regex.test("somethingLS"));
    assert.equal(regex.test("something"), false);
    assert.equal(regex.test("something Else"), false);
  });

  describe("time picker regex", () => {
    const filter = "0?$([1-9][0-9]?(:[0-9]{0,2})?).*$([ap])m?";
    const test = (inputQuery, testValue) => {
      const regex = generateDynamicRegExp(filter, inputQuery);
      return regex.test(testValue);
    };
    let i = 0;
    const ok = (inputQuery, testValue) =>
      assert.equal(
        test(inputQuery, testValue),
        true,
        `${inputQuery} should find ${testValue}`
      );
    const notOk = (inputQuery, testValue) =>
      assert.equal(
        test(inputQuery, testValue),
        false,
        `${inputQuery} should not find ${testValue}`
      );

    it("should match a starts with selection", () => {
      ok("04", "04:00pm");
      notOk("04", "05:00pm");
    });

    it("should match a starts with selection with colon", () => {
      ok("04:", "04:00pm");
      notOk("04:", "05:00pm");
    });

    it("should match a starts with selection with full time", () => {
      ok("04:00", "04:00pm");
      notOk("04:00", "05:00pm");
    });

    it("should match a complete selection", () => {
      ok("04:00pm", "04:00pm");
      notOk("04:00pm", "05:00pm");
    });

    it("should match a starts with selection without leading zero", () => {
      ok("4", "04:00pm");
      notOk("4", "05:00pm");
    });

    it("should match a starts with selection without leading zero with pm", () => {
      ok("4pm", "04:00pm");
      notOk("4pm", "05:00pm");
      notOk("4pm", "04:00am");
    });

    it("should match a starts with selection with leading zero with pm", () => {
      ok("04pm", "04:00pm");
      notOk("04pm", "05:00pm");
      notOk("04pm", "04:00am");
    });

    it("should match a starts with selection without leading zero with p", () => {
      ok("4p", "04:00pm");
      notOk("4p", "05:00pm");
      notOk("4p", "04:00am");
    });

    it("should match a starts with selection with leading zero with p", () => {
      ok("04p", "04:00pm");
      notOk("04p", "05:00pm");
      notOk("04p", "04:00am");
    });

    it("should match a starts with selection with pm", () => {
      ok("10pm", "10:00pm");
      notOk("10pm", "01:00pm");
      notOk("10pm", "11:00pm");
      notOk("10pm", "10:00am");
    });
  });
});
