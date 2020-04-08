const fs = require('fs');
const path = require('path');
const sinon = require('sinon');
const assert = require('assert');
const ComboBox = require('../../../src/js/components/combo-box');

const TEMPLATE = fs.readFileSync(path.join(__dirname, '/template.html'));

const EVENTS = {};

/**
 * send a click event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.click = (el) => {
  const evt = new MouseEvent('click', {
    view: el.ownerDocument.defaultView,
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
};

/**
 * send a focusout event
 * @param {HTMLElement} el the element to sent the event to
 */
EVENTS.focusout = (el) => {
  const evt = new Event('focusout', {
    bubbles: true,
    cancelable: true,
  });
  el.dispatchEvent(evt);
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

  it('enchaces a select element into a combo box component', () => {
    assert.ok(input, 'adds an input element');
    assert(select.classList.contains('usa-sr-only'), 'hides the select element from view');
    assert.ok(list, 'adds an list element');
    assert(list.hidden, 'the list is hidden');
    assert.equal(select.getAttribute('id'), '', 'transfers id attribute to combobox');
    assert.equal(input.getAttribute('id'), 'combobox', 'transfers id attribute to combobox');
    assert.equal(select.getAttribute('required'), null, 'transfers required attribute to combobox');
    assert.equal(input.getAttribute('required'), '', 'transfers required attribute to combobox');
    assert.equal(select.getAttribute('name'), 'combobox', 'should not transfer name attribute to combobox');
    assert.equal(input.getAttribute('name'), null, 'should not transfer name attribute to combobox');
    assert.equal(list.getAttribute('role'), 'listbox', 'the list should have a role of `listbox`');
    assert(select.getAttribute('aria-hidden'), 'the select should be hidden from screen readers');
    assert.equal(select.getAttribute('tabindex'), '-1', 'the select should be hidden from keyboard navigation');
  });

  it('should show the list by clicking the input', () => {
    EVENTS.click(input);

    assert(list && !list.hidden, 'should display the option list');
    assert.equal(
      list.children.length,
      select.options.length - 1,
      'should have all of the initial select items in the list except placeholder empty items',
    );
  });

  it('should show the list by clicking when clicking the input twice', () => {
    EVENTS.click(input);
    EVENTS.click(input);

    assert(list && !list.hidden, 'should keep the option list displayed');
    assert.equal(
      list.children.length,
      select.options.length - 1,
      'should have all of the initial select items in the list except placeholder empty items',
    );
  });

  it('should set up the list item for accessibilty', () => {
    EVENTS.click(input);

    for (let i = 0, len = list.children.length; i < len; i += 1) {
      assert.equal(
        list.children[i].getAttribute('aria-selected'),
        'false',
        `item ${i} should not be shown as selected`,
      );
      assert.equal(
        list.children[i].getAttribute('tabindex'),
        '-1',
        `item ${i} should be hidden from keyboard navigation`,
      );
      assert.equal(
        list.children[i].getAttribute('role'),
        'option',
        `item ${i} should have a role of 'option'`,
      );
    }
  });

  it('should close the list by clicking away', () => {
    EVENTS.click(input);
    EVENTS.focusout(input);

    assert.equal(list.children.length, 0, 'should empty the option list');
    assert(list.hidden, 'should hide the option list');
  });

  it('should select an item from the option list when clicking a list option', () => {
    EVENTS.click(input);
    EVENTS.click(list.children[0]);

    assert.equal(select.value, 'value-ActionScript', 'should set that item to being the select option');
    assert.equal(input.value, 'ActionScript', 'should set that item to being the input value');
    assert(list.hidden, 'should hide the option list');
    assert.equal(list.children.length, 0, 'should empty the option list');
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
          EVENTS.focusout(input);
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
          EVENTS.focusout(input);
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
