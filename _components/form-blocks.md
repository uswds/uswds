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
        <!--[if IE 9]><select disabled style="display:none"><![endif]-->
        <option value="AL">Alabama</option>
        <option value="AK">Alaska</option>
        <option value="AZ">Arizona</option>
        <option value="AR">Arkansas</option>
        <option value="CA">California</option>
        <option value="CO">Colorado</option>
        <option value="CT">Connecticut</option>
        <option value="DE">Delaware</option>
        <option value="DC">District of Columbia</option>
        <option value="FL">Florida</option>
        <option value="GA">Georgia</option>
        <option value="HI">Hawaii</option>
        <option value="ID">Idaho</option>
        <option value="IL">Illinois</option>
        <option value="IN">Indiana</option>
        <option value="IA">Iowa</option>
        <option value="KS">Kansas</option>
        <option value="KY">Kentucky</option>
        <option value="LA">Louisiana</option>
        <option value="ME">Maine</option>
        <option value="MD">Maryland</option>
        <option value="MA">Massachusetts</option>
        <option value="MI">Michigan</option>
        <option value="MN">Minnesota</option>
        <option value="MS">Mississippi</option>
        <option value="MO">Missouri</option>
        <option value="MT">Montana</option>
        <option value="NE">Nebraska</option>
        <option value="NV">Nevada</option>
        <option value="NH">New Hampshire</option>
        <option value="NJ">New Jersey</option>
        <option value="NM">New Mexico</option>
        <option value="NY">New York</option>
        <option value="NC">North Carolina</option>
        <option value="ND">North Dakota</option>
        <option value="OH">Ohio</option>
        <option value="OK">Oklahoma</option>
        <option value="OR">Oregon</option>
        <option value="PA">Pennsylvania</option>
        <option value="RI">Rhode Island</option>
        <option value="SC">South Carolina</option>
        <option value="SD">South Dakota</option>
        <option value="TN">Tennessee</option>
        <option value="TX">Texas</option>
        <option value="UT">Utah</option>
        <option value="VT">Vermont</option>
        <option value="VA">Virginia</option>
        <option value="WA">Washington</option>
        <option value="WV">West Virginia</option>
        <option value="WI">Wisconsin</option>
        <option value="WY">Wyoming</option>
        <!--[if IE 9]></select><![endif]-->  
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
