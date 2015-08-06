---
layout: default
type: component
title: Headers & Navigation
---

<div class="preview">

  <h2>Header Nav Simple</h2>

  <header role="banner">
    <a href="#" id="menu-btn">&#9776; MENU</a>
    <div id="logo">
      <a href="javascript:void(0)" accesskey="1" aria-label="Home">
        <h1 class="usa-header-title">Name of Agency</h1>
      </a>
    </div>
    <nav class="usa-nav-primary" role="navigation">
      <ul class="usa-nav-list usa-unstyled-list">
        <li>
          <a href="javascript:void(0)">Nav Link 1</a>
        </li>
        <li>
          <a href="javascript:void(0)">Nav Link 2</a>
        </li>
        <li>
          <a href="javascript:void(0)">Nav Link 3</a>
        </li>
      </ul>
    </nav>
    <form class="usa-search usa-search-small">           
      <fieldset>
        <legend class="usa-sr-only">Search</legend>
        <label for="search-field-small">Search Small</label>
        <div class="usa-search-bar">
          <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
          <button class="usa-search-submit usa-search-submit-small" type="submit">
            <span class="usa-sr-only">Search</span>
          </button>
        </div>
      </fieldset>
    </form>
  </header>

  <img src="{{ site.baseurl }}/assets/img/static/HeaderNav_FullUI_v1-930width.png">
</div>

<div class="usa-grid">
  <div class="usa-width-one-half">
    <h3>Use</h3>
    <p>This is the usage content for the example.</p>
  </div>
  <div class="usa-width-one-half">
    <h3>Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>  
</div>