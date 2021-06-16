(() => {
  document.documentElement.classList.add("usa-js-loading");
  function revertClass() {
    document.documentElement.classList.remove("usa-js-loading");
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
