const docElem = window.document.documentElement;
const loadingClass = "usa-js-loading";
const loadedClass = "usa-js-present";

function addLoadingClass() {
  if (docElem.className === "") {
    docElem.className += loadingClass;
  } else {
    docElem.className += ` ${loadingClass}`;
  }
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
