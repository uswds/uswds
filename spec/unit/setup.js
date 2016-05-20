var $;
var jsdom = require('jsdom').jsdom;

// expose these globally so jquery can detect them
global.document = jsdom('<html><body></body></html>', {});;
global.window = document.defaultView;;

$ = require('jquery');

module.exports = $;

