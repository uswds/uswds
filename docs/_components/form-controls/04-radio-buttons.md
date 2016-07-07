---
type: component
title: Radio buttons
maturity: beta
parent: Form controls
order: 04
---

<p class="usa-font-lead">Radio buttons allow users to see all available choices at once and select exactly one option.</p>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Historical figures 2</legend>

    <ul class="usa-unstyled-list">
      <li>
        <input id="stanton" type="radio" checked name="historical-figures-2" value="stanton">
        <label for="stanton">Elizabeth Cady Stanton</label>
      </li>
      <li>
        <input id="anthony" type="radio" name="historical-figures-2" value="anthony">
        <label for="anthony">Susan B. Anthony</label>
      </li>
      <li>
        <input id="tubman" type="radio" name="historical-figures-2" value="tubman">
        <label for="tubman">Harriet Tubman</label>
      </li>
    </ul>

  </fieldset>

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>If you customize the radio buttons, ensure they continue to meet the the <a href="{{ site.baseurl }}/form-controls/"> accessibility requirements that apply to all form controls.</a></p>
    <ul class="usa-content-list">
      <li>Group related radio buttons together with <code>&lt;fieldset></code> and describe the group with <code>&lt;legend&gt;</code>.</li>
      <li>Each radio button should have a <code>&lt;label&gt;</code>. Associate the two by matching the <code>&lt;label&gt;</code>’s for attribute to the <code>&lt;input&gt;</code>’s <code>id</code> attribute.</li>
      <li>The <code>title</code> attribute can replace <code>&lt;label&gt;</code>.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When users need to select only one option out of a set of mutually exclusive choices.</li>
      <li>When the number of available options can fit onto a mobile screen.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>Consider checkboxes if  users need to select more than one option or if there is only one item to select.</li>
      <li>Consider a  dropdown if you don’t have enough space to list out all available options.</li>
      <li>If users should be able to select zero of the options.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Users should be able to tap on or click on either the text "label" or the radio button to select or deselect an option.</li>
      <li>Options that are listed vertically are easier to read than those that are listed horizontally. Horizontal listings can make it difficult to tell which label pertains to which radio button.</li>
      <li>If you customize, make sure selections are adequately spaced for touch screens.</li>
      <li>Use caution if you decide to set a default value. Setting a default value can discourage users from making conscious decisions, seem pushy, or alienate users who don’t fit into your assumptions. If you are unsure, leave nothing selected by default.</li>
    </ul>
  </div>
</div>
