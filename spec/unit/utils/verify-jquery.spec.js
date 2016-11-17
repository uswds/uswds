var should = require('should');
var verifyjQuery = require('../../../src/js/utils/verify-jquery');

describe('verifyjQuery', function () {

  var fakeMoney = {
    jQuery: {
      fn: {
        jquery: '1.0',
      },
    },
  };

  it('Returns true if jQuery is present on window', function () {
    verifyjQuery(fakeMoney).should.be.true();
  });

  it('Returns false if jQuery is not present on window', function () {
    verifyjQuery({}).should.be.false();
  });

  it('Returns true if jQuery is present on window with no object passed in', function () {
    var oldWindow = global.window;
    global.window = fakeMoney;
    verifyjQuery().should.be.true();
    global.window = oldWindow;
  });

  it('Returns false if jQuery is not present on window with no object passed in', function () {
    var oldWindow = global.window;
    global.window = {};
    verifyjQuery().should.be.false();
    global.window = oldWindow;
  });

});
