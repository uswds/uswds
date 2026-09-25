const { register } = require("node:module");
const { pathToFileURL } = require("node:url");

// `module.register()` arrived in Node 20.6. The published engine range stays
// wider because only this test setup needs it.
if (typeof register !== "function") {
  throw new Error(
    `Unit tests require Node 20.6 or newer (found ${process.version}). Use the version in .nvmrc.`,
  );
}

register(pathToFileURL(require.resolve("./web-component-hooks.mjs")));

// jsdom-global does not expose `customElements`. Lit needs it to define an
// element, and without it Lit's Node build would install its own SSR shim
// registry, so elements created through jsdom would never upgrade.
global.customElements = window.customElements;
