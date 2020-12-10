const docElem = window.document.documentElement;
const loadingClass = "usa-js-loading";
const loadedClass = "usa-js-present";
const defaultClass = "no-js";

function addLoadingClass() {
  docElem.className += ` ${loadingClass}`;
}

function removeDefaultClass() {
  docElem.className = docElem.className.replace(defaultClass, "");
}

function revertClass() {
  docElem.className = docElem.className.replace(loadingClass, "");
}

function switchToLoadedClass() {
  docElem.className = docElem.className.replace(loadingClass, loadedClass);
}

if ("querySelector" in window.document && "addEventListener" in window) {
  addLoadingClass();

  const fallback = setTimeout(revertClass, 8000);
  let timeout = 100;

  const poll = () => {
    setTimeout(() => {
      timeout += 1;
      if (typeof uswdsPresent !== "undefined") {
        // External file loaded
        clearTimeout(fallback);
        removeDefaultClass();
        setTimeout(switchToLoadedClass, 100);
      } else if (timeout > 0) {
        poll();
      } else {
        // External library failed to load
      }
    }, 100);
  };

  poll();
}
