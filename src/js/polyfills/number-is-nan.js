Number.isNaN =
  Number.isNaN ||
  function isNaN(input) {
    // eslint-disable-next-line no-self-compare
    return typeof input === "number" && input !== input;
  };
