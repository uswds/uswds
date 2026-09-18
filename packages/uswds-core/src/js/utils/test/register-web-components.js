const { register } = require("node:module");
const { pathToFileURL } = require("node:url");

register(pathToFileURL(require.resolve("./web-component-hooks.mjs")));

// jsdom-global does not expose `customElements`. Lit needs it to define an
// element, and without it Lit's Node build would install its own SSR shim
// registry, so elements created through jsdom would never upgrade.
global.customElements = window.customElements;
