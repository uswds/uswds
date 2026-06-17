/**
 * Vite plugin that compiles `.twig` files into ESM render functions.
 *
 * Port of `tasks/webpack-twig-loader.js` to Vite's plugin API.
 * Each `.twig` module exports `function(context) { return html }`.
 *
 * Dependency resolution (for `{% include %}`, `{% extends %}`, `{% embed %}`,
 * `{% import %}`, `{% from %}`) uses Vite's resolver, and namespace aliases
 * (e.g. `@components`, `@templates`) are resolved via the `resolveId` hook.
 */

import path from "node:path";
import { createRequire } from "node:module";

// twig.js is CJS-only; use createRequire to load it in an ESM context.
const require = createRequire(import.meta.url);
const Twig = require("twig");

// Disable Twig's internal template cache. Vite handles caching at the
// module level; leaving Twig's cache on causes "There is already a template
// with the ID" errors during HMR.
Twig.cache(false);

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
  let isBuild = false;

  return {
    name: "uswds-twig",
    enforce: "pre",

    configResolved(config) {
      root = config.root;
      isBuild = config.command === "build";
    },

    /**
     * Resolve `@components/...` and `@templates/...` paths for .twig imports.
     * Also redirects `"twig"` imports to our ESM wrapper for production builds.
     */
    resolveId(source, importer) {
      // Redirect "twig" imports from .twig files to our ESM wrapper — but
      // ONLY in production builds. In dev mode, Vite's optimizeDeps pre-bundles
      // twig correctly and the wrapper is unnecessary (and broken in dev context).
      if (
        isBuild &&
        source === "twig" &&
        importer &&
        importer.endsWith(".twig")
      ) {
        return path.resolve(root, "tasks/twig-esm-wrapper.mjs");
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
        // Import twig factory directly as a named import from the CJS package.
        // Rollup's CJS plugin can detect `twig` as a named export from the
        // module.exports object. We skip cache() — not needed at build time
        // since each module is only evaluated once.
        `import { twig } from "twig";`,
        `var tpl = twig(${JSON.stringify(twigData)});`,
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

async function processDependency(pluginCtx, importerId, token, dependencies, root) {
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
