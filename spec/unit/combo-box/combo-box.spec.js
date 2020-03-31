const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ComboBox = require('../../../src/js/components/combo-box');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/template.html'));

const sendClick = (el) => {
  el.dispatchEvent(new KeyboardEvent('click', { bubbles: true }));
};

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
      assert.ok(input);
    });

    it('hides the select element from view', () => {
      assert(select.classList.contains('usa-sr-only'));
    });

    it('adds an hidden list element', () => {
      assert.ok(list);
      assert(list.hidden);
    });

    describe('accessibilty', () => {
      it('the list should have a role of `listbox`', () => {
        assert.equal(list.getAttribute('role'), 'listbox');
      });

      it('the select should be hidden from screen readers', () => {
        assert(select.getAttribute('aria-hidden'));
      });

      it('the select should be hidden from keyboard navigation', () => {
        assert.equal(select.getAttribute('tabindex'), '-1');
      });
    });
  });

  describe('interaction - mouse', () => {
    describe('show the list by clicking the input', () => {
      beforeEach('click the input', () => {
        sendClick(input);
      });

      it('should display the option list', () => {
        assert(list && !list.hidden);
      });

      it('should have all of the initial select items in the list except placeholder empty items', () => {
        assert.equal(list.children.length, select.options.length - 1);
      });

      describe('subsequent click', () => {
        beforeEach('click the input', () => {
          sendClick(input);
        });

        it('should keep the option list displayed', () => {
          assert(list && !list.hidden);
        });

        it('should have all of the initial select items in the list except placeholder empty items', () => {
          assert.equal(list.children.length, select.options.length - 1);
        });
      });

      describe('accessibilty', () => {
        it('none of the items should be shown as selected', () => {
          for (let i = 0, len = list.children.length; i < len; i += 1) {
            assert.equal(list.children[i].getAttribute('aria-selected'), 'false');
          }
        });

        it('all of the options should be hidden from keyboard navigation', () => {
          for (let i = 0, len = list.children.length; i < len; i += 1) {
            assert.equal(list.children[i].getAttribute('tabindex'), '-1');
          }
        });

        it('all of the items should have a role of `option`', () => {
          for (let i = 0, len = list.children.length; i < len; i += 1) {
            assert.equal(list.children[i].getAttribute('role'), 'option');
          }
        });
      });

      describe('close list by clicking away', () => {
        beforeEach('click outside of the combobox', () => {
          sendClick(body);
        });
        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });
      });
    });

    describe('selecting an item', () => {
      beforeEach('click the open button then click an item in the list', () => {
        sendClick(input);
        sendClick(list.children[0]);
      });

      it('should set that item to being the select option', () => {
        assert.equal(select.value, 'value-ActionScript');
      });

      it('should set that item to being the input value', () => {
        assert.equal(input.value, 'ActionScript');
      });

      it('should hide and empty the option list', () => {
        assert(list.hidden);
        assert.equal(list.children.length, 0);
      });
    });

    describe('show the list by clicking the down arrow', () => {
      beforeEach('click the down arrow', () => { });
      it('displays the option list', () => { });
    });
  });

  describe('interaction - input', () => {
    beforeEach('set an initial value in the select', () => { });

    describe('typing letters - incomplete option', () => {
      beforeEach('type in letter into the input', () => { });
      it('displays the option list', () => { });
      it('should filter the item by the string being present in the option', () => { });

      describe('close the list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });
      });

      describe('complete selection by pressing enter', () => {
        beforeEach('press enter from within the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should clear the value on the select and input', () => { });

        describe('subsequent enter', () => {
          beforeEach('press enter from within the input', () => { });
          it('should attempt to submit the form', () => { });
        });
      });

      describe('close the list by clicking escape', () => {
        beforeEach('click the escape button within the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should not change the value of the select', () => { });
        it('should not change the value in the input', () => { });
        it('should keep focus on the input', () => { });
      });
    });

    describe('typing a complete option', () => {
      beforeEach('type a complete option into the input', () => { });
      it('displays the option list', () => { });
      it('should filter the item by the string being present in the option', () => { });

      describe('close list by clicking away', () => {
        beforeEach('click the outside the combobox', () => { });
        it('should hide and empty the option list', () => { });
        it('should set that item to being the select option', () => { });
        it('should set that item to being the input value', () => { });
      });

      describe('complete selection by pressing enter', () => {
        beforeEach('press enter from within the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should set that item to being the select option', () => { });
        it('should set that item to being the input value', () => { });

        describe('subsequent enter', () => {
          beforeEach('press enter from within the input', () => { });
          it('should attempt to submit the form', () => { });
        });
      });

      describe('closing the option list by clicking escape', () => {
        beforeEach('press the escape button from the input', () => { });
        it('should hide and empty the option list', () => { });
        it('should not change the value of the select', () => { });
        it('should not change the value in the input', () => { });
        it('should keep focus on the input', () => { });
      });
    });

    describe('typing an nonexistent option', () => {
      beforeEach('type a nonexistent option into the input', () => { });
      it('displays the option list', () => { });
      it('should show an empty list', () => { });
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
          it('should not change the value of the select', () => { });
          it('should not change the value in the input', () => { });
          it('should keep focus on the input', () => { });
        });
      });
    });
  });
});
