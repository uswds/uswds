var $ = require('jquery');

var $searchForm = $('.js-search-form');
var $searchButton = $('.js-search-button');

$searchButton.on('click touchstart', function (e) {
  e.preventDefault();

  if (isOpen($searchForm)) {
    closeSearch();
  } else {
    openSearch();
    $('html').on('click touchstart', function (e) {
      var $target = $(e.target);
      if ($target.parents('.js-search-form').length ||
          $target.parents('.js-search-button-container').length) {
        console.log('inside the item');
      } else {
        closeSearch();
        $('html').off('click touchstart');
      }
    });
  }
});

function openSearch () {
  $searchForm.addClass('is-visible');
  $searchButton.addClass('is-hidden');
}

function closeSearch () {
  $searchForm.removeClass('is-visible');
  $searchButton.removeClass('is-hidden');
}

function isOpen ($el) {
  return $el.hasClass('is-visible');
}