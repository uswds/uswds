const keymap = require("./keymap");
const behavior = require("./behavior");
const select = require("./select");
const activeElement = require("./active-element");

const FOCUSABLE =
  'a[href], area[href], input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

const isTabStop = (element) => {
  if (
    element.matches('input[type="hidden"], :disabled') ||
    element.closest("[inert]") ||
    (element.hasAttribute("tabindex") && element.tabIndex < 0) ||
    ["hidden", "collapse"].includes(window.getComputedStyle(element).visibility)
  ) {
    return false;
  }

  // Use computed display: CSS may reveal an element carrying `hidden`. Display
  // is not inherited, so check ancestors as well as the control itself.
  for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
    if (window.getComputedStyle(ancestor).display === "none") {
      return false;
    }
  }

  return true;
};

const getFocusableElements = (context) =>
  select(FOCUSABLE, context).filter(isTabStop);

const tabHandler = (context) => {
  // Recheck the DOM for each keypress: controls may be added, removed, or hidden
  // while the trap is active.
  function tabAhead(event) {
    const focusableElements = getFocusableElements(context);
    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];
    if (!firstTabStop) return;

    if (activeElement() === lastTabStop) {
      event.preventDefault();
      firstTabStop.focus();
    }
  }

  function tabBack(event) {
    const focusableElements = getFocusableElements(context);
    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];
    if (!firstTabStop) return;

    if (activeElement() === firstTabStop) {
      event.preventDefault();
      lastTabStop.focus();
    }
    // The initial focus may be on the container rather than a control inside it.
    else if (!focusableElements.includes(activeElement())) {
      event.preventDefault();
      firstTabStop.focus();
    }
  }

  return { tabAhead, tabBack };
};

module.exports = (context, additionalKeyBindings = {}) => {
  const { autoFocus = true, ...keyBindings } = additionalKeyBindings;
  const tabEventHandler = tabHandler(context);
  const bindings = keyBindings;
  const { Esc, Escape } = bindings;

  if (Escape && !Esc) bindings.Esc = Escape;

  //  TODO: In the future, loop over additional keybindings and pass an array
  // of functions, if necessary, to the map keys. Then people implementing
  // the focus trap could pass callbacks to fire when tabbing
  const keyMappings = keymap({
    Tab: tabEventHandler.tabAhead,
    "Shift+Tab": tabEventHandler.tabBack,
    ...keyBindings,
  });

  const focusTrap = behavior(
    {
      keydown: keyMappings,
    },
    {
      init() {
        // Evaluate visibility on activation, after the caller opens its modal
        // or navigation. The trap may have been created while it was hidden.
        if (autoFocus) {
          getFocusableElements(context)[0]?.focus();
        }
      },
      update(isActive) {
        if (isActive) {
          this.on();
        } else {
          this.off();
        }
      },
    },
  );

  return focusTrap;
};
