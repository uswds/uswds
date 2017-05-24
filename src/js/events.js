module.exports = {
  CLICK: ('ontouchstart' in document.documentElement)
    ? 'touchstart'
    : 'click',
};
