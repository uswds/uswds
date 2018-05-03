'use strict';
const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'hidden';

module.exports = (button, expanded) => {

  if (typeof expanded !== 'boolean') {
    expanded = button.getAttribute(EXPANDED) === 'false';
  }
  button.setAttribute(EXPANDED, expanded);

  const id = button.getAttribute(CONTROLS);
  const controls = document.getElementById(id);
  if (!controls) {
    throw new Error(
      'No toggle target found with id: "' + id + '"'
    );
  }

  expanded ? controls.removeAttribute(HIDDEN, '') : controls.setAttribute(HIDDEN, '');
  return expanded;
};
