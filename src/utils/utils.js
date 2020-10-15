/* eslint-disable no-trailing-spaces */
/* eslint-disable semi */
/* eslint-disable space-before-blocks */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable require-jsdoc */
'use strict';
const assign = require('object-assign');
const { keymap } = require('receptor');
const behavior = require('./behavior');


const select = (selector, context) => {
    const isElement = value => value && typeof value === 'object' && value.nodeType === 1;

    if (typeof selector !== 'string') {
        return [];
    }
    
    if (!context || !isElement(context)) {
        context = window.document; // eslint-disable-line no-param-reassign
    }

    const selection = context.querySelectorAll(selector);
    return Array.prototype.slice.call(selection);
}

const activeElement = (htmlDocument = document) => {
  return htmlDocument.activeElement;
};

const focusTrap = (context, additionalKeyBindings = {}) => {
  const FOCUSABLE = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

  const tabHandler = context => {
    const focusableElements = select(FOCUSABLE, context);
    const firstTabStop = focusableElements[0];
    const lastTabStop = focusableElements[focusableElements.length - 1];

    // Special rules for when the user is tabbing forward from the
    // last focusable element,
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
    }

    return {
        firstTabStop,
        lastTabStop,
        tabAhead,
        tabBack
    };
  };

  return () => {
    const tabEventHandler = tabHandler(context);
    const bindings = additionalKeyBindings;
    const { Esc, Escape } = bindings;

    if (Escape && !Esc){
        bindings.Esc = Escape;
    }

    //  TODO: In the future, loop over additional keybindings and pass an array
    // of functions, if necessary, to the map keys. Then people implementing
    // the focus trap could pass callbacks to fire when tabbing
    const keyMappings = keymap(
        assign(
        {
        Tab: tabEventHandler.tabAhead,
        'Shift+Tab': tabEventHandler.tabBack
        },
        additionalKeyBindings
        )
    );

    return behavior(
        {
            keydown: keyMappings
        },
        {
            init() {
            // TODO: is this desireable behavior? Should the trap always do this by default or should
            // the component getting decorated handle this?
            tabEventHandler.firstTabStop.focus();
            },
            update(isActive) {
                if (isActive) {
                this.on();
                } else {
                this.off();
                }
            }
        }
    );
  }
}

const isElementInViewport =  (  el,
    win = window,
    docEl = document.documentElement
  ) => {
    const rect = el.getBoundingClientRect();
  
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (win.innerHeight || docEl.clientHeight) &&
      rect.right <= (win.innerWidth || docEl.clientWidth)
    );
}

const isIosDevice = () => {
  return (
    typeof navigator !== "undefined" &&
    (navigator.userAgent.match(/(iPod|iPhone|iPad)/g) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) &&
    !window.MSStream
  );
}

const toggleFieldMask = (field, mask) => {
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("autocorrect", "off");
    field.setAttribute("type", mask ? "password" : "text");
}

const toggleFormInput = (el) => {
    const resolveIdRefs = require("resolve-id-refs");
    const toggleFieldMask = require("./toggle-field-mask");
    
    const CONTROLS = "aria-controls";
    const PRESSED = "aria-pressed";
    const SHOW_ATTR = "data-show-text";
    const HIDE_ATTR = "data-hide-text";
    const getHideText = showText => showText.replace(/\bShow\b/i, show => `${show[0] === "S" ? "H" : "h"}ide`);
    
    // this is the *target* state:
      // * if the element has the attr and it's !== "true", pressed is true
      // * otherwise, pressed is false
      const pressed =
        el.hasAttribute(PRESSED) && el.getAttribute(PRESSED) !== "true";
    
      const fields = resolveIdRefs(el.getAttribute(CONTROLS));
      fields.forEach(field => toggleFieldMask(field, pressed));
    
      if (!el.hasAttribute(SHOW_ATTR)) {
        el.setAttribute(SHOW_ATTR, el.textContent);
      }
    
      const showText = el.getAttribute(SHOW_ATTR);
      const hideText = el.getAttribute(HIDE_ATTR) || getHideText(showText);
    
      el.textContent = pressed ? showText : hideText; // eslint-disable-line no-param-reassign
      el.setAttribute(PRESSED, pressed);
      return pressed;
}

const toggle = (button, expanded) => {
    const EXPANDED = 'aria-expanded';
    const CONTROLS = 'aria-controls';
    const HIDDEN = 'hidden';
    let safeExpanded = expanded;

    if (typeof safeExpanded !== 'boolean') {
        safeExpanded = button.getAttribute(EXPANDED) === 'false';
    }

    button.setAttribute(EXPANDED, safeExpanded);

    const id = button.getAttribute(CONTROLS);
    const controls = document.getElementById(id);
    if (!controls) {
        throw new Error(`No toggle target found with id: '${id}'`);
    }

    if (safeExpanded) {
        controls.removeAttribute(HIDDEN);
    } else {
        controls.setAttribute(HIDDEN, '');
    }

    return safeExpanded;
}

const validateInput = (_el) => {
    const dataset = require("elem-dataset");

    const { prefix: PREFIX } = require("../config");

    const CHECKED = "aria-checked";
    const CHECKED_CLASS = `${PREFIX}-checklist__item--checked`;

    const validate = (el) => {
        const data = dataset(el);
        const id = data.validationElement;
        const checkList =
            id.charAt(0) === "#"
            ? document.querySelector(id)
            : document.getElementById(id);

        if (!checkList) {
            throw new Error(`No validation element found with id: "${id}"`);
        }

        Object.entries(data).forEach(([key, value]) => {
            if (key.startsWith("validate")) {
            const validatorName = key.substr("validate".length).toLowerCase();
            const validatorPattern = new RegExp(value);
            const validatorSelector = `[data-validator="${validatorName}"]`;
            const validatorCheckbox = checkList.querySelector(validatorSelector);

            if (!validatorCheckbox) {
                throw new Error(`No validator checkbox found for: "${validatorName}"`);
            }

            const checked = validatorPattern.test(el.value);
            validatorCheckbox.classList.toggle(CHECKED_CLASS, checked);
            validatorCheckbox.setAttribute(CHECKED, checked);
            }
        });
    };

    return validate(_el);
}

module.exports = {
  select: select,
  activeElement: activeElement,
  focusTrap: focusTrap,
  isElementInViewport: isElementInViewport,
  isIosDevice: isIosDevice,
  toggleFieldMask: toggleFieldMask,
  toggleFormInput: toggleFormInput,
  toggle: toggle,
  validateInput: validateInput
};
