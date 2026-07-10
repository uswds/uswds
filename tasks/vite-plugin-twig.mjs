/**
 * Vite plugin that compiles `.twig` files into ESM render functions.
 *
 * Port of `tasks/webpack-twig-loader.js` to Vite's plugin API.
 * Each `.twig` module exports `function(context) { return html }`.
 *
 * Dependency resolution (for `{% include %}`, `{% extends %}`, `{% embed %}`,
 * `{% import %}`, `{% from %}`) uses Vite's resolver, and namespace aliases
 * (e.g. `@components`, `@templates`) are resolved via the `resolveId` hook.
 *
 * Twig runtime: the `twig` npm package is CJS-only with an internal require()
 * graph that Rollup's commonjs plugin cannot statically analyze (it produces an
 * empty module, causing "twig is not a function" at runtime). To get reliable
 * CJS→ESM interop in BOTH dev and production builds, this plugin pre-bundles
 * twig with esbuild (the same engine Vite's optimizeDeps uses in dev) and serves
 * it through a virtual module that `.twig` files import.
 */

import path from "node:path";
import { createRequire } from "node:module";
import { build } from "esbuild";

// twig.js is CJS-only; use createRequire to load it in an ESM context.
// NOTE: this Node-side instance is only used at BUILD time (compiling .twig
// source to tokens in the transform hook). It is a separate copy from the
// esbuild-bundled runtime that executes in the browser — see bundleTwigRuntime.
const require = createRequire(import.meta.url);
const Twig = require("twig");

// Virtual module ID that .twig files import the twig runtime from.
const TWIG_RUNTIME_ID = "virtual:uswds-twig-runtime";
const RESOLVED_TWIG_RUNTIME_ID = "\0" + TWIG_RUNTIME_ID;

/**
 * esbuild plugin that resolves the Node built-ins twig references (`fs`,
 * `path`, `module`) to an empty module. twig only uses these in its optional
 * filesystem template loader; Storybook renders from inline data, so the
 * loader is never exercised.
 *
 * Marking them `external` instead would leave `require("fs")` calls in the ESM
 * output, which esbuild's ESM interop turns into a `__require` shim that throws
 * `Dynamic require of "fs" is not supported` at runtime. twig catches that and
 * logs `Missing fs and path modules...` to the console on every load. Stubbing
 * the modules to `undefined` lets twig's `try/catch` succeed silently, and its
 * own `if (!fs || !path)` guard still correctly rejects filesystem loads.
 */
const stubNodeBuiltins = {
  name: "stub-node-builtins",
  setup(build) {
    const filter = /^(fs|path|module)$/;
    build.onResolve({ filter }, (args) => ({
      path: args.path,
      namespace: "stub-builtin",
    }));
    build.onLoad({ filter: /.*/, namespace: "stub-builtin" }, () => ({
      contents: "export default undefined;",
      loader: "js",
    }));
  },
};

/**
 * Pre-bundle the twig package into a single ESM module using esbuild.
 * esbuild resolves twig's internal require() graph (twig.factory → twig.core,
 * etc.) and emits a clean ESM module with a default export, which Rollup can
 * consume without the static-analysis failures of @rollup/plugin-commonjs.
 *
 * The bundled module also disables twig's internal template cache. Each .twig
 * module registers itself via `Twig.twig({ id, data })` when it executes. On
 * HMR, Vite re-executes the changed module against the same still-alive runtime
 * instance, which would re-register an already-registered id and throw
 * "There is already a template with the ID …". Disabling the cache here (in the
 * runtime that actually executes in the browser) makes re-registration a no-op.
 * @returns {Promise<string>} ESM source code for the twig runtime
 */
async function bundleTwigRuntime() {
  const twigEntry = require.resolve("twig");
  const result = await build({
    entryPoints: [twigEntry],
    bundle: true,
    format: "esm",
    platform: "browser",
    write: false,
    plugins: [stubNodeBuiltins],
    logLevel: "silent",
  });
  // Disable the browser runtime's template cache so HMR re-registration of a
  // template id does not throw. esbuild emits the twig instance as
  // `export default <expr>;`; rebind it to a name so we can call cache(false)
  // on the exact instance that .twig modules import and register into.
  const bundled = result.outputFiles[0].text;
  const EXPORT_RE = /^export default (.+);$/m;
  if (!EXPORT_RE.test(bundled)) {
    throw new Error(
      "vite-plugin-twig: could not locate esbuild's `export default` in the " +
        "bundled twig runtime; the cache-disabling patch cannot be applied.",
    );
  }
  return bundled.replace(
    EXPORT_RE,
    "const __twig = $1;\n__twig.cache(false);\nexport default __twig;",
  );
}

/**
 * @typedef {Object} TwigPluginOptions
 * @property {Record<string, string>} namespaces - Map of alias prefix to directory
 *   e.g. { '@components': '/abs/path/to/packages', '@templates': '/abs/path/to/packages/templates' }
 */

/**
 * @param {TwigPluginOptions} options
 * @returns {import('vite').Plugin}
 */
export default function twigPlugin(options = {}) {
  const { namespaces = {} } = options;
  let root = process.cwd();
  // Cache the bundling *promise* (not the resolved value) so concurrent load()
  // calls dedupe onto a single esbuild run instead of racing to bundle twice.
  let twigRuntimePromise = null;

  return {
    name: "uswds-twig",
    enforce: "pre",

    configResolved(config) {
      root = config.root;
    },

    /**
     * Resolve `@components/...` and `@templates/...` paths for .twig imports.
     * Also resolves the virtual twig runtime module.
     */
    resolveId(source, importer) {
      // Virtual twig runtime module (esbuild-bundled ESM twig)
      if (source === TWIG_RUNTIME_ID) {
        return RESOLVED_TWIG_RUNTIME_ID;
      }

      if (!source.endsWith(".twig")) return null;

      // Namespace aliases: @components/foo → /abs/packages/foo
      for (const [prefix, dir] of Object.entries(namespaces)) {
        if (source.startsWith(prefix + "/")) {
          const resolved = path.resolve(dir, source.slice(prefix.length + 1));
          return resolved;
        }
      }

      // Relative paths: resolved by Vite's default resolver (return null)
      return null;
    },

    /**
     * Serve the esbuild-bundled twig runtime for the virtual module.
     * Bundling is lazy + cached so it runs at most once per Vite process.
     */
    async load(id) {
      if (id === RESOLVED_TWIG_RUNTIME_ID) {
        if (twigRuntimePromise === null) {
          twigRuntimePromise = bundleTwigRuntime();
        }
        return twigRuntimePromise;
      }
      return null;
    },

    /**
     * Transform .twig source into an ESM module that:
     * 1. Imports all dependency templates (registering them in twig.js runtime)
     * 2. Exports a render function: (context) => htmlString
     */
    async transform(source, id) {
      if (!id.endsWith(".twig")) return null;

      let template;
      try {
        template = Twig.twig({
          allowInlineIncludes: true,
          data: source,
          id: makeTemplateId(root, id),
          path: id,
          rethrow: true,
        });
      } catch (err) {
        this.error(`Twig compilation error in ${id}: ${err.message}`);
        return null;
      }

      // Walk tokens to find dependencies and rewrite their IDs.
      const dependencies = [];
      await walkTokens(this, id, template.tokens, dependencies, root);

      const templateId = makeTemplateId(root, id);
      const twigData = {
        allowInlineIncludes: true,
        data: template.tokens,
        id: templateId,
        rethrow: true,
      };

      // Generate ESM output.
      const imports = [...new Set(dependencies)]
        .sort()
        .map((dep) => `import ${JSON.stringify(dep)};`)
        .join("\n");

      const code = [
        imports,
        // Import the esbuild-bundled twig runtime (default export = twig's
        // module.exports / the Twig instance). This virtual module gives the
        // same reliable CJS→ESM interop in dev and production builds, avoiding
        // Rollup's inability to statically analyze twig's internal require graph.
        `import Twig from ${JSON.stringify(TWIG_RUNTIME_ID)};`,
        `var tpl = Twig.twig(${JSON.stringify(twigData)});`,
        `export default function(context) { return tpl.render(context); };`,
      ].join("\n");

      return { code, map: null };
    },

    /**
     * HMR: when a .twig file changes, invalidate it and all importers
     * up the dependency chain (since parent templates need to re-render).
     */
    handleHotUpdate({ file, server }) {
      if (!file.endsWith(".twig")) return;

      const mod = server.moduleGraph.getModuleById(file);
      if (!mod) return;

      const invalidated = new Set();
      const invalidate = (m) => {
        if (invalidated.has(m)) return;
        invalidated.add(m);
        server.moduleGraph.invalidateModule(m);
        for (const importer of m.importers) {
          invalidate(importer);
        }
      };
      invalidate(mod);
    },
  };
}

// ---------------------------------------------------------------------------
// Token walking — mirrors webpack-twig-loader.js logic
// ---------------------------------------------------------------------------

async function walkTokens(pluginCtx, importerId, tokens, dependencies, root) {
  await each(tokens, (token) =>
    processToken(pluginCtx, importerId, token, dependencies, root),
  );
}

async function processToken(pluginCtx, importerId, token, dependencies, root) {
  if (token.type !== "logic" || !token.token.type) {
    return;
  }

  switch (token.token.type) {
    case "Twig.logic.type.block":
    case "Twig.logic.type.if":
    case "Twig.logic.type.elseif":
    case "Twig.logic.type.else":
    case "Twig.logic.type.for":
    case "Twig.logic.type.spaceless":
    case "Twig.logic.type.macro":
    case "Twig.logic.type.apply":
    case "Twig.logic.type.setcapture": {
      await each(token.token.output, (t) =>
        processToken(pluginCtx, importerId, t, dependencies, root),
      );
      break;
    }

    case "Twig.logic.type.extends":
    case "Twig.logic.type.include": {
      await each(token.token.stack, (t) =>
        processDependency(pluginCtx, importerId, t, dependencies, root),
      );
      break;
    }

    case "Twig.logic.type.embed": {
      // Embeds have both nested output (block overrides) and a stack (the
      // template being embedded).
      await each(token.token.output, (t) =>
        processToken(pluginCtx, importerId, t, dependencies, root),
      );
      await each(token.token.stack, (t) =>
        processDependency(pluginCtx, importerId, t, dependencies, root),
      );
      break;
    }

    case "Twig.logic.type.import":
    case "Twig.logic.type.from": {
      // `_self` means "macros from this same file"; no external dependency.
      if (token.token.expression !== "_self") {
        await each(token.token.stack, (t) =>
          processDependency(pluginCtx, importerId, t, dependencies, root),
        );
      }
      break;
    }

    default:
      break;
  }
}

async function processDependency(
  pluginCtx,
  importerId,
  token,
  dependencies,
  root,
) {
  const originalPath = token.value;

  // Resolve the dependency path using Vite's resolver (respects our resolveId hook).
  const resolved = await pluginCtx.resolve(originalPath, importerId);
  if (!resolved) {
    pluginCtx.warn(
      `Could not resolve twig dependency "${originalPath}" from "${importerId}"`,
    );
    return;
  }

  const absolutePath = resolved.id;

  // Add to the import list (using the original path so Vite traces it
  // through resolveId again at bundle time).
  dependencies.push(originalPath);

  // Rewrite the token value to the root-relative ID that the dependency
  // module will register itself as. This ensures Twig's runtime lookup
  // (by template ID) finds the right template.
  token.value = makeTemplateId(root, absolutePath);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTemplateId(rootDir, absolutePath) {
  return path.relative(rootDir, absolutePath).split(path.sep).join("/");
}

async function each(arr, callback) {
  if (!Array.isArray(arr)) return;
  await Promise.all(arr.map(callback));
}
