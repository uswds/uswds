require('should');
const dispatch = require('../../src/js/utils/dispatch');

function click(el) {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', false, true);
  el.dispatchEvent(evt);
}

function touchstart(el) {
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('touchstart', false, true);
  el.dispatchEvent(evt);
}

describe('1.x dispatch', () => {
  let flag = false;
  const element = document.body;
  const listener = () => {
    flag = true;
  };

  const createDispatcher = eventName => dispatch(element, eventName, listener);

  afterEach(() => {
    flag = false;
  });

  it('attaches an event to an element', () => {
    const dispatcher = createDispatcher('click');
    click(element);
    flag.should.equal(true);
    dispatcher.off();
  });

  it('can attach a listener for multiple events', () => {
    const dispatcher = createDispatcher('click touchstart');

    click(element);
    flag.should.equal(true);

    flag = false;
    touchstart(element);
    flag.should.equal(true);

    dispatcher.off();
  });

  describe('it returns an object which', () => {
    it('contains an "off" method for detaching the listener', () => {
      // confirm that the listener has been added
      const dispatcher = createDispatcher('click touchstart');
      click(element);
      flag.should.equal(true);
      // now detach it
      flag = false;
      dispatcher.off();
      click(element);
      flag.should.equal(false);
      touchstart(element);
      flag.should.equal(false);
    });

    it('contains a "trigger" method for calling the listener', () => {
      const dispatcher = createDispatcher('click');
      dispatcher.trigger();
      flag.should.equal(true);
      dispatcher.off();
    });
  });
});
