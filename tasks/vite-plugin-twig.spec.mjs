/**
 * Unit tests for the USWDS Twig Vite plugin.
 *
 * Focused coverage of the plugin's core hooks:
 *  - resolveId: virtual runtime id, namespace aliases, pass-through
 *  - transform: .twig → ESM render function, dependency imports for {% include %}
 *  - load: the esbuild-bundled twig runtime (and that it carries no throwing
 *    `require("fs")` shim)
 *
 * Run with: npm run test:tasks
 */

import assert from "node:assert";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import twigPlugin from "./vite-plugin-twig.mjs";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const packagesDir = path.resolve(currentDir, "../packages");
const templatesDir = path.resolve(packagesDir, "templates");
const root = path.resolve(currentDir, "..");

const TWIG_RUNTIME_ID = "virtual:uswds-twig-runtime";
const RESOLVED_TWIG_RUNTIME_ID = `\0${TWIG_RUNTIME_ID}`;

function makePlugin() {
  const plugin = twigPlugin({
    namespaces: { "@components": packagesDir, "@templates": templatesDir },
  });
  // Seed `root` the way Vite would via configResolved.
  plugin.configResolved({ root });
  return plugin;
}

/**
 * Minimal Rollup/Vite plugin context. `resolve` mimics the plugin's own
 * resolveId aliasing so transform's dependency walk can resolve @components/…
 */
function makeContext(plugin) {
  return {
    warnings: [],
    errors: [],
    warn(msg) {
      this.warnings.push(String(msg));
    },
    error(msg) {
      this.errors.push(String(msg));
      throw new Error(String(msg));
    },
    async resolve(source) {
      const resolved = plugin.resolveId.call(this, source, undefined);
      if (resolved) return { id: resolved };
      // Fall back to a plausible absolute id for relative twig deps.
      return { id: path.resolve(packagesDir, source.replace(/^\.\//, "")) };
    },
  };
}

describe("vite-plugin-twig", () => {
  describe("resolveId", () => {
    it("resolves the virtual twig runtime id", () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      assert.strictEqual(
        plugin.resolveId.call(ctx, TWIG_RUNTIME_ID, undefined),
        RESOLVED_TWIG_RUNTIME_ID,
      );
    });

    it("resolves @components namespace aliases for .twig imports", () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const resolved = plugin.resolveId.call(
        ctx,
        "@components/usa-button/src/usa-button.twig",
        undefined,
      );
      assert.strictEqual(
        resolved,
        path.resolve(packagesDir, "usa-button/src/usa-button.twig"),
      );
    });

    it("resolves @templates namespace aliases", () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const resolved = plugin.resolveId.call(
        ctx,
        "@templates/some.twig",
        undefined,
      );
      assert.strictEqual(resolved, path.resolve(templatesDir, "some.twig"));
    });

    it("passes through relative .twig imports (returns null)", () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      assert.strictEqual(
        plugin.resolveId.call(ctx, "./sibling.twig", undefined),
        null,
      );
    });

    it("ignores non-.twig, non-runtime sources", () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      assert.strictEqual(
        plugin.resolveId.call(ctx, "./styles.css", undefined),
        null,
      );
    });
  });

  describe("transform", () => {
    it("returns null for non-.twig ids", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const result = await plugin.transform.call(ctx, "irrelevant", "/x/y.js");
      assert.strictEqual(result, null);
    });

    it("compiles a plain .twig into an ESM render function", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const id = path.join(packagesDir, "usa-x/src/plain.twig");
      const result = await plugin.transform.call(
        ctx,
        "<p>Hello {{ name }}</p>",
        id,
      );
      assert.ok(result && typeof result.code === "string");
      // Imports the virtual twig runtime.
      assert.match(
        result.code,
        /import Twig from "virtual:uswds-twig-runtime";/,
      );
      // Exports a render function.
      assert.match(result.code, /export default function\(context\)/);
      assert.match(result.code, /tpl\.render\(context\)/);
    });

    it("emits a dependency import for {% include %}", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const id = path.join(packagesDir, "usa-x/src/parent.twig");
      const source =
        '{% include "@components/usa-button/src/usa-button.twig" %}';
      const result = await plugin.transform.call(ctx, source, id);
      assert.ok(result && typeof result.code === "string");
      assert.match(
        result.code,
        /import "@components\/usa-button\/src\/usa-button\.twig";/,
      );
    });
  });

  describe("load", () => {
    it("returns bundled twig runtime code for the virtual id", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const code = await plugin.load.call(ctx, RESOLVED_TWIG_RUNTIME_ID);
      assert.ok(typeof code === "string" && code.length > 0);
    });

    it("bundles a runtime free of the throwing require(fs) shim", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const code = await plugin.load.call(ctx, RESOLVED_TWIG_RUNTIME_ID);
      assert.doesNotMatch(code, /Dynamic require of/);
      assert.doesNotMatch(code, /__require\("(fs|path|module)"\)/);
    });

    it("returns null for unrelated ids", async () => {
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      assert.strictEqual(await plugin.load.call(ctx, "/some/other.js"), null);
    });

    it("disables the browser runtime template cache (HMR guard)", async () => {
      // Regression: without cache(false) on the bundled runtime, re-executing
      // a .twig module during HMR re-registers its template id and throws
      // "There is already a template with the ID …". The patch must land on
      // the exact instance exported by the runtime.
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const code = await plugin.load.call(ctx, RESOLVED_TWIG_RUNTIME_ID);
      assert.match(code, /\.cache\(false\)/);
    });

    it("re-registering a template id does not throw (HMR simulation)", async () => {
      // Import the actual bundled runtime and prove the fix end-to-end:
      // registering the same id twice (as HMR does) must be a no-op, not throw.
      const plugin = makePlugin();
      const ctx = makeContext(plugin);
      const code = await plugin.load.call(ctx, RESOLVED_TWIG_RUNTIME_ID);

      const dir = await mkdtemp(path.join(tmpdir(), "uswds-twig-rt-"));
      const file = path.join(dir, "runtime.mjs");
      try {
        await writeFile(file, code);
        const { default: Twig } = await import(pathToFileURL(file).href);
        Twig.twig({ id: "hmr/dup.twig", data: "<p>first</p>" });
        assert.doesNotThrow(() => {
          Twig.twig({ id: "hmr/dup.twig", data: "<p>second</p>" });
        }, "re-registering an existing template id must not throw with cache disabled");
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    });
  });
});
