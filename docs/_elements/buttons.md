---
layout: styleguide
type: element
title: Buttons
lead: Use buttons to signal actions. 
---

<div class="preview">
  
  <h6>Primary Buttons</h6>
  <div class="button_wrapper">
    <button>Default</button>
    <button class="usa-button-active">Active</button>
    <button class="usa-button-hover">Hover</button>
  </div>
  <div class="button_wrapper">
    <button class="usa-button-primary-alt">Default</button>
    <button class="usa-button-primary-alt usa-button-active">Active</button>
    <button class="usa-button-primary-alt usa-button-hover">Hover</button>
  </div>

  <h6>Secondary Buttons</h6>
  <div class="button_wrapper">
    <button class="usa-button-secondary">Default</button>
    <button class="usa-button-secondary usa-button-active">Active</button>
    <button class="usa-button-secondary usa-button-hover">Hover</button>
  </div>

  <div class="button_wrapper">
    <button class="usa-button-gray">Default</button>
    <button class="usa-button-gray usa-button-active">Active</button>
    <button class="usa-button-gray usa-button-hover">Hover</button>
  </div>

  <div class="button_wrapper">
    <button class="usa-button-outline" type="button">Default</button>
    <button class="usa-button-outline usa-button-active">Active</button>
    <button class="usa-button-outline usa-button-hover">Hover</button>
  </div>

  <div class="button_wrapper button_wrapper-dark">
    <button class="usa-button-outline-inverse" type="button">Default</button>
    <button class="usa-button-outline-inverse usa-button-active">Active</button>
    <button class="usa-button-outline-inverse usa-button-hover">Hover</button>
  </div>

  <h6>Button Focus</h6>
  <div class="button_wrapper">
    <button class="usa-button-focus">Default</button>
    <button class="usa-button-primary-alt usa-button-focus">Default</button>
    <button class="usa-button-secondary usa-button-focus">Default</button>
  </div>

  <h6>Disabled Button</h6>
  <div class="button_wrapper">
    <button class="usa-button-disabled" disabled>Default</button>
  </div>

  <h6>Big Button</h6>
  <div class="button_wrapper">
    <button class="usa-button-big" type="button">Default</button>
  </div>

</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Implementation</h4>
    <p>The examples demonstrate how to use button elements. To use a button style on an anchor link, add the <code>usa-button</code> class to your anchor link. 
    <p>To use a different style button on your anchor link, add the special button class in addition to <code>usa-button</code>:</p>
    <ul>
      <li><code>usa-button-primary-alt</code></li>
      <li><code>usa-button-secondary</code></li>
      <li><code>usa-button-gray</code></li>
      <li><code>usa-button-outline</code></li>
      <li><code>usa-button-outline-inverse</code></li>
      <li><code>usa-button-disabled</code></li>
      <li><code>usa-button-big</code></li>
    </ul>
    <p>For example, a secondary button style would use the following code:
    <code>&lt;a class="usa-button usa-button-secondary" href="/my-link"&gt;My button&lt;/a&gt;</code></p>
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Buttons should display a visible focus state when users tab to them.</li>
      <li>Avoid using <code>&lt;div&gt;</code> or <code>&lt;img&gt;</code> tags to create buttons. Screen readers don't automatically know either is a usable button.</li>
      <li>When styling links to look like buttons, remember that screen readers handle links slightly differently than they do buttons. Pressing the Space key triggers a button, but pressing the Enter key triggers a link.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Use buttons for the most important actions you want users to take on your site, such as "download," "sign up," or "log out."</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If you want to lead users between pages of a website. Use links instead.</li>
      <li>Less popular or less important actions may be visually styled as links.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Generally, use primary buttons for actions that go to the next step and use secondary buttons for actions that happen on the current page.</li>
      <li>Style the button most users should click in a way that distinguishes from other buttons on the page. Try using the  “large button” or the most visually distinct fill color.</li>
      <li>Make sure buttons should look clickable—use color variations to distinguish static, hover and active states.</li>
      <li>Avoid using too many buttons on a page.</li>
      <li>Use sentence case for button labels. </li>
      <li>Button labels should be as short as possible with “trigger words” that your users will recognize to clearly explain what will happen when the button is clicked (for example, “download,” “view” or “sign up”).</li>
      <li>Make the first word of the button’s label a verb. For example, instead of “Complaint Filing” label the button “File a complaint.”</li>
      <li>At times, consider adding an icon to signal specific actions (“download”, “open in a new window”, etc). </li>
    </ul>
  </div>
</div>
