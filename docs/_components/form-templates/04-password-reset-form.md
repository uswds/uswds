---
title: Password reset form
parent: Form templates
maturity: beta
order: 03
lead: A standard template for resetting a password
---

<div class="preview">

  <form class="usa-form">
    <fieldset>
      <legend class="usa-drop_text">Reset password</legend>
      <span class="usa-serif">Please enter your new password</span>

      <div class="usa-alert usa-alert-info">
        <div class="usa-alert-body">
          <h3 class="usa-alert-heading">Passwords must:</h3>
        </div>
        <ul class="usa-checklist" id="validation_list">
          <li data-validator="length">Be at least 8 characters</li>
          <li data-validator="uppercase">Have at least 1 uppercase character</li>
          <li data-validator="numerical">Have at least 1 numerical character</li>
          <li>Another requirement</li>
        </ul>
      </div>

      <label for="password">New password</label>
      <input id="password" name="password" type="password"
        aria-describedby="validation_list"
        class="js-validate_password"
        data-validate-length=".{8,}"
        data-validate-uppercase="[A-Z]"
        data-validate-numerical="\d"
        data-validation-element="#validation_list">

      <label for="confirmPassword">Confirm password</label>
      <input id="confirmPassword" name="confirmPassword" type="password">
      <p class="usa-form-note">
        <a title="Show my typing" href="#"
            class="usa-show_multipassword"
            aria-controls="password confirmPassword">
          Show my typing</a>
      </p>

      <input type="submit" value="Reset password" />
    </fieldset>
  </form>

</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>As you customize this form template, make sure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>To offer a way to easily reset a password any time users are able to sign in to your site.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>If users need a password to access your site, they will forget that password and need a way to reset it.</li>
      <li>State any password requirements (for example, “Must include one capital letter”) up front. Don’t leave users guessing about password requirements, only to hit them with an error message later.</li>
      <li>The requirements shown above are just provided as an example and should not be taken as recommendations.</li>
    </ul>
  </div>
</div>

