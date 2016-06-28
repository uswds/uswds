---
type: component
title: Dropdown
maturity: beta
parent: Form controls
order: 02
---

<p class="usa-font-lead">A dropdown allows users to select one option from a list.</p>

<div class="preview">
<form class="usa-form">
  <label for="options">Dropdown label</label>
  <select name="options" id="options">
    <option value="value1">Option A</option>
    <option value="value2">Option B</option>
    <option value="value3">Option C</option>
  </select>
</form>
</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>If you customize the dropdown, ensure it continues to meet the the <a href="{{ site.baseurl }}/form-controls/"> accessibility requirements that apply to all form controls.</a></p>
    <ul class="usa-content-list">
      <li>Make sure your dropdown has a label. Don’t replace it with the default menu option (for example, removing the “State” label and just having the dropdown read “Select a state” by default).</li>
      <li>Don’t use JavaScript to automatically submit the form (or do anything else) when an option is selected. Auto-submission disrupts screen readers because they select each option as they read them.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Use sparingly — only when a user needs to choose from about seven to 15 possible options and you have limited space to display the options.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If the list of options is very short. Use radio buttons instead.</li>
      <li>If the list of options is very long. Let users type the same information into a text input that suggests possible options instead.</li>
      <li>If you need to allow users to select more than one option at once. Users often don’t understand how to select multiple items from dropdowns. Use checkboxes instead.</li>
      <li>For site navigation (use the navigation components instead).</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Test dropdowns thoroughly with members of your target audience. Several usability experts suggest they should be the “UI of last resort.” Many users find them confusing and difficult to use.</li>
      <li>Avoid making options in one dropdown menu change based on the input to another. Users often don’t understand how selecting an item in one impacts another.</li>
      <li>When most users will (or should) pick a particular option, make it the default: <code>&lt;option selected=<wbr>"selected"&gt;Default<wbr>&lt;/option&gt;</code></li>
      <li>Don’t use JavaScript to automatically submit the form (or do anything else) when an option is selected. Offer a “submit” button at the end of the form instead. Users often change their choices multiple times. Auto-submission is also less accessible.</li>
    </ul>
  </div>
</div>
