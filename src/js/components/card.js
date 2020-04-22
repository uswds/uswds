const behavior = require('../utils/behavior');
const { prefix: PREFIX } = require("../config");
const { CLICK } = require('../events');

const CARD = `.${PREFIX}-card`;

const handleClick = () => {
  console.log('testing');

};

const card = behavior({
  [CLICK]: {
    [CARD]: handleClick
  }
});

module.exports = card;
