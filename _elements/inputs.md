---
layout: default
type: component
title: Inputs
---

<h3>Accessibility</h3>

<p>As you customize form controls from this library, be sure they continue to meet the following accessibility requirements:</p>

<ul>
  <li>All form control tags should have an associated label. The labels for attribute value should match the related input <code>id</code> attribute and should also be unique to the entire page. For example, the input with <code>id="favorite-pie"</code> will always have a label with <code>for="favorite-pie"</code>. This way screen readers are able to perceive the relevant content.</li>
  <li>Any additional information – such as required, optional, or example text – should be wrapped within the label tags. For example: <code>&lt;label for="name"&gt;Favorite Pie &lt;span&gt;Optional&lt;/span&gt;&lt;/label&gt;</code>. This way screen readers know what additional information is related to each field.</li>
  <li>Do not replace <code>&lt;input&gt;</code> tag-based form controls with styled <code>&lt;div&gt;</code> tags or JavaScript that "fake" form controls. Form controls not written in semantic HTML are very difficult for screen readers to handle.</li>
  <li>If the color scheme of the buttons are adjusted ensure all states have a minimum contrast ratio of 4.5:1 (for small text, 3:1 for large) for all states of the button. This includes default, hover, selected, disabled.</li>
</ul>

<p>If you are a building a form with multiple controls, also consider the <a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines in the “Common Form Templates” section</a>.</p>

<div class="preview">

  <label for="input-type-text">Text Input Label</label>
  <input id="input-type-text" name="input-type-text" type="text">

  <label for="input-focus">Text Input Focused</label>
  <input class="usa-input-focus" id="input-focus" name="input-focus" type="text">

  <label for="input-error">Text Input Error</label>
  <input class="usa-input-error" id="input-error" name="input-error" type="text">

  <label for="input-success">Text Input Success</label>
  <input class="usa-input-success" id="input-success" name="input-success" type="text">

  <h2>Text Area</h2>
  <label for="input-type-textarea">Text Area Label</label>
  <textarea id="input-type-textarea" name="input-type-textarea"></textarea>

</div>

<h2>Checkboxes</h2>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Best pies</legend>

    <ul class="usa-unstyled-list">
      <li>
        <input id="apple-pie" type="checkbox" name="apple-pie" value="apple-pie" tabindex="0" checked />
        <label for="apple-pie">Apple pie</label>
      </li>
      <li>
        <input id="key-lime-pie" type="checkbox" name="key-lime-pie" value="key-lime-pie" tabindex="0">
        <label for="key-lime-pie">Key lime</label>
      </li>
      <li>
        <input id="peach-pie" type="checkbox" name="peach-pie" value="peach-pie" tabindex="0">
        <label for="peach-pie">Peach pie</label>
      </li>
      <li>
        <input id="disabled" type="checkbox" disabled />
        <label for="disabled">Disabled</label>
      </li>
    </ul>

  </fieldset>

</div>

<h2>Radio buttons</h2>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Best pies</legend>

    <ul class="usa-unstyled-list">
      <li>
        <input id="pea-soup" type="radio" checked name="soup" value="pea" tabindex="0">
        <label for="pea-soup">Pea soup</label>
      </li>
      <li>
        <input id="chicken-noodle" type="radio" name="soup" value="chicken-noodle" tabindex="0">
        <label for="chicken-noodle">Chicken noodle</label>
      </li>
      <li>
        <input id="tomato" type="radio" name="soup" value="tomato" tabindex="0">
        <label for="tomato">Tomato</label>
      </li>
    </ul>

  </fieldset>

</div>

<h2>Range slider</h2>

<div class="preview">

  <label for="range-slider">Range Slider Label h4</label>
  <input id="range-slider" type="range" min="0" max="100">

</div>

<h2>Dropdown</h2>

<div class="preview">
<form>
  <label for="options">Dropdown Label h4</label>
  <select name="options" id="options">
    <option value="value1">Option A</option>
    <option value="value2">Option B</option>
    <option value="value3">Option C</option>
  </select>
</form>
</div>

<h2>Date picker</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Date_Picker_UI_v1.png">
</div>

<h2>Memorable Dates</h2>

<div class="preview">

  <fieldset>
    <legend>
      Date of birth
      <span class="usa-validation-message"></span>
    </legend>
    <div class="usa-date-of-birth">
      <p class="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</p>
      <div class="usa-datefield usa-form-group usa-form-group-month">
        <label for="date_of_birth_1">Month</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_1" max="12" min="1" name="date_of_birth_1" pattern="[0-9]*" type="number" value="">
      </div>
      <div class="usa-datefield usa-form-group usa-form-group-day">
        <label for="date_of_birth_2">Day</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_2" max="31" min="1" name="date_of_birth_2" pattern="[0-9]*" type="number" value="">
      </div>
      <div class="usa-datefield usa-form-group usa-form-group-year">
        <label for="date_of_birth_3">Year</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_3" max="2015" min="1900" name="date_of_birth_3" pattern="[0-9]*" type="number" value="">
      </div>
    </div>
  </fieldset>

</div>

<div class="usa-grid">
  <div class="usa-width-one-half">
    <h3>Use</h3>
    <p>This is the usage content for the example.</p>
  </div>
  <div class="usa-width-one-half">
    <h3>Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>  
</div>
