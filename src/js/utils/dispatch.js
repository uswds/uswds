module.exports = (element, eventTypeString, listener, options) => {
  const eventTypes = eventTypeString.split(/\s+/);

  const add = () => {
    eventTypes.forEach(type => {
      element.addEventListener(type, listener, options);
    });
  };

  const trigger = () => {
    const type = eventTypes[ 0 ];
    const event = document.createEvent('HTMLEvents');
    event.initEvent(type, false, true);
    element.dispatchEvent(event);
  };

  const remove = () => {
    eventTypes.forEach(type => {
      element.removeEventListener(type, listener, options);
    });
  };

  add();

  return {
    on: add,
    trigger: trigger,
    off: remove,
  };
};
