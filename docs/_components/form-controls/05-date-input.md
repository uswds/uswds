---
title: Date input
parent: Form controls
maturity: alpha
order: 05
lead: Three text fields are the easiest way for users to enter most dates.
---

{% include code/preview.html component="date-input" %}
{% include code/accordion.html component="date-input" %}
<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Implementation</h4>
      <p>Currently, the max limit for the year input is set to 2000, but it should be changed depending on the context of the form.</p>
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>These text fields should follow the <a href="{{ site.baseurl }}/form-controls/#text-inputs"> accessibility guidelines for all text inputs.</a></li>
      <li>Do not use JavaScript to auto advance the focus from one field to the next. This makes it difficult for keyboard-only users to navigate and correct mistakes.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Use this format for most dates, particularly memorized dates.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If users are trying to schedule something, a calendar picker might make more sense. Be sure to also provide an option for text entry as well.</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Be sure each field is properly labeled — some countries enter dates in day, month, year order.</li>
      <li>It may be tempting to switch all or some of these text fields to drop downs, but these tend to be more difficult to use than text boxes.</li>
    </ul>
  </div>
</div>
