var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

var VISUALLY_HIDDEN = 'usa-sr-only';

var clickEvent = ('ontouchstart' in document.documentElement)
  ? 'touchstart'
  : 'click';

var searchForm;
var searchButton;
var searchButtonContainer;

var activateDispatcher;
var deactivateDispatcher;

function searchButtonClickHandler (event) {
  if (searchForm.hidden) {
    closeSearch();
  } else {
    openSearch();
    deactivateDispatcher = dispatch(document.body, clickEvent, searchOpenClickHandler);
  }

  return false;
}

function searchOpenClickHandler (event) {
  if (! searchFormContains(event.target)) {
    closeSearch();
    deactivateDispatcher.off();
    deactivateDispatcher = undefined;
  }
}

function openSearch () {
  searchForm.classList.remove(VISUALLY_HIDDEN);
  var input = searchForm.querySelector('[type=search]');
  if (input) {
    input.focus();
  }
  searchButton.hidden = true;
}

function closeSearch () {
  searchForm.classList.add(VISUALLY_HIDDEN);
  searchButton.hidden = false;
}

function searchFormContains (element) {
  return (searchForm && searchForm.contains(element)) ||
         (searchButtonContainer && searchButtonContainer.contains(element));
}

function searchInit () {
  searchForm = select('.js-search-form')[ 0 ];
  searchButton = select('.js-search-button')[ 0 ];
  searchButtonContainer = select('.js-search-button-container')[ 0 ];

  if (searchButton && searchForm) {
    closeSearch();
    activateDispatcher = dispatch(searchButton, clickEvent, searchButtonClickHandler);
  }
}

function searchOff () {
  if (activateDispatcher) {
    activateDispatcher.off();
  }
  if (deactivateDispatcher) {
    deactivateDispatcher.off();
  }
}

module.exports = searchInit;
module.exports.off = searchOff;
