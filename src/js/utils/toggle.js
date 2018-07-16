const EXPANDED = 'aria-expanded';
const CONTROLS = 'aria-controls';
const HIDDEN = 'aria-hidden';

module.exports = (button, expanded) => {
  let safeExpanded = expanded;

  if (typeof safeExpanded !== 'boolean') {
    safeExpanded = button.getAttribute(EXPANDED) === 'false';
  }

  button.setAttribute(EXPANDED, safeExpanded);

  const id = button.getAttribute(CONTROLS);
  const controls = document.getElementById(id);
  if (!controls) {
    throw new Error(`No toggle target found with id: "${id}"`);
  }

  controls.setAttribute(HIDDEN, !safeExpanded);

  return safeExpanded;
};
