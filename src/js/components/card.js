// https://inclusive-components.design/cards#theredundantclickevent

const behavior = require('../utils/behavior');
const select = require('../utils/select');
const { prefix: PREFIX } = require("../config");

const CARD = `.${PREFIX}-card--clickable`;
const CURSOR = 'pointer';
const ACTION = `.${PREFIX}-card__action`;

const cards = behavior(
  {},
  {
    init(root) {
      if (!CARD.length) {
        return;
      }

      let down;
      let up;

      /* eslint no-param-reassign: "error" */
      select(CARD, root).forEach(card => {
        const [ cardAction ] = select(ACTION, card);

        card.style.cursor = CURSOR;
        card.onmousedown = () => {down = +new Date()};
        card.onmouseup = () => {
          const timeDifference = up - down;
          up = +new Date();
          if (timeDifference < 200) {
            cardAction.click();
          }
        };
      });
    }
  }
);

module.exports = cards;
