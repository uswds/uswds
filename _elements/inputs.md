---
layout: default
type: component
title: Inputs
---

<h3>Accessibility</h3>

<p>As you customize form controls from this library, be sure they continue to meet the following accessibility requirements:</p>

<ul>
  <li>All  form control tags  should have an associated label. The label’s value for the <code>for</code> attribute should exactly match the value for the input’s <code>id</code> attribute. For example, the input with <code>id="favorite-pie"</code> will always have a label with <code>for="favorite-pie"</code>. This way screen readers are able to perceive the relevant content.</li>
  <li>Any additional information – such as required, optional, or example text – should be wrapped within the label tags. For example: <code>&lt;label for="name"&gt;Favorite Pie &lt;span&gt;Optional&lt;/span&gt;&lt;/label&gt;</code>. This way screen readers know what additional information is related to each field.</li>
  <li>Do not replace <code>&lt;input&gt;</code> tag-based form controls with styled <code>&lt;div&gt;</code> tags or JavaScript that "fake" form controls. Form controls not written in semantic HTML are very difficult for screen readers to handle.</li>
</ul>

<p>If you are a building a form with multiple controls, also consider the <a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines in the “Common Form Templates” section</a>.</p>

<div class="preview">

  <label for="input-type-text">Text input label</label>
  <input type="text" name="input-type-text">

  <label for="input-focus">Text input focused</label>
  <input class="usa-input-focus" type="text" name="input-focus">

  <label for="input-error">Text input error</label>
  <input class="usa-input-error" type="text" name="input-error">

  <label for="input-success">Text input success</label>
  <input class="usa-input-success" type="text" name="input-success">

  <h2>Text Area</h2>
  <label for="input-type-textarea">Text area label</label>
  <textarea name="input-type-textarea"></textarea>

</div>

<h2>Checkboxes</h2>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Best pies</legend>

    <ul class="usa-unstyled-list">
      <li>
        <label for="apple-pie" class="usa-checkbox">
          <input id="apple-pie" type="checkbox" name="apple-pie" value="apple-pie" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Apple pie
        </label>
      </li>
      <li>
        <label for="key-lime-pie" class="usa-checkbox">
          <input id="key-lime-pie" type="checkbox" name="key-lime-pie" value="key-lime-pie" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Key lime pie
        </label>
      </li>
      <li>
        <label for="peach-pie" class="usa-checkbox">
          <input id="peach-pie" type="checkbox" name="peach-pie" value="peach-pie" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Peach pie
        </label>
      </li>
    </ul>

  </fieldset>

</div>

<h2>Radio Buttons</h2>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Radio buttons</legend>

    <ul class="usa-unstyled-list">
      <li>
        <label for="pea-soup" class="usa-radio">
          <input id="pea-soup" type="radio" checked name="soup" value="pea" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Pea soup
        </label>
      </li>
      <li>
        <label for="chicken-noodle" class="usa-radio">
          <input id="chicken-noodle" type="radio" name="soup" value="chicken-noodle" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Chicken noodle
        </label>
      </li>
      <li>
        <label for="tomato" class="usa-radio">
          <input id="tomato" type="radio" name="soup" value="tomato" tabindex="0">
          <span tabindex="-1" class="usa-checkbox-focus"></span>Tomato
        </label>
      </li>
    </ul>

  </fieldset>

</div>

<h2>Range slider</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Range_Slider_UI_v1.png">
</div>

<h2>Dropdown</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Dropdown_UI_v1.png">
</div>

<h2>Date picker</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Date_Picker_UI_v1.png">
</div>

<div class="usa-grid-box">
  <div class="usa-width-one-half">
    <h3>Use</h3>
    <p>This is the usage content for the example.</p>
  </div>
  <div class="usa-width-one-half">
    <h3>Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>  
</div>