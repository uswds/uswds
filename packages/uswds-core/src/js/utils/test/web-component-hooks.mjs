// Module customization hooks that let Mocha import Lit `.component.js`
// modules. Registered by register-web-components.js.
//
// Vite resolves `?inline` stylesheets to strings and image assets to URLs at
// build time. Node cannot load either, so supply stand-in modules instead.

const VITE_INLINE = /\?inline$/;
const VITE_ASSET = /\.(png|jpe?g|gif|svg|webp)$/;
// Components are ESM `.js` files in a package with no `"type"` field. Name the
// format so Node does not need syntax detection (unflagged only in 20.19/22.7).
const COMPONENT = /\.component\.js$/;

function stubModule(value) {
  const source = `export default ${JSON.stringify(value)};`;
  return `data:text/javascript,${encodeURIComponent(source)}`;
}

export async function resolve(specifier, context, nextResolve) {
  if (VITE_INLINE.test(specifier)) {
    return { url: stubModule(""), format: "module", shortCircuit: true };
  }

  if (VITE_ASSET.test(specifier)) {
    return {
      url: stubModule(specifier.split("/").pop()),
      format: "module",
      shortCircuit: true,
    };
  }

  const resolved = await nextResolve(specifier, context);
  if (COMPONENT.test(resolved.url)) {
    return { ...resolved, format: "module" };
  }

  return resolved;
}
