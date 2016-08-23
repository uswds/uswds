var select = require('../../utils/select');
var addClass = require('../../utils/add-class');
var removeClass = require('../../utils/remove-class');
var dispatch = require('../../utils/dispatch');

var searchForm = select('.js-search-form')[ 0 ];
var searchButton = select('.js-search-button')[ 0 ];
var searchButtonContainer = select('.js-search-button-container')[ 0 ];
var searchDispatcher;

if (searchButton && searchForm) {
  dispatch(searchButton, 'click touchstart', searchButtonClickHandler);
}

function searchButtonClickHandler (event) {
  event.preventDefault();

  if (isOpen(searchForm)) {
    closeSearch();
  } else {
    openSearch();
    searchDispatcher = dispatch(document.body, 'click touchstart', searchOpenClickHandler);
  }
}

function searchOpenClickHandler (event) {
  var target = event.target;
  if (! searchFormContains(target)) {
    closeSearch();
    searchDispatcher.off();
  }
}

function openSearch () {
  searchForm.addClass('is-visible');
  searchButton.addClass('is-hidden');
}

function closeSearch () {
  searchForm.removeClass('is-visible');
  searchButton.removeClass('is-hidden');
}

function isOpen (element) {
  var classRegexp = new RegExp('(^| )is-visible( |$)', 'gi');
  return classRegexp.test(element.className);
}

function searchFormContains (element) {
  return (searchForm && searchForm.contains(element)) ||
         (searchButtonContainer && searchButtonContainer.contains(element));
}
