window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

const uswds = require("./config");

const components = require("./index");

uswds.components = components;

const initComponents = () => {
  const target = document.body;
  Object.keys(components).forEach((key) => {
    const behavior = components[key];
    behavior.on(target);
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initComponents, { once: true });
} else {
  initComponents();
}

exports.default = uswds;
exports.initComponents = initComponents;
