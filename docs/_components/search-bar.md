---
layout: styleguide
type: component
title: Search bar
subheading: UI components
lead: A block that allows users to search for specific content if they know what search terms to use or can’t find desired content in the main navigation
---

<div class="preview preview-search-bar">

  <h6>Search big</h6>

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search usa-search-big">
        <div role="search">
          <label class="usa-sr-only" for="search-field-big">Search big</label>
          <input id="search-field-big" type="search" name="search">
          <button type="submit">
            <span class="usa-search-submit-text">Search</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <h6>Search medium</h6>

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search">
        <div role="search">
          <label class="usa-sr-only" for="search-field">Search medium</label>
          <input id="search-field" type="search" name="search">
          <button type="submit">
            <span class="usa-search-submit-text">Search</span>
          </button>
        </div>
      </form>
    </div>
  </div>

  <h6>Search small</h6>

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search usa-search-small">
        <div role="search">
          <label class="usa-sr-only" for="search-field-small">Search small</label>
          <input id="search-field-small" type="search" name="search">
          <button type="submit">
            <span class="usa-sr-only">Search</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>As you customize this form template, ensure it continues to follow the <a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/elements/#inputs">accessibility guidelines for form controls</a>.</li>
    </ul>
    <ul class="usa-content-list">
      <li>Always include the word "search" inside the <code>&lt;button&gt;</code> element for screen readers. You can visually hide this text using the CSS class <code>usa-sr-only</code> or Sass mixin <code>@include sr-only;</code>.
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>There will always be users who are confused by your navigation system and who would benefit from being able to search your site.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>On single-page or very small sites, you may be able to get away without a search bar.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Allow the search bar to be as wide as possible, but a minimum of 27 characters wide. This allows users to enter multiple search terms and still be able to see all of them. The more users can see their search terms, the easier it is to review, verify, and submit their search query.</li>
      <li>The magnifying glass has been shown to be almost universally recognized by users as an indicator of search, and doesn’t need to be visually paired with the word "Search" as long as it remains for screen readers.</li>
      <li>Maintain this search bar when displaying the search results with the original search terms.</li>
      <li>On a site's home page the search function should appear as a search box instead of a link so users can locate it easily.</li>
      <li>Don't offer advanced search as the default option. The majority of people will do a simple search with one or two search terms. If advanced search is offered, it increases the likelihood of a person making a mistake in their query.</li>
      <li>Even if the search bar isn't visually displaying a label, the form field should include a label for screen reader users.</li>
      <li>The search button itself should be a submit button for the form to reduce the number of keystrokes required to use the form.</li>
    </ul>
  </div>
</div>
