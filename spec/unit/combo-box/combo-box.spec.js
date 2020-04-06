const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const assert = require('assert');
const ComboBox = require('../../../src/js/components/combo-box');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/template.html'));

const dispatch = (event, el) => {
  el.dispatchEvent(new KeyboardEvent(event, { bubbles: true }));
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

    it('transfers id attribute to combobox', () => {
      assert.equal(select.getAttribute('id'), '');
      assert.equal(input.getAttribute('id'), 'combobox');
    });

    it('transfers required attribute to combobox', () => {
      assert.equal(select.getAttribute('required'), null);
      assert.equal(input.getAttribute('required'), '');
    });

    it('should not transfer name attribute to combobox', () => {
      assert.equal(select.getAttribute('name'), 'combobox');
      assert.equal(input.getAttribute('name'), null);
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
        dispatch('click', input);
      });

      it('should display the option list', () => {
        assert(list && !list.hidden);
      });

      it('should have all of the initial select items in the list except placeholder empty items', () => {
        assert.equal(list.children.length, select.options.length - 1);
      });

      describe('subsequent click', () => {
        beforeEach('click the input', () => {
          dispatch('click', input);
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
            assert.equal(
              list.children[i].getAttribute('aria-selected'),
              'false',
            );
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

      describe('close the list by clicking away', () => {
        beforeEach('click outside of the combobox', () => {
          dispatch('click', body);
        });
        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });
      });
    });

    describe('selecting an item', () => {
      beforeEach('click the open button then click an item in the list', () => {
        dispatch('click', input);
        dispatch('click', list.children[0]);
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

    // describe('show the list by clicking the down arrow', () => {
    //   beforeEach('click the down arrow', () => { });
    //   it('displays the option list', () => { });
    // });
  });

  describe('interaction - input', () => {
    beforeEach('set an initial value in the select', () => {
      select.value = 'value-ActionScript';
    });

    describe('typing letters - incomplete option', () => {
      beforeEach('type in letter into the input', () => {
        input.value = 'a';
        const e = new KeyboardEvent('keyup', {
          bubbles: true,
          key: 'a',
          keyCode: 65,
        });
        input.dispatchEvent(e);
      });

      it('displays the option list', () => {
        assert(list && !list.hidden);
      });

      it('should filter the item by the string being present in the option', () => {
        assert.equal(list.children.length, 10);
      });

      describe('close the list by clicking away', () => {
        beforeEach('click outside of the combobox', () => {
          dispatch('click', body);
        });

        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });

        it('should clear the value on the select', () => {
          assert.equal(select.value, '');
        });

        it('should clear the value on the input', () => {
          assert.equal(input.value, '');
        });
      });

      describe('complete selection by pressing enter', () => {
        let preventDefaultSpy;

        beforeEach('press enter from within the input', () => {
          const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            keyCode: 13,
          });
          preventDefaultSpy = sinon.spy(e, 'preventDefault');
          input.dispatchEvent(e);
        });

        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });

        it('should clear the value on the select', () => {
          assert.equal(select.value, '');
        });

        it('should clear the value on the input', () => {
          assert.equal(input.value, '');
        });

        it('should not have allowed enter to propagate', () => {
          assert(preventDefaultSpy.called);
        });

        describe('subsequent enter', () => {
          beforeEach('press enter from within the input', () => {
            const e = new KeyboardEvent('keydown', {
              bubbles: true,
              key: 'Enter',
              keyCode: 13,
            });
            preventDefaultSpy = sinon.spy(e, 'preventDefault');
            input.dispatchEvent(e);
          });

          it('should attempt to submit the form', () => {
            assert(preventDefaultSpy.notCalled);
          });
        });
      });

      describe('close the list by clicking escape', () => {
        beforeEach('click the escape button within the input', () => {
          const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Escape',
            keyCode: 27,
          });
          input.dispatchEvent(e);
        });

        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });
        it('should not change the value of the select', () => {
          assert.equal(select.value, 'value-ActionScript');
        });
        it('should not change the value in the input', () => {
          assert.equal(input.value, 'a');
        });
      });
    });

    describe('typing a complete option', () => {
      beforeEach('type a complete option into the input', () => {
        input.value = 'go';
        const e = new KeyboardEvent('keyup', {
          bubbles: true,
          key: 'o',
          keyCode: 79,
        });
        input.dispatchEvent(e);
      });

      it('displays the option list', () => {
        assert(list && !list.hidden);
      });

      describe('close list by clicking away', () => {
        beforeEach('click outside of the combobox', () => {
          dispatch('click', body);
        });

        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });

        it('should set that item to being the select option', () => {
          assert.equal(select.value, 'value-Go');
        });

        it('should set that item to being the input value', () => {
          assert.equal(input.value, 'Go');
        });
      });

      describe('complete selection by pressing enter', () => {
        beforeEach('press enter from within the input', () => {
          const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'Enter',
            keyCode: 13,
          });
          input.dispatchEvent(e);
        });
        it('should hide and empty the option list', () => {
          assert.equal(list.children.length, 0);
          assert(list.hidden);
        });

        it('should set that item to being the select option', () => {
          assert.equal(select.value, 'value-Go');
        });

        it('should set that item to being the input value', () => {
          assert.equal(input.value, 'Go');
        });
      });
    });

    describe('typing an nonexistent option', () => {
      beforeEach('type a nonexistent option into the input', () => {
        input.value = 'Bibbidi-Bobbidi-Boo';
        const e = new KeyboardEvent('keyup', {
          bubbles: true,
          key: 'o',
          keyCode: 79,
        });
        input.dispatchEvent(e);
      });

      it('displays the option list', () => {
        assert(list && !list.hidden);
      });

      it('should show no results list item', () => {
        assert.equal(list.children.length, 1);
        assert.equal(list.children[0].textContent, 'No results found');
      });
    });
  });

  describe('interaction - input - keyboard', () => {
    let selectedOption;

    beforeEach('set a value in the select', () => {
      selectedOption = null;
      select.value = 'value-JavaScript';
    });

    describe('typing letters', () => {
      beforeEach('type in letters into the input', () => {
        input.value = 'la';
        const e = new KeyboardEvent('keyup', {
          bubbles: true,
          key: 'a',
          keyCode: 65,
        });
        input.dispatchEvent(e);
      });

      it('displays the option list', () => {
        assert(list && !list.hidden);
      });

      it('should filter the item by the string being present in the option', () => {
        assert.equal(list.children.length, 2);
      });

      describe('highlighting an item', () => {
        beforeEach('press down arrow from input', () => {
          const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'ArrowDown',
          });
          input.dispatchEvent(e);
        });

        beforeEach('find the focused item in the list', () => {
          selectedOption = document.activeElement;
        });

        it('should focus the first item in the list', () => {
          assert(selectedOption.classList.contains('usa-combo-box__list-option--focused'));
          assert.equal(selectedOption.textContent, 'Erlang');
        });

        describe('selecting an item', () => {
          beforeEach('press enter from selected item', () => {
            const e = new KeyboardEvent('keydown', {
              bubbles: true,
              key: 'Enter',
            });
            input.dispatchEvent(e);
          });

          it('select the first item in the list', () => {
            assert.equal(select.value, 'value-Erlang');
          });

          it('should set the value in the input', () => {
            assert.equal(input.value, 'Erlang');
          });
        });
      });

      describe('highlighting the last item', () => {
        beforeEach('press down arrow from input many times', () => {
          const e = new KeyboardEvent('keydown', {
            bubbles: true,
            key: 'ArrowDown',
          });
          input.dispatchEvent(e);
          input.dispatchEvent(e);
          input.dispatchEvent(e);
        });

        beforeEach('find the focused item in the list', () => {
          selectedOption = document.activeElement;
        });

        it('should focus the last item in the list', () => {
          assert(selectedOption.classList.contains('usa-combo-box__list-option--focused'));
          assert.equal(selectedOption.textContent, 'Scala');
        });

        describe('close list by clicking escape', () => {
          beforeEach('click the escape button in input', () => {
            const e = new KeyboardEvent('keydown', {
              bubbles: true,
              key: 'Escape',
            });
            input.dispatchEvent(e);
          });
          it('should hide and empty the option list', () => {
            assert.equal(list.children.length, 0);
            assert(list.hidden);
          });
          it('should not change the value of the select', () => {
            select.value = 'value-JavaScript';
          });
          it('should not change the value in the input', () => {
            input.value = 'la';
          });
        });
      });
    });
  });
});
