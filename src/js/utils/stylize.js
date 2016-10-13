var head = document.head || document.getElementsByTagName('head')[ 0 ];

var createStyle = function (id, css, parent) {
  var style = document.createElement('style');
  style.id = id;
  style.media = 'screen';
  style.textContent = css;
  return (parent || head).appendChild(style);
};

/**
 * @param {String} id the unique id of the <style> element to create (or find)
 * @param {String} css the CSS content of the <style> element to create, if it
 * doesn't exist already
 * @return {HTMLStyleElement}
 */
module.exports = function stylize (id, css, parent) {
  return document.getElementById(id)
      || createStyle(id, css, parent);
};
