---
layout: default
type: component
title: Headers & Navigation
---

<div class="preview">

  <h2>Header Nav Simple</h2>

  <header role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo-block" id="logo">
          <a href="javascript:void(0)" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list usa-unstyled-list">
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 3</a>
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

  <h2>Header Nav Complex</h2>

  <header role="banner">
    <div class="usa-grid">
      <div class="usa-nav usa-nav-complex">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo-block" id="logo">
          <a class="usa-logo-link" href="javascript:void(0)" accesskey="1" aria-label="Home">
            <img src="{{ site.baseurl }}/assets/img/gray-circle.png">
            <h1 class="usa-logo-title usa-complex-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
      
        <div class="usa-nav-search usa-width-one-third">
          <ul class="usa-unstyled-list usa-nav-links">
            <li>
              <a href="javascript:void(0)">Utility 1</a>
            </li>
            <li>
              <a href="javascript:void(0)">Utility 2</a>
            </li>
            <li>
              <a href="javascript:void(0)">Utility 3</a>
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
          <ul class="usa-nav-list usa-unstyled-list">
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 3</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>

  <div class="usa-grid">
    <ul class="usa-unstyled-list usa-list-breadcrumb">
      <li>
        <a href="javascript:void(0)">Home</a>
      </li>
      <li>
        <a href="javascript:void(0)">Topics</a>
      </li>
      <li class="usa-current">
        <span>Current Page</span>
      </li>
    </ul>
  </div>

  <h2>Header Nav Active</h2>

  <header role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo-block" id="logo">
          <a href="javascript:void(0)" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list usa-unstyled-list">
            <li class="usa-menu-item">
              <a class="current-menu-item" href="javascript:void(0)">Nav Link 1</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 3</a>
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

  <h2>Header Nav Dropdown</h2>

  <header role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo-block" id="logo">
          <a href="javascript:void(0)" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list usa-unstyled-list">
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 1</a>

              <ul class="usa-unstyled-list usa-sub-menu usa-active">
                <h3 class="usa-sub-menu-heading">Topic</h3>
                <li>
                  <a href="javascript:void(0)">Secondary link</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Secondary link</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Secondary link</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Secondary link</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Secondary link</a>
                </li>
              </ul>

            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 3</a>
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

  <h2 class="usa-mega_menu-example">Header Nav Mega Menu</h2>

  <header role="banner">
    <div class="usa-grid">
      <div class="usa-nav">
        <a class="usa-menu-btn" id="menu-btn" href="#">Menu</a>
        <div class="usa-logo-block" id="logo">
          <a href="javascript:void(0)" accesskey="1" aria-label="Home">
            <h1 class="usa-logo-title">Department of Web Standards</h1>
          </a>
        </div>
        <a class="usa-search-trigger" href="#">
        </a>
        <nav class="usa-nav-primary" role="navigation">
          <ul class="usa-nav-list usa-unstyled-list">
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 1</a>

              <ul class="usa-unstyled-list usa-sub-menu usa-sub-menu-mega">

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                  </ul>
                </li>

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                  </ul>
                </li>

                <li class="usa-sub-menu-item">
                  <ul>
                    <h3 class="usa-sub-menu-heading">Topic</h3>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                    <li>
                      <a href="javascript:void(0)">Secondary link</a>
                    </li>
                  </ul>
                </li>

              </ul>

            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 2</a>
            </li>
            <li class="usa-menu-item">
              <a href="javascript:void(0)">Nav Link 3</a>
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

  <h2>Side Nav</h2>

  <div class="usa-grid">
    <aside class="side_nav usa-width-one-fourth">
      <ul class="usa-sidenav-list usa-unstyled-list">
        <li>
          <a class="usa-current-page" href="javascript:void(0)">Current page</a>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
      </ul>
    </aside>
    <main class="usa-width-three-fourths">
    </main>
  </div>

  <h2>Side Nav with Sub Items</h2>
  <div class="usa-grid">
    <aside class="side_nav usa-width-one-fourth">
      <ul class="usa-sidenav-list usa-unstyled-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current-page" href="javascript:void(0)">Current page</a>

          <ul class="usa-nav-list-sub-list">
            <li>
              <a href="javascript:void(0)">Headers & Navigation</a>
            </li>
            <li>
              <a href="javascript:void(0)">Footers</a>
            </li>
            <li>
              <a href="javascript:void(0)">Buttons</a>
            </li>
            <li>
              <a href="javascript:void(0)">Tables</a>
            </li>
            <li>
              <a class="usa-current-page" href="javascript:void(0)">Accordion</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
      </ul>
    </aside>
    <main class="usa-width-three-fourths">
    </main>
  </div>

  <h2>Side Nav with Sub Items + Grandchild Items</h2>
  <div class="usa-grid">
    <aside class="side_nav usa-width-one-fourth">
      <ul class="usa-sidenav-list usa-unstyled-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current-page" href="javascript:void(0)">Current page</a>

          <ul class="usa-nav-list-sub-list">
            <li>
              <a href="javascript:void(0)">Headers & Navigation</a>
            </li>
            <li>
              <a href="javascript:void(0)">Footers</a>

              <ul class="usa-nav-list-sub-list usa-nav-list-sub-list-2">
                <li>
                  <a href="javascript:void(0)">Grandchild 1</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Grandchild 2</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Grandchild 3</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="javascript:void(0)">Buttons</a>
            </li>
            <li>
              <a href="javascript:void(0)">Tables</a>
            </li>
            <li>
              <a class="usa-current-page" href="javascript:void(0)">Accordion</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
      </ul>
    </aside>
    <main class="usa-width-three-fourths">
    </main>
  </div>

  <img src="{{ site.baseurl }}/assets/img/static/Headers_Navigation_UI_v2.png">
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