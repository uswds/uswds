window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

/**
 * The 'polyfills' define key ECMAScript 5 methods that may be missing from
 * older browsers, so must be loaded first.
 */
require("./polyfills");

const uswds = require("./config");

const accordion = require("../../../usa-banner/src/index");
const banner = require("../../../usa-banner/src/index");
// const components = require("./index");

const svg4everybody = require("./polyfills/svg4everybody");

// uswds.components = components;

const initComponents = () => {
  const target = document.body;
  // ?
  // ? How to test
  // ? ===============
  // 1. Run code, components should work
  // 2. Switch order of accordion and banner
  // 3. Include ONLY one of Banner/Accordion
  // 4. Comment out accordion & banner. Uncomment components and initialization below (lines 30-33). Everything should work.
  banner.on(target);
  // accordion.on(target);

  // Object.keys(components).forEach((key) => {
  //   const behavior = components[key];
  //   behavior.on(target);
  // });

  svg4everybody();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents, { once: true });
} else {
  initComponents();
}

exports.default = uswds;
exports.initComponents = initComponents;
