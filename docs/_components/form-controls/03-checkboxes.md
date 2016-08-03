---
title: Checkboxes
parent: Form controls
maturity: alpha
order: 03
lead: Checkboxes allow users to select one or more options from a visible list.
---


{% include code/preview.html component="checkboxes" %}
{% include code/accordion.html component="checkboxes" %}
<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>If you customize the text inputs, ensure they continue to meet the the <a href="{{ site.baseurl }}/form-controls/"> accessibility requirements that apply to all form controls.</a></p>
    <ul class="usa-content-list">
      <li>Surround a related set of checkboxes with a <code>&lt;fieldset&gt;</code>. The <code>&lt;legend&gt;</code> provides context for the grouping. Do not use fieldset and legend for a single check.</li>
      <li>The custom checkboxes here are accessible to screen readers because the default checkboxes are moved off-screen with <code>position: absolute; left: -999em</code>.</li>
      <li>Each input should have a semantic <code>id</code> attribute, and its corresponding label should have the same value in it’s <code>for</code> attribute.</li>
      <li>The <code>title</code> attribute can replace <code>&lt;label&gt;</code>.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When a user can select any number of choices from a set list.</li>
      <li>When a user needs to choose “yes” or “no” on only one option (use a stand-alone checkbox). For example, to toggle a setting on or off.</li>
      <li>When users need to see all the available options at a glance.</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>If there are too many options to display on a mobile screen.</li>
      <li>If a user can only select one option from a list (use radio buttons instead).</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Users should be able to tap on or click on either the text label or the checkbox to select or deselect an option.</li>
      <li>List options vertically if possible; horizontal listings can make it difficult to tell which label pertains to which checkbox.</li>
      <li>Avoid using negative language in labels as they can be counterintuitive. For example, “I want to receive a promotional email” instead of “I don’t want to receive promotional email.”</li>
      <li>If you customize, make sure selections are adequately spaced for touch screens.</li>
    </ul>
  </div>
</div>
