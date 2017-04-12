'use strict';
const fs = require('fs');
const should = require('should');
const select = require('../../../src/js/utils/select');

const TEMPLATE = fs.readFileSync(__dirname + '/select.template.html');

describe('select', function () {

  before(function () {
    document.body.innerHTML = TEMPLATE;
  });

  after(function () {
    document.body.innerHTML = '';
  });

  it('returns an empty array if given a non-string selector', function () {
    select(undefined).should.be.Array().which.has.length(0);
  });

  it('returns an Array of selected DOM elements', function () {
    select('#id1').should.be.Array().which.has.length(1);
    select('.firstclass').should.be.Array().which.has.length(2);
  });

  it('returns an Array of selected DOM elements in a particular context', function () {
    select('.secondclass', select('.firstclass'))
      .should.be.Array().which.has.length(1);
  });

});
