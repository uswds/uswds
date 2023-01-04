/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
import "./polyfills/index.mjs";
import svg4everybody from "./polyfills/svg4everybody.mjs";

import { prefix } from "./config.mjs";
import components from "./index.mjs";

const uswds = {
  prefix,
  components,
};

window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.
uswds.components = components;

export const initComponents = () => {
  const target = document.body;
  Object.keys(components).forEach((key) => {
    const behavior = components[key];
    behavior.on(target);
  });
  svg4everybody();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents, { once: true });
} else {
  initComponents();
}

export default uswds;
