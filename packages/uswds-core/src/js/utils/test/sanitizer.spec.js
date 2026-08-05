const assert = require("assert");
const Sanitizer = require("../sanitizer");

describe("sanitizer", () => {
  describe("escapeHTML", () => {
    it("returns the plain string when there are no interpolated values", () => {
      const result = Sanitizer.escapeHTML`hello world`;
      assert.strictEqual(result, "hello world");
    });

    it("leaves the static template parts untouched", () => {
      const value = "safe";
      const result = Sanitizer.escapeHTML`<span>${value}</span>`;
      assert.strictEqual(result, "<span>safe</span>");
    });

    it("escapes &, <, >, \", ', and / in interpolated values", () => {
      const value = `& < > " ' /`;
      const result = Sanitizer.escapeHTML`${value}`;
      assert.strictEqual(result, "&amp; &lt; &gt; &quot; &apos; &#x2F;");
    });

    it("should escape all apostrophes in an interpolated value", () => {
      const result = Sanitizer.escapeHTML`${"foo''bar"}`;
      assert.strictEqual(result, "foo&apos;&apos;bar");
    });

    it("escapes a script-injection attempt", () => {
      const value = '<script>alert("xss")</script>';
      const result = Sanitizer.escapeHTML`${value}`;
      assert.strictEqual(
        result,
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;",
      );
    });

    it("handles multiple interpolated values in one tagged template", () => {
      const first = "<b>";
      const second = "</b>";
      const result = Sanitizer.escapeHTML`${first}bold${second}`;
      assert.strictEqual(result, "&lt;b&gt;bold&lt;&#x2F;b&gt;");
    });

    it("coerces non-string interpolated values via String()", () => {
      const result = Sanitizer.escapeHTML`count: ${42}`;
      assert.strictEqual(result, "count: 42");
    });

    it("preserves 0 as a string '0'", () => {
      const result = Sanitizer.escapeHTML`count: ${0}`;
      assert.strictEqual(result, "count: 0");
    });

    it("preserves false as a string 'false'", () => {
      const result = Sanitizer.escapeHTML`value: ${false}`;
      assert.strictEqual(result, "value: false");
    });

    it("coerces NaN to 'NaN'", () => {
      const result = Sanitizer.escapeHTML`value: ${NaN}`;
      assert.strictEqual(result, "value: NaN");
    });

    it("treats null interpolated values as an empty string", () => {
      const result = Sanitizer.escapeHTML`value: ${null}`;
      assert.strictEqual(result, "value: ");
    });

    it("treats undefined interpolated values as an empty string", () => {
      const result = Sanitizer.escapeHTML`value: ${undefined}`;
      assert.strictEqual(result, "value: ");
    });
  });
});
