---
layout: styleguide
type: component
title: Search Bar
lead: Intro text on what is included in this section and how to use it. No more than one or two sentences.
---

<div class="preview preview-search-bar">

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search usa-search-big">
        <label for="search-field-big">Search Big</label>
        <input type="search" id="search-field-big">
        <button type="submit">
          <span class="usa-search-submit-text">Search</span>
        </button>
      </form>
    </div>
  </div>

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search">
        <label for="search-field">Search Medium</label>
        <input type="search" id="search-field">
        <button type="submit">
          <span class="usa-search-submit-text">Search</span>
        </button>
      </form>
    </div>
  </div>

  <div class="usa-grid">
    <div class="usa-width-one-half">
      <form class="usa-search usa-search-small">
        <label for="search-field-small">Search Small</label>
        <input type="search" id="search-field-small">
        <button type="submit">
          <span class="usa-sr-only">Search</span>
        </button>
      </form>
    </div>
  </div>

</div>

<div class="usa-grid">
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Allow the search bar to be as wide as possible, but a minimum of 27 characters wide. This allows users to enter multiple search terms without their inputs being obscured. The more users can see their search terms, the easier it is to review, verify, and submit their search query.</li>
      <li>The magnifying glass has been shown to be almost universally recognized by users as an indicator of search functionality and doesn’t need to be paired with the word "Search" (except for screen readers, see the accessibility guidelines).</li>
      <li>Maintain this search bar when displaying the search results with the original search terms.</li>
      <li>On a site's home page the search function should appear as a search box instead of a link so users can locate it easily.</li>
      <li>Don't offer advanced search as the default option. The majority of people will do a simple search with one or two search terms. If advanced search is offered, it increases the likelihood of a person making a mistake in their query.</li>
      <li>Even if the search bar isn't using a label, the form field should include a label for screen reader users.</li>
      <li>The search button itself should be a submit button for the form to reduce the number of keystrokes required to use the form.</li>
    </ul>
  </div>
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>We also recommend:</p>
    <ul>
      <li>Always include the word "search" inside the <code>&lt;button&gt;</code> element for screen readers. You can hide this text with <code>position: absolute; left: -999em;</code> (as we have here).
    </ul>
  </div>
</div>
