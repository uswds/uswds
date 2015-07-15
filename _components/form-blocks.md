---
layout: default
type: component
title: Forms Blocks
---

<div class="preview">
  <!-- Add HTML markup for example here -->

  <form class="usa-form-large">

    <label for="mailing-address-1">Mailing Address 1</label>
    <input id="mailing-address-1" name="mailing-address-1" type="text">

    <label for="mailing-address-2">Mailing Address 2 <span class="usa-additional_text">Optional</span></label>
    <input id="mailing-address-2" name="mailing-address-2" type="text">

    <div class="usa-input-grid-medium">
      <label for="city">City</label>
      <input id="city" name="city" type="text">
    </div>

    <div class="usa-input-grid-small">
      <label for="state">State</label>
      <input class="usa-input-dropdown" id="state" name="state" type="text" list="states">
      <datalist id="states">
        <option value="Alabama">
        <option value="Alaska">
        <option value="Arizona">
        <option value="Arkansas">
        <option value="California">
      </datalist>
    </div>

    <label for="zip">Zip</label>
    <input class="usa-input-medium" id="zip" name="zip" type="text" pattern="[\d]{5}(-[\d]{4})">

  </form>

  <img src="{{ site.baseurl }}/assets/img/static/USAddressForm_UI_v1.png">
</div>

<h2>Name</h2>

<div class="preview">

  <form>

    <label for="title">Title</label>
    <input class="usa-input-tiny" id="title" name="title" type="text">

    <label for="first-name">First Name <span class="usa-additional_text">Required</span></label>
    <input id="first-name" name="first-name" type="text">

    <label for="middle-name">Middle Name</label>
    <input id="middle-name" name="middle-name" type="text">

    <label for="last-name">Last Name <span class="usa-additional_text">Required</span></label>
    <input id="last-name" name="last-name" type="text">

    <label for="suffix">Suffix</label>
    <input class="usa-input-tiny" id="suffix" name="suffix" type="text">

  </form>

</div>

<h2>Social Security</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/SSN_UI_v1.png">
</div>

<h2>Login</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Login_UI_v1.png">
</div>

<h2>Password Reset</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/PasswordReset_UI_v1.png">
</div>

<h2>Contact Form</h2>

<div class="preview">
  <!-- Add HTML markup for example here -->
  <img src="{{ site.baseurl }}/assets/img/static/Contact-Form_UI_v1.png">
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
