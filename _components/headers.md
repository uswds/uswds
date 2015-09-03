---
layout: default
type: component
title: Headers & Navigation
---

<div class="preview">
  
  <h2 class="usa-heading">Side Nav</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
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
  </div>

  <h2 class="usa-heading">Side Nav with Sub Items</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current-page" href="javascript:void(0)">Current page</a>
          <ul class="usa-sidenav-sub_list">
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
  </div>

  <h2 class="usa-heading">Side Nav with Sub Items + Grandchild Items</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current-page" href="javascript:void(0)">Current page</a>
          <ul class="usa-sidenav-sub_list">
            <li>
              <a href="javascript:void(0)">Headers & Navigation</a>
            </li>
            <li>
              <a href="javascript:void(0)">Footers</a>
              <ul class="usa-sidenav-sub_list">
                <li>
                  <a href="javascript:void(0)">Grandchild 1</a>
                </li>
                <li>
                  <a href="javascript:void(0)">Grandchild 2</a>
                </li>
                <li>
                  <a class="usa-current-page" href="javascript:void(0)">Grandchild 3</a>
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
              <a href="javascript:void(0)">Accordion</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
      </ul>
    </aside>
  </div>

  <img src="{{ site.baseurl }}/assets/img/static/Headers_Navigation_UI_v2.png">
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h3 class="usa-heading">Use</h3>
    <p>This is the usage content for the example.</p>

    <h3 class="usa-heading">Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>
</div>
