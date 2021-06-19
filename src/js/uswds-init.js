(() => {
  const loadingClass = "usa-js-loading";
  document.documentElement.classList.add(loadingClass);
  function revertClass() {
    document.documentElement.classList.remove(loadingClass);
  }

  const fallback = setTimeout(revertClass, 8000);

  function verifyLoaded() {
    if (window.uswdsPresent) {
      clearTimeout(fallback);
      revertClass();
      document.removeEventListener("load", verifyLoaded, true);
    }
  }

  document.addEventListener("load", verifyLoaded, true);
})();
