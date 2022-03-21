const domready = require("domready");

window.uswdsPresent = true; // GLOBAL variable to indicate that the uswds.js has loaded in the DOM.

const uswds = require("./config");

const components = require("./index");

uswds.components = components;

domready(() => {
  const target = document.body;
  Object.keys(components).forEach((key) => {
    const behavior = components[key];
    behavior.on(target);
  });
});

module.exports = uswds;
