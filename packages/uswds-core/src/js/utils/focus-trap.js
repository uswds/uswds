const assign = require("object-assign");
const { keymap } = require("receptor");
const behavior = require("./behavior");
const select = require("./select");
const activeElement = require("./active-element");

const FOCUSABLE =
  'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

const tabHandler = (context) => {
  const focusableElements = select(FOCUSABLE, context);
  const firstTabStop = focusableElements[0];
  const lastTabStop = focusableElements[focusableElements.length - 1];

  const observer = new MutationObserver(() => {
    focusableElements = select(FOCUSABLE, context);
    firstTabStop = focusableElements[0];
    lastTabStop = focusableElements[focusableElements.length - 1];
  });

  observer.observe(context, {
    childList: true,
    subtree: true,
  });

  // Special rules for when the user is tabbing forward from the last focusable element,
  // or when tabbing backwards from the first focusable element
  function tabAhead(event) {
    if (activeElement() === lastTabStop) {
      event.preventDefault();
      firstTabStop.focus();
    }
  }

  function tabBack(event) {
    if (activeElement() === firstTabStop) {
      event.preventDefault();
      lastTabStop.focus();
    }
    // This checks if you want to set the initial focus to a container
    // instead of an element within, and the user tabs back.
    // Then we set the focus to the first
    else if (!focusableElements.includes(activeElement())) {
      event.preventDefault();
      firstTabStop.focus();
    }
  }

  return {
    firstTabStop,
    lastTabStop,
    tabAhead,
    tabBack,
    observe,
  };
};

module.exports = (context, additionalKeyBindings = {}) => {
  const tabEventHandler = tabHandler(context);
  const bindings = additionalKeyBindings;
  const { Esc, Escape } = bindings;

  if (Escape && !Esc) bindings.Esc = Escape;

  //  TODO: In the future, loop over additional keybindings and pass an array
  // of functions, if necessary, to the map keys. Then people implementing
  // the focus trap could pass callbacks to fire when tabbing
  const keyMappings = keymap(
    assign(
      {
        Tab: tabEventHandler.tabAhead,
        "Shift+Tab": tabEventHandler.tabBack,
      },
      additionalKeyBindings,
    ),
  );

  const focusTrap = behavior(
    {
      keydown: keymap(
        assign(
          {
            Tab: (event) => {
              const currentElement = activeElement();
              const currentIndex = focusableElements.indexOf(currentElement);
              const nextIndex = currentIndex + (event.shiftKey ? -1 : 1);
              const nextElement = focusableElements[nextIndex];
  
              if (nextElement) {
                event.preventDefault();
                nextElement.focus();
              }
            },
          },
          additionalKeyBindings,
        ),
      ),
    },
    {
      init() {
        // TODO: is this desireable behavior? Should the trap always do this by default or should
        // the component getting decorated handle this?
        if (tabEventHandler.firstTabStop) {
          tabEventHandler.firstTabStop.focus();
        }
      },
      update(isActive) {
        if (isActive) {
          this.on();
        } else {
          this.off();
        }
      },
      destroy() {
        tabEventHandler.observer.disconnect();
      },
    },
  );

  return focusTrap;
};
