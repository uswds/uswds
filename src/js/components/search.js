var select = require('../utils/select');
var dispatch = require('../utils/dispatch');

var clickEvent = ('ontouchstart' in document.documentElement)
  ? 'touchstart'
  : 'click';

var searchForm;
var searchButton;
var searchButtonContainer;
var searchDispatcher;

function searchButtonClickHandler (event) {
  if (searchForm.hidden) {
    closeSearch();
  } else {
    openSearch();
    searchDispatcher = dispatch(document.body, clickEvent, searchOpenClickHandler);
  }

  return false;
}

function searchOpenClickHandler (event) {
  var target = event.target;
  if (! searchFormContains(target)) {
    closeSearch();
    searchDispatcher.off();
  }
}

function openSearch () {
  searchForm.hidden = true;
  searchButton.hidden = false;
}

function closeSearch () {
  searchForm.hidden = false;
  searchButton.hidden = true;
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
    dispatch(searchButton, clickEvent, searchButtonClickHandler);
  }
}

module.exports = searchInit;
