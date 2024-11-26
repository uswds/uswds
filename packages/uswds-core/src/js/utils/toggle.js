const EXPANDED = "aria-expanded";
const CONTROLS = "aria-controls";
const HIDDEN = "hidden";

module.exports = (button, expanded) => {
  let safeExpanded = expanded;

  if (typeof safeExpanded !== "boolean") {
    safeExpanded = button.getAttribute(EXPANDED) === "false";
  }

  button.setAttribute(EXPANDED, safeExpanded);

  const id = button.getAttribute(CONTROLS);
  const controls = document.getElementById(id);
  if (!controls) {
    throw new Error(`No toggle target found with id: "${id}"`);
  }

  // Return boolean if browser supports "until-found".
  const testHiddenUntilFound = () => !!("onbeforematch" in document.body);

  const hiddenAttributeValue = testHiddenUntilFound() ? "until-found" : "";

  if (safeExpanded) {
    controls.removeAttribute(HIDDEN);
  } else {
    controls.setAttribute(HIDDEN, hiddenAttributeValue);
  }

  return safeExpanded;
};
