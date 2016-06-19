---
layout: styleguide
type: component
title: Form controls
lead: Form controls allow users to enter information into a page.
---

<h3 class="usa-heading heading-margin-alt">Accessibility</h3>

<p>As you customize these templates, make sure they continue to meet the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for all form controls</a> as well as the accessibility guidelines for each individual control.</p>
<p>In addition, when creating forms with multiple controls or customizing these templates, be sure to:</p>

<ul class="usa-content-list">
  <li>Display form controls in the same order in HTML as they appear on screen. Do not use CSS to rearrange the form controls. Screen readers narrate forms in the order they appear in the HTML.</li>
  <li>Visually align validation messages with the input fields, so people using screen magnifiers can read them quickly.</li>
  <li>Group each set of thematically related controls in a fieldset element. Use the legend element to offer a label within each one. The fieldset and legend elements make it easier for screen reader users to navigate the form.</li>
  <li>Use a single legend for fieldset (this is required). One example of a common use of fieldset and legend is a question with radio button options for answers. The question text and radio buttons are wrapped in a fieldset, with the question itself being inside the legend tag.</li>
  <li>Embed multiple fieldsets and legends for more complex forms.</li>
  <li>Keep your form blocks in a vertical pattern. This approach is ideal, from an accessibility standpoint, because of limited vision that makes it hard to scan from right to left.</li>
</ul>

<h4>Supporting screen readers</h4>

<p><b>Note:</b> These code examples have been designed to support a range of screen readers. That said, they may not work with all versions.</p>

<h5>Known issues</h5>

<ul class="usa-content-list">
  <li>VoiceOver on iOS currently does not support fieldset and legend for forms. You can address this by using <code>aria-labeledby="for-attribute-of-label id-of-legend id-of-additional-info"</code> on each input in the fieldset. Using <code>aria-labeledby</code> will overwrite the default text read by the screen reader, so it is important to include all relevant information.</li>
  <li>VoiceOver on OS X currently does not support <code>aria-describedby</code>. Use <code>aria-labeledby</code> instead, and include all related fields, including, labels, legend, and hint text</li>
</ul>

<p>If you are a building a form with multiple controls, also consider the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines in the “Form Templates” section</a>.</p>

<h2 class="usa-heading" id="text-inputs">Text input</h2>
<p class="usa-font-lead">Text inputs allow people to enter any combination of letters, numbers, or symbols of their choosing (unless otherwise restricted). Text input boxes can span single or multiple lines.</p>
<div class="preview">

  <label for="input-type-text">Text input label</label>
  <input id="input-type-text" name="input-type-text" type="text">

  <label for="input-focus">Text input focused</label>
  <input class="usa-input-focus" id="input-focus" name="input-focus" type="text">

  <div class="usa-input-error">
    <label class="usa-input-error-label" for="input-error">Text input error</label>
    <span class="usa-input-error-message" id="input-error-message" role="alert">Helpful error message</span>
    <input id="input-error" name="input-error" type="text" aria-describedby="input-error-message">
  </div>

  <label for="input-success">Text input success</label>
  <input class="usa-input-success" id="input-success" name="input-success" type="text">

  <label for="input-type-textarea">Text area label</label>
  <textarea id="input-type-textarea" name="input-type-textarea"></textarea>

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>If you customize the text inputs, ensure they continue to meet the the <a href="{{ site.baseurl }}/form-controls/"> accessibility requirements that apply to all form controls.</a></p>
    <ul class="usa-content-list">
      <li>Avoid placeholder text for accessibility reasons. Most browsers’ default rendering of placeholder text does not provide a high enough contrast ratio.</li>
      <li>Avoid breaking numbers with distinct sections (such as phone numbers, Social Security Numbers, or credit card numbers) into separate input fields. For example, use one input for phone number, not three (one for area code, one for local code, and one for number). Each field needs to be labeled for a screen reader and the labels for fields broken into segments are often not meaningful.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>If you can’t reasonably predict a user’s answer to a prompt and there might be wide variability in users’ answers.</li>
      <li>When using another type of input will make answering more difficult. For example, birthdays and other known dates are easier to type in than they are to select from a calendar picker.</li>
      <li>When users want to be able to paste in a response.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>When users are choosing from a specific set of options.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>The length of the text input provides a hint to users as to how much text to write. Do not require users to write paragraphs of text into a single-line input box; use a text area instead.</li>
      <li>Text inputs are among the easiest type of input for desktop users but are more difficult for mobile users.</li>
      <li>Only show error validation messages or stylings after a user has interacted with a particular field.</li>
      <li>Avoid using placeholder text that appears within a text field before a user starts typing. If placeholder text is no longer visible after a user clicks into the field, users will no longer have that text available when they need to review their entries. (People who have cognitive or visual disabilities have additional problems with placeholder text.)</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="dropdown">Dropdown</h2>
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

<h2 class="usa-heading" id="checkboxes">Checkboxes</h2>
<p class="usa-font-lead">Checkboxes allow users to select one or more options from a visible list.</p>

<div class="preview">

  <fieldset class="usa-fieldset-inputs usa-sans">

    <legend class="usa-sr-only">Historical figures 1</legend>

    <ul class="usa-unstyled-list">
      <li>
        <input id="truth" type="checkbox" name="historical-figures-1" value="truth" checked>
        <label for="truth">Sojourner Truth</label>
      </li>
      <li>
        <input id="douglass" type="checkbox" name="historical-figures-1" value="douglass">
        <label for="douglass">Frederick Douglass</label>
      </li>
      <li>
        <input id="washington" type="checkbox" name="historical-figures-1" value="washington">
        <label for="washington">Booker T. Washington</label>
      </li>
      <li>
        <input id="carver" type="checkbox" name="historical-figures-1" disabled>
        <label for="carver">George Washington Carver</label>
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

<h2 class="usa-heading" id="radiobuttons">Radio buttons</h2>
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

<h2 class="usa-heading" id="date-input">Date input</h2>
<p class="usa-font-lead">Three text fields are the easiest way for users to enter most dates.</p>

<div class="preview">

  <fieldset>
    <legend>Date of birth</legend>
    <span class="usa-form-hint" id="dobHint">For example: 04 28 1986</span>

    <div class="usa-date-of-birth">
      <div class="usa-form-group usa-form-group-month">
        <label for="date_of_birth_1">Month</label>
        <input class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_1" name="date_of_birth_1" pattern="0?[1-9]|1[012]" type="number" min="1" max="12" value="">
      </div>
      <div class="usa-form-group usa-form-group-day">
        <label for="date_of_birth_2">Day</label>
        <input class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_2" name="date_of_birth_2" pattern="0?[1-9]|1[0-9]|2[0-9]|3[01]" type="number" min="1" max="31" value="">
      </div>
      <div class="usa-form-group usa-form-group-year">
        <label for="date_of_birth_3">Year</label>
        <input class="usa-input-inline" aria-describedby="dobHint" class="usa-form-control" id="date_of_birth_3" name="date_of_birth_3" pattern="[0-9]{4}" type="number" min="1900" max="2000" value="">
      </div>
    </div>
  </fieldset>
</div>

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
