const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ComboBox = require('../../../src/js/components/combo-box');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/template.html'));

// const dispatchInputEvent = (el) => {
//   el.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
// };

describe('combo box component', () => {
  const { body } = document;

  let root;
  let input;
  let select;
  let list;

  beforeEach(() => {
    body.innerHTML = TEMPLATE;
    ComboBox.on();
    root = body.querySelector('.usa-combo-box');
    input = root.querySelector('.usa-combo-box__input');
    select = root.querySelector('.usa-combo-box__select');
    list = root.querySelector('.usa-combo-box__list');
  });

  afterEach(() => {
    body.textContent = '';
    ComboBox.off(body);
  });

  describe('enhancement', () => {
    it('adds an input element', () => {
      const hasInputElement = !!input;
      assert(hasInputElement);
    });

    it('hides the select element', () => {
      const selectIsHiddenFromScreenReader = select.getAttribute('aria-hidden');
      const selectIsHiddenFromKeyboard = select.getAttribute('tabindex') === '-1';
      const selectIsHiddenFromSight = root.classList.contains('usa-combo-box--enhanced');

      assert(selectIsHiddenFromScreenReader);
      assert(selectIsHiddenFromKeyboard);
      assert(selectIsHiddenFromSight);
    });

    it('adds an hidden list element', () => {
      const listIsHidden = list && list.hidden;
      assert(listIsHidden);
    });
  });

  describe('interaction - mouse', () => {
    beforeEach('save the current value of the select and input', () => { });

    describe('show the list by clicking the input', () => {
      beforeEach('click the input', () => { });
      it('displays the option list', () => { });
      it('should have all of the initial select items in the list', () => { });

      describe('accessibilty', () => {
        it('the option list should have a role an `listbox`', () => { });
        it('none of the items should be shown as selected', () => { });
        it('all of the items should have a role an `option`', () => { });
      });
    });

    describe('show the list by clicking down button', () => {
      beforeEach('click the open button', () => { });
      it('displays the option list', () => { });

      describe('close list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should not change the value on the select and input', () => { });
      });
    });

    describe('selecting an item', () => {
      beforeEach('click the open button', () => { });
      beforeEach('click an item in the list', () => { });
      it('should set that item to being the select option', () => { });
      it('should set that item to being the input value', () => { });
    });
  });

  describe('interaction - input', () => {
    beforeEach('set a value in the select', () => { });

    describe('typing letters - incomplete option', () => {
      beforeEach('type in letter into the input', () => { });
      it('displays the option list', () => { });
      it('should filter the item by the string being present in the option', () => { });

      describe('close list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });
      });

      describe('close list by clicking escape', () => {
        beforeEach('click the escape button in input', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });
      });
    });

    describe('typing a complete option', () => {
      beforeEach('type a complete option into the input', () => { });
      it('displays the option list', () => { });
      it('should filter the item by the string being present in the option', () => { });

      describe('leaving the input', () => {
        beforeEach('remove focus from the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should set that item to being the select option', () => { });
        it('should set that item to being the input value', () => { });
      });

      describe('close list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should set that item to being the select option', () => { });
        it('should set that item to being the input value', () => { });
      });

      describe('closing the option list by clicking escape', () => {
        beforeEach('press the escape button from the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should set that item to being the select option', () => { });
        it('should set that item to being the input value', () => { });
      });
    });

    describe('typing an nonexistent option', () => {
      beforeEach('type a nonexistent option into the input', () => { });
      it('displays the option list', () => { });
      it('should show an empty list', () => { });

      describe('close list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });
      });

      describe('close list by clicking escape', () => {
        beforeEach('click the escape button in input', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });
      });
    });
  });

  describe('interaction - input - keyboard', () => {
    beforeEach('set a value in the select', () => { });

    describe('typing letters', () => {
      beforeEach('type in letters into the input', () => { });
      it('displays the option list', () => { });
      it('should filter the item by the string being present in the option', () => { });

      describe('highlighting an item', () => {
        beforeEach('press down arrow from input', () => { });
        it('should highlight the first item in the list', () => { });

        describe('selecting an item', () => {
          beforeEach('press enter from input', () => { });
          it('select the first item in the list', () => { });
          it('should set that item to being the select option', () => { });
        });
      });

      describe('highlighting the last item', () => {
        beforeEach('press down arrow from input many times', () => { });
        it('should highlight the last item in the list', () => { });

        describe('close list by clicking escape', () => {
          beforeEach('click the escape button in input', () => { });
          it('should hide and empty the option list', () => { });
          it('should clear the value on the select and input', () => { });
        });
      });
    });
  });
});
