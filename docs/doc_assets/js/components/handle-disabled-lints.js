function handleDisabledLinks () {
  $(document).on('click', 'a[href="#"]', function (event) {
    // Stop default browser action which would likely return to the top of the page
    // unless it's an actual return-to-top link
    var isReturnToTop = 'return to top' === $(event.target).text().toLowerCase();
    if (! isReturnToTop) {
      event.preventDefault();
    }
  });
}
handleDisabledLinks();
