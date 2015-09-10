---
layout: styleguide
type: component
title: Form controls
lead: Intro text on what is included in this section and how to use it. No more than one or two sentences.
---

<h3 class="usa-heading">Accessibility</h3>

<p>As you customize form controls from this library, be sure they continue to meet the following accessibility requirements:</p>

<ul class="usa-content-list">
  <li>All form control tags should have an associated label. The labels for attribute value should match the related input <code>id</code> attribute and should also be unique to the entire page. For example, the input with <code>id="favorite-pie"</code> will always have a label with <code>for="favorite-pie"</code>. This way screen readers are able to perceive the relevant content.</li>
  <li>Any additional information – such as required, optional, or example text – should be wrapped within the label tags. For example: <code>&lt;label for="name"&gt;Favorite Pie &lt;span&gt;Optional&lt;/span&gt;&lt;/label&gt;</code>. This way screen readers know what additional information is related to each field.</li>
  <li>Do not replace <code>&lt;input&gt;</code> tag-based form controls with styled <code>&lt;div&gt;</code> tags or JavaScript that "fake" form controls. Form controls not written in semantic HTML are very difficult for screen readers to handle.</li>
  <li>If the color scheme of the buttons are adjusted ensure all states have a minimum contrast ratio of 4.5:1 (for small text, 3:1 for large) for all states of the button. This includes default, hover, selected, disabled.</li>
</ul>

<p>If you are a building a form with multiple controls, also consider the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines in the “Form Templates” section</a>.</p>

<h2 class="usa-heading" id="text-inputs">Text Input</h2>
<p class="usa-font-lead">Text inputs allow people to enter any combination of letters, numbers, or symbols of their choosing (unless otherwise restricted). Text input boxes can span single or multiple lines.</p>
<div class="preview">

  <label for="input-type-text">Text Input Label</label>
  <input id="input-type-text" name="input-type-text" type="text">

  <label for="input-focus">Text Input Focused</label>
  <input class="usa-input-focus" id="input-focus" name="input-focus" type="text">

  <div class="usa-input-error">
    <legend>
      <span for="input-error">Text Input Error</span>
      <span class="usa-input-error-message" role="alert">Helpful error message</span>
    </legend>
    <input id="input-error"  aria-describedby="usa-input-error-message" name="input-error" type="text">
  </div>

  <label for="input-success">Text Input Success</label>
  <input class="usa-input-success" id="input-success" name="input-success" type="text">

  <label for="input-type-textarea">Text Area Label</label>
  <textarea id="input-type-textarea" name="input-type-textarea"></textarea>

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="dropdown">Dropdown</h2>
<p class="usa-font-lead">A dropdown allows users to select one option from a list.</p>

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

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="checkboxes">Checkboxes</h2>
<p class="usa-font-lead">Checkboxes allow users to select one or more options from a visible list. </p>

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

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading">Radio buttons</h2>
<p class="usa-font-lead">Radio buttons allow users to see all available choices at once and select exactly one option.</p>

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

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="date-input">Date input</h2>
<p class="usa-font-lead">Three text fields are the easiest way for users to enter most dates. </p>

<div class="preview">

  <fieldset>
    <legend>Date of birth</legend>
    <span class="usa-form-hint usa-datefield-hint" id="dobHint">For example: 04 28 1986</span>

    <div class="usa-date-of-birth">
      <div class="usa-datefield usa-form-group usa-form-group-month">
        <label for="date_of_birth_1">Month</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_1" name="date_of_birth_1" pattern="0?[1-9]|1[012]" type="text" value="" maxlength="2">
      </div>
      <div class="usa-datefield usa-form-group usa-form-group-day">
        <label for="date_of_birth_2">Day</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_2" name="date_of_birth_2" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]" type="text" value="" maxlength="2">
      </div>
      <div class="usa-datefield usa-form-group usa-form-group-year">
        <label for="date_of_birth_3">Year</label>
        <input aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_3" name="date_of_birth_3" pattern="[0-9]{4}" type="text" value="" maxlength="4">
      </div>
    </div>
  </fieldset>
</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="range-slider">Range slider</h2>

<div class="preview">

  <label for="range-slider">Range Slider Label h4</label>
  <input id="range-slider" type="range" min="0" max="100">

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>
