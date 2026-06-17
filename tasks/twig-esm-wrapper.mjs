// ESM wrapper for twig.js CJS package.
// Rollup's @rollup/plugin-commonjs cannot detect named exports from twig/src/twig.js
// because they are constructed dynamically. This wrapper provides explicit named exports.
//
// Only used in production builds (Rollup). In dev mode, Vite's optimizeDeps
// pre-bundles twig and the resolveId hook does NOT redirect to this file.

// Use namespace import from the bare specifier — Rollup resolves this to twig's
// package.json "main" field and the CJS plugin processes it.
import * as TwigModule from "twig";

// CJS interop: module.exports becomes the namespace object or its .default property
const Twig = TwigModule.default || TwigModule;
export const twig = typeof Twig.twig === "function" ? Twig.twig : Twig;
export const cache = Twig.cache;
export default Twig;
