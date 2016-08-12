---
type: component
title: Links
maturity: alpha
parent: typography
order: 04
---

<!-- Links section begin -->

<p class="usa-font-lead">Links lead users to a different page or further information.
</p>

{% include code/preview.html component="links" %}
{% include code/accordion.html component="links" %}
<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Users should be able to tab to navigate between links.
      <li>Users should be able to activate a link when pressing ‘Enter’ on their keyboard.</li>
      <li>Users should be able to identify links without relying on color alone.</li>
      <li>Users should be able to activate hover and focus states with both a mouse and a keyboard.</li>
    </ul>
  </div>
</div>
