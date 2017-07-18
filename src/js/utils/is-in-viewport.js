// https://stackoverflow.com/a/7557433
function isElementInViewport (el, win=window,
                              htmlEl=document.documentElement) {
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (win.innerHeight || htmlEl.clientHeight) &&
    rect.right <= (win.innerWidth || htmlEl.clientWidth)
  );
}

module.exports = isElementInViewport;
