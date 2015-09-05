---
layout: styleguide
type: component
title: Side navigation
lead: Intro text on what is included in this section and how to use it. No more than one or two sentences.
---

<div class="preview">
  
  <h2 class="usa-heading">Sidenav</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
        <li>
          <a class="usa-current" href="javascript:void(0)">Current page</a>
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

  <h2 class="usa-heading">Sidenav with sub items</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current" href="javascript:void(0)">Current page</a>
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
              <a class="usa-current" href="javascript:void(0)">Accordion</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
      </ul>
    </aside>
  </div>

  <h2 class="usa-heading">Sidenav with sub items + grandchild items</h2>

  <div class="usa-grid">
    <aside class="usa-width-one-fourth">
      <ul class="usa-sidenav-list">
        <li>
          <a href="javascript:void(0)">Secondary link</a>
        </li>
        <li>
          <a class="usa-current" href="javascript:void(0)">Current page</a>
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
                  <a class="usa-current" href="javascript:void(0)">Grandchild 3</a>
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

</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h3>
    <h5>When to use</h4>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h4>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h4>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>
