/**
 * Unit tests for the USWDS CJS→ESM Vite plugin.
 *
 * These lock in the mechanical transforms (require/module.exports/exports.*),
 * the skip rules (non-packages files, stories, already-ESM), and — importantly —
 * guard against a ReDoS regression in the destructure-require handling.
 *
 * Run with: npm run test:tasks
 */

import assert from "node:assert";
import path from "node:path";
import { fileURLToPath } from "node:url";
import uswdsCjsPlugin from "./vite-plugin-uswds-cjs.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(currentDir, "../packages");

// A representative source file id inside packages/ that passes the plugin's
// path filter.
const SAMPLE_ID = path.join(packagesDir, "usa-x", "src", "index.js");

/**
 * Invoke the plugin's `transform` hook with a minimal Rollup/Vite plugin
 * context. Returns the transformed code (or null when the plugin skips).
 * @param {string} code
 * @param {string} [id]
 * @returns {{ code: string, warnings: string[] } | null}
 */
function transform(code, id = SAMPLE_ID) {
  const warnings = [];
  const ctx = { warn: (msg) => warnings.push(String(msg)) };
  const plugin = uswdsCjsPlugin({ packagesDir });
  const result = plugin.transform.call(ctx, code, id);
  if (result === null) return null;
  return { code: result.code, warnings };
}

describe("vite-plugin-uswds-cjs", () => {
  describe("require() imports", () => {
    it("converts a default require to a default import", () => {
      const out = transform(
        `const foo = require("./foo");\nmodule.exports = foo;`,
      );
      assert.match(out.code, /import foo from "\.\/foo";/);
    });

    it("converts a single-line destructure require", () => {
      const out = transform(
        `const { CLICK } = require("../events");\nmodule.exports = 1;`,
      );
      assert.match(out.code, /import _mod0 from "\.\.\/events";/);
      assert.match(out.code, /const \{ CLICK \} = _mod0;/);
    });

    it("preserves rename syntax in a destructure require", () => {
      const out = transform(
        `const { prefix: PREFIX } = require("../config");\nmodule.exports = 1;`,
      );
      assert.match(out.code, /const \{ prefix: PREFIX \} = _mod0;/);
    });

    it("converts a multi-line destructure require and collapses to one line", () => {
      const out = transform(
        `const {\n  a,\n  b,\n  c\n} = require("./mod");\nmodule.exports = 1;`,
      );
      assert.match(out.code, /import _mod0 from "\.\/mod";/);
      assert.match(out.code, /const \{ a, b, c \} = _mod0;/);
    });

    it("handles multiple destructure requires with unique module vars", () => {
      const out = transform(
        `const { x } = require("./x");\nconst { y } = require("./y");\nmodule.exports = 1;`,
      );
      assert.match(out.code, /import _mod0 from "\.\/x";/);
      assert.match(out.code, /import _mod1 from "\.\/y";/);
    });

    it("does not treat an object-literal assignment as a destructure require", () => {
      const out = transform(`const obj = { a: 1 };\nmodule.exports = obj;`);
      // The `{ a: 1 }` object literal must be left intact.
      assert.match(out.code, /const obj = \{ a: 1 \};/);
      assert.doesNotMatch(out.code, /import _mod/);
    });
  });

  describe("exports", () => {
    it("converts module.exports = x to export default", () => {
      const out = transform(`module.exports = foo;`);
      assert.match(out.code, /export default foo;/);
    });

    it("converts exports.name = value to a named export", () => {
      const out = transform(`exports.myThing = myThing;`);
      assert.match(out.code, /export \{ myThing \};/);
    });

    it("aliases exports.name = otherValue", () => {
      const out = transform(`exports.publicName = internalName;`);
      assert.match(out.code, /export \{ internalName as publicName \};/);
    });
  });

  describe("skip rules", () => {
    it("skips files outside the packages directory", () => {
      const out = transform(
        `module.exports = 1;`,
        path.resolve(currentDir, "somewhere-else/index.js"),
      );
      assert.strictEqual(out, null);
    });

    it("skips .stories. files", () => {
      const out = transform(
        `module.exports = 1;`,
        path.join(packagesDir, "usa-x", "src", "usa-x.stories.js"),
      );
      assert.strictEqual(out, null);
    });

    it("skips files with no CJS patterns", () => {
      const out = transform(`export const foo = 1;`);
      assert.strictEqual(out, null);
    });

    it("skips non-.js files", () => {
      const out = transform(
        `module.exports = 1;`,
        path.join(packagesDir, "usa-x", "src", "index.twig"),
      );
      assert.strictEqual(out, null);
    });
  });

  describe("ReDoS regression", () => {
    // The destructure-require handling previously used a nested-quantifier
    // regex (`(?:\n[^}\n]*)*`) that static analysis flagged as a ReDoS risk.
    // It has been replaced with an index scan. This test feeds the pathological
    // input from the original CodeQL alert ("const {{\n" + many "\n") and a long
    // unterminated brace, asserting the transform completes well under a
    // generous time budget — catastrophic backtracking would time out.
    it("completes quickly on the CodeQL pathological input", () => {
      const evil = `const {{\n${"\n".repeat(50000)}`;
      const start = process.hrtime.bigint();
      transform(evil);
      const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
      assert.ok(
        elapsedMs < 1000,
        `transform took ${elapsedMs.toFixed(1)}ms — possible ReDoS regression`,
      );
    });

    it("completes quickly on a long unterminated destructure", () => {
      const evil = `const {\n${"a,\n".repeat(50000)}`;
      const start = process.hrtime.bigint();
      transform(evil);
      const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
      assert.ok(
        elapsedMs < 1000,
        `transform took ${elapsedMs.toFixed(1)}ms — possible ReDoS regression`,
      );
    });
  });
});
