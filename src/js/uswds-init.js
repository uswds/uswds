const docElem = window.document.documentElement;
const loadingClass = "usa-js-loading";

function addLoadingClass() {
  docElem.className += ` ${loadingClass}`;
}

function revertClass() {
  docElem.className = docElem.className.replace(loadingClass, "");
}

// Based on https://www.filamentgroup.com/lab/enhancing-optimistically.html
if ("querySelector" in window.document && "addEventListener" in window) {
  addLoadingClass();

  const fallback = setTimeout(revertClass, 8000);
  let timeout = 100;

  const poll = () => {
    setTimeout(() => {
      timeout += 1;
      if (typeof uswdsPresent !== "undefined") {
        // USWDS library loaded
        clearTimeout(fallback);
        setTimeout(revertClass, 100);
      } else if (timeout > 0) {
        poll();
      } else {
        // USWDS library failed to load
      }
    }, 100);
  };

  poll();
}
