const activeElement = require("./active-element");
const Behavior = require("./behavior");
const config = require("./config");
const events = require("./events");
const focusTrap = require("./focus-trap");
const isInViewPort = require("./is-in-viewport");
const isIosDevice = require("./is-ios-device");
const sanitizer = require("./sanitizer");
const scrollBarWidth = require("./scrollbar-width");
const select = require("./select");
const selectOrMatches = require("./select-or-matches");
const styleFormat = require("./style-format");
const toggle = require("./toggle");
const toggleFieldMask = require("./toggle-field-mask");
const toggleFormInput = require("./toggle-form-input");
const validate = require("./validate-input");
const whenDomReady = require("./when-dom-ready");
const testUtils = require("./test")

module.exports = {
  activeElement,
  Behavior,
  config,
  events,
  focusTrap,
  isInViewPort,
  isIosDevice,
  sanitizer,
  scrollBarWidth,
  select,
  selectOrMatches,
  styleFormat,
  toggle,
  toggleFieldMask,
  toggleFormInput,
  validate,
  whenDomReady,
  testUtils
};
