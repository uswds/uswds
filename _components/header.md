---
layout: styleguide
type: component
title: Headers & Navigation
lead: This is the header nav
---

<div class="preview">

  <h2 class="usa-heading">Header Nav Simple</h2>

  <header class="usa-header" role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo" id="logo">
          <a href="#" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list">
            <li class="usa-menu-item">
              <a href="#">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 3</a>
            </li>
          </ul>
        </nav>
      
        <div class="usa-nav-search usa-width-one-third">
          <form class="usa-search usa-search-small">           
            <fieldset>
              <legend class="usa-sr-only">Search</legend>
              <label for="search-field-small">Search</label>
              <div class="usa-search-bar">
                <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
                <button class="usa-search-submit usa-search-submit-small" type="submit">
                  <span class="usa-sr-only">Search</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </header>

  <h2 class="usa-heading">Header Nav Complex</h2>

  <header class="usa-header" role="banner">
    <div class="usa-grid">
      <div class="usa-nav usa-nav-complex">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo" id="logo">
          <a class="usa-logo-link" href="#" accesskey="1" aria-label="Home">
            <img src="{{ site.baseurl }}/assets/img/gray-circle.png">
            <h1 class="usa-logo-title usa-complex-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
      
        <div class="usa-nav-search usa-width-one-third">
          <ul class="usa-nav-links">
            <li>
              <a href="#">Utility 1</a>
            </li>
            <li>
              <a href="#">Utility 2</a>
            </li>
            <li>
              <a href="#">Utility 3</a>
            </li>
          </ul>
          <form class="usa-search usa-search-small">           
            <fieldset>
              <legend class="usa-sr-only">Search</legend>
              <label for="search-field-small">Search</label>
              <div class="usa-search-bar">
                <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
                <button class="usa-search-submit usa-search-submit-small" type="submit">
                  <span class="usa-sr-only">Search</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
        <nav class="usa-nav-primary usa-nav-complex-primary" role="navigation">
          <ul class="usa-nav-list">
            <li class="usa-menu-item">
              <a href="#">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 3</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <div class="usa-grid">
    <ul class="usa-list-breadcrumb">
      <li>
        <a href="#">Home</a>
      </li>
      <li>
        <a href="#">Topics</a>
      </li>
      <li class="usa-current">
        <span>Current Page</span>
      </li>
    </ul>
  </div>

  <h2 class="usa-heading">Header Nav Active</h2>

  <header class="usa-header" role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo" id="logo">
          <a href="#" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list">
            <li class="usa-menu-item">
              <a class="current-menu-item" href="#">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 3</a>
            </li>
          </ul>
        </nav>

        <div class="usa-nav-search usa-width-one-third">
          <form class="usa-search usa-search-small">           
            <fieldset>
              <legend class="usa-sr-only">Search</legend>
              <label for="search-field-small">Search</label>
              <div class="usa-search-bar">
                <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
                <button class="usa-search-submit usa-search-submit-small" type="submit">
                  <span class="usa-sr-only">Search</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </header>

  <h2 class="usa-heading">Header Nav Dropdown</h2>

  <header class="usa-header" role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo" id="logo">
          <a href="#" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list">
            <li class="usa-menu-item">
              <a href="#">Nav Link 1</a>

              <ul class="usa-sub-menu usa-active">
                <h3 class="usa-sub-menu-heading">Topic</h3>
                <li>
                  <a href="#">Secondary link</a>
                </li>
                <li>
                  <a href="#">Secondary link</a>
                </li>
                <li>
                  <a href="#">Secondary link</a>
                </li>
                <li>
                  <a href="#">Secondary link</a>
                </li>
                <li>
                  <a href="#">Secondary link</a>
                </li>
              </ul>

            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 3</a>
            </li>
          </ul>
        </nav>

        <div class="usa-nav-search usa-width-one-third">
          <form class="usa-search usa-search-small">           
            <fieldset>
              <legend class="usa-sr-only">Search</legend>
              <label for="search-field-small">Search</label>
              <div class="usa-search-bar">
                <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
                <button class="usa-search-submit usa-search-submit-small" type="submit">
                  <span class="usa-sr-only">Search</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </header>

  <h2 class="usa-heading usa-mega_menu-example">Header Nav Mega Menu</h2>

  <header class="usa-header" role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo" id="logo">
          <a href="#" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list">
            <li class="usa-menu-item">
              <a href="#">Nav Link 1</a>

              <ul class="usa-sub-menu usa-sub-menu-mega">

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                  </ul>
                </li>

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                  </ul>
                </li>

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                    <li>
                      <a href="#">Secondary link</a>
                    </li>
                  </ul>
                </li>

              </ul>

            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="#">Nav Link 3</a>
            </li>
          </ul>
        </nav>

        <div class="usa-nav-search usa-width-one-third">
          <form class="usa-search usa-search-small">           
            <fieldset>
              <legend class="usa-sr-only">Search</legend>
              <label for="search-field-small">Search</label>
              <div class="usa-search-bar">
                <input class="usa-search-input-small" type="search" id="search-field-small" class="usa-search-field">
                <button class="usa-search-submit usa-search-submit-small" type="submit">
                  <span class="usa-sr-only">Search</span>
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </header>

</div>

<div class="usa-grid">
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Use</h3>
    <p>This is the usage content for the example.</p>
  </div>
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>  
</div>
