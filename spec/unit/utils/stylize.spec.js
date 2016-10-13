var assert = require('assert');
var stylize = require('../../../src/js/utils/stylize');

describe('stylize()', function () {
  var style;

  afterEach(function () {
    if (style.parentNode) {
      style.parentNode.removeChild(style);
    }
  });

  it('creates a <style> element with the given id and CSS', function () {
    var id = 'foo';
    var css = 'body { color: red; }';
    style = stylize(id, css);
    assert.equal(style.id, id);
    assert.equal(style.textContent, css);
  });

  it('appends the <style> element to the <head> by default', function () {
    style = stylize('foo', 'body { color: red; }');
    assert.strictEqual(document.head.lastChild, style);
  });

  it('appends the <style> element to supplied node', function () {
    style = stylize('foo', 'body { color: red; }', document.body);
    assert.strictEqual(document.body.lastChild, style);
  });

  it('only adds the <style> element once', function () {
    var id = 'foo';
    var css = 'body { color: red; }';
    style = stylize(id, css);
    assert.strictEqual(stylize(id, css), style);
    assert.equal(document.querySelectorAll('style').length, 1);
  });

});
