/**
 * Vite plugin that transforms USWDS component CJS JavaScript files into ESM.
 *
 * The USWDS component source files (e.g., `usa-accordion/src/index.js`) use
 * CommonJS `require()` / `module.exports`. Vite's built-in @rollup/plugin-commonjs
 * crashes on these due to circular dependencies in the uswds-core utilities.
 *
 * This plugin performs a simple mechanical transformation:
 * - `const x = require("path")` → `import x from "path"`
 * - `const { a, b } = require("path")` → `import _modN from "path"; const { a, b } = _modN;`
 * - `module.exports = x` (at column 0) → `export default x`
 * - `exports.name = value` → `export { value as name }`
 *
 * It only processes .js files under packages/ that are NOT .stories.js files.
 */

import path from "node:path";
import MagicString from "magic-string";

/**
 * @param {Object} options
 * @param {string} options.packagesDir - Absolute path to the packages/ directory
 * @returns {import('vite').Plugin}
 */
export default function uswdsCjsPlugin(options = {}) {
  const { packagesDir } = options;
  // Normalize to forward slashes for cross-platform path comparison
  const normalizedPackagesDir = packagesDir.split(path.sep).join("/");

  return {
    name: "uswds-cjs-to-esm",
    // Run before the commonjs plugin so it never sees these files
    enforce: "pre",

    transform(code, id) {
      // Normalize id for cross-platform comparison (Windows uses backslashes)
      const normalizedId = id.split(path.sep).join("/");

      // Only process .js files in the packages directory
      if (!normalizedId.endsWith(".js")) return null;
      if (!normalizedId.startsWith(normalizedPackagesDir)) return null;
      // Skip story files (already ESM)
      if (normalizedId.includes(".stories.")) return null;
      // Skip files that are already ESM (no CJS patterns)
      if (
        !code.includes("require(") &&
        !code.includes("module.exports") &&
        !code.includes("exports.")
      )
        return null;

      const s = new MagicString(code);
      let hasChanges = false;
      let modCounter = 0;

      // Transform: const x = require("path") → import x from "path"
      for (const match of code.matchAll(
        /^const\s+(\w+)\s*=\s*require\(([^)]+)\);?\s*$/gm,
      )) {
        s.overwrite(
          match.index,
          match.index + match[0].length,
          `import ${match[1]} from ${match[2]};`,
        );
        hasChanges = true;
      }

      // Transform: const { a, b } = require("path") (single or multi-line)
      // CJS destructure imports a property from module.exports, NOT a named export.
      // Convert to: import _modN from "path"; const { a, b } = _modN;
      //
      // Implemented as an index scan rather than a single regex to avoid any
      // nested-quantifier construct (e.g. `(?:\n[^}]*)*`) that a regex spanning
      // the `{ ... }` body would introduce. Such constructs are a ReDoS risk
      // (and are flagged by static analysis) even when written carefully. The
      // scan below is unambiguous and provably linear: a cheap regex finds each
      // `const {` opener, then we walk forward to the matching `}` and check for
      // an `= require(...)` suffix.
      for (const opener of code.matchAll(/(^|\n)[ \t]*const\s*\{/g)) {
        // Start of the `const` keyword (skip the captured leading newline).
        const stmtStart = opener.index + opener[1].length;
        // Position just after the opening `{`.
        const braceOpen = opener.index + opener[0].length;
        const braceClose = code.indexOf("}", braceOpen);
        if (braceClose === -1) continue;

        // A brace body containing `{`, `}` or `;` is not a flat destructure
        // pattern (e.g. nested object default, block statement) — skip it.
        const body = code.slice(braceOpen, braceClose);
        if (/[{};]/.test(body)) continue;

        // After `}` we expect: optional space, `=`, `require(...)`, optional `;`,
        // then end-of-line. Anchor with a bounded regex from braceClose.
        const rest = code.slice(braceClose + 1);
        const suffix = /^\s*=\s*require\(([^)]+)\);?[ \t]*(?:\r?\n|$)/.exec(
          rest,
        );
        if (!suffix) continue;

        const stmtEnd = braceClose + 1 + suffix[0].replace(/\r?\n$/, "").length;
        const varName = `_mod${modCounter++}`;
        const collapsed = code
          .slice(braceOpen - 1, braceClose + 1)
          .replace(/\s*\n\s*/g, " ");
        s.overwrite(
          stmtStart,
          stmtEnd,
          `import ${varName} from ${suffix[1]};\nconst ${collapsed} = ${varName};`,
        );
        hasChanges = true;
      }

      // Transform: module.exports = x → export default x
      // Only match at the start of a line (column 0)
      const moduleExportsMatch = code.match(/^module\.exports\s*=\s*/m);
      if (moduleExportsMatch && moduleExportsMatch.index !== undefined) {
        s.overwrite(
          moduleExportsMatch.index,
          moduleExportsMatch.index + moduleExportsMatch[0].length,
          "export default ",
        );
        hasChanges = true;
      }

      // Transform: exports.name = value
      // These come after module.exports transforms, so we need to work on
      // the current string state. Use string replacement (no MagicString for this).
      let finalCode = s.toString();
      const finalMap = s.generateMap({ hires: true, source: id });
      let exportsChanged = false;

      finalCode = finalCode.replace(
        /^exports\.(\w+)\s*=\s*(.+);?\s*$/gm,
        (match, name, value) => {
          exportsChanged = true;
          const cleanValue = value.replace(/;\s*$/, "").trim();
          if (name === "default") return `export default ${cleanValue};`;
          if (name === cleanValue) return `export { ${name} };`;
          return `export { ${cleanValue} as ${name} };`;
        },
      );

      if (!hasChanges && !exportsChanged) return null;

      // Warn if CJS patterns remain after transformation
      if (
        finalCode.includes("require(") ||
        finalCode.includes("module.exports")
      ) {
        const remaining = [];
        if (finalCode.includes("require(")) remaining.push("require()");
        if (finalCode.includes("module.exports"))
          remaining.push("module.exports");
        this.warn(
          `Residual CJS patterns [${remaining.join(", ")}] in ${id} — may need manual conversion`,
        );
      }

      return {
        code: finalCode,
        // Source map is approximate for exports transforms but accurate for require/module.exports
        map: hasChanges ? finalMap : null,
      };
    },
  };
}
