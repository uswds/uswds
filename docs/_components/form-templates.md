---
layout: styleguide
type: component
title: Form templates
lead: Patterns for some of the most commonly used forms on government websites
---

<h3 class="usa-heading">Accessibility</h3>

<p>As you customize these templates, ensure they continue to meet the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for all form controls</a> as well as the accessibility guidelines for each individual control.</p>
<p>In addition, when creating forms with multiple controls or customizing these templates, be sure to:</p>

<ul class="usa-content-list">
  <li>Display form controls in the same order in HTML as they do on screen. Do not use CSS to rearrange the form controls. Screen readers narrate forms in the order they appear in the HTML.</li>
  <li>Visually align validation messages with the input fields, so people using screen magnifiers can read them quickly.</li>
  <li>Group each set of thematically related controls in a fieldset element. Use the legend element to offer a label within each one. The fieldset and legend elements make it easier for screen reader users to navigate the form.</li>
  <li>A single legend is always required for fieldset. A common use of fieldset and legend is a question with radio button options for answers. The question text and radio buttons are wrapped in a fieldset, with the question itself being inside the legend tag.</li>
  <li>You can embed multiple fieldsets and legends for more complex forms.</li>
  <li>Keep your form blocks in a vertical pattern. It's an ideal approach for accessibility, due to limited vision that makes it hard to scan from right to left.</li>
</ul>

<h2 class="usa-heading" id="name-form">Name form</h2>
<p class="usa-font-lead">A standard template for collecting a person’s full name</p>

<div class="preview">

  <form>
    <fieldset>
      <legend>Name</legend>
      <label for="title">Title</label>
      <input class="usa-input-tiny" id="title" name="title" type="text">

      <label for="first-name">First name <span class="usa-additional_text">Required</span></label>
      <input id="first-name" name="first-name" type="text" required="" aria-required="true">

      <label for="middle-name">Middle name</label>
      <input id="middle-name" name="middle-name" type="text">

      <label for="last-name">Last name <span class="usa-additional_text">Required</span></label>
      <input id="last-name" name="last-name" type="text" required="" aria-required="true">

      <label for="suffix">Suffix</label>
      <input class="usa-input-tiny" id="suffix" name="suffix" type="text">
    </fieldset>
  </form>

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>As you customize this form template, ensure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When you need to collect users’ full names and store the parts separately in a database.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If you don’t need to parse out the separate pieces of a person’s name, consider letting them enter it into a single text field.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Leave the title and suffix fields as text boxes instead of offering drop downs. There are many possible titles and suffixes; text boxes accommodate them all.</li>
      <li>Do not restrict the types of characters users can enter in any of these fields. Names can include characters outside the standard Roman alphabet.</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="address-form">Address form</h2>
<p class="usa-font-lead">A standard template for entering a U.S. mailing or shipping address</p>

<div class="preview">

  <form class="usa-form-large">
    <fieldset>
      <legend>Mailing address</legend>
      <label for="mailing-address-1">Street address 1</label>
      <input id="mailing-address-1" name="mailing-address-1" type="text">

      <label for="mailing-address-2">Street address 2 <span class="usa-additional_text">Optional</span></label>
      <input id="mailing-address-2" name="mailing-address-2" type="text">

      <div>
        <div class="usa-input-grid usa-input-grid-medium">
          <label for="city">City</label>
          <input id="city" name="city" type="text">
        </div>

        <div class="usa-input-grid usa-input-grid-small">
          <label for="state">State</label>
          <select id="state" name="state" type="text">
            <option value></option>
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
          </select>
        </div>
      </div>

      <label for="zip">ZIP</label>
      <input class="usa-input-medium" id="zip" name="zip" type="text" pattern="[\d]{5}(-[\d]{4})?" data-grouplength="5,4" data-delimiter="-" data-politespace>
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
      <li>As you customize this form template, ensure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
      <li>Ensure that the input masking on the ZIP field, which inserts a hyphen before the four-digit extension, is accessible to people using screen readers. We use <a href="https://github.com/filamentgroup/politespace">Filament Group's Politespace</a>.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When you need to be able to parse out the specific parts of a mailing address.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If you need to collect addresses that may not fit this format (for example, international addresses).</li>
      <li> If you don’t need to be able to parse out the individual pieces of an address, consider letting users type the whole thing in one large text area. </li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Only label the optional inputs. Users can infer that all the others are required.</li>
      <li>If possible, let users type their state’s abbreviation when they reach the “state” drop down menu.</li>
      <li>Support both five and nine digit ZIP codes. Some addresses require a nine digit ZIP code. The input mask should be “#####-####” so that the text is properly formatted, regardless of whether a user enters a five or nine digit ZIP code.</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="login-form">Sign-in form</h2>
<p class="usa-font-lead">A template for signing a user into a website or app</p>

<div class="preview">

  <form>
    <fieldset>
      <legend class="usa-drop_text">Sign in</legend>
      <span>or <a href="#">create an account</a></span>

      <label for="username">Username or email address</label>
      <input id="username" name="username" type="text" autocapitalize="off" autocorrect="off">

      <label for="password">Password</label>
      <input id="password" name="password" type="password">
      <p class="usa-form-note">
        <a title="Show password" href="#"
            class="usa-show_password"
            aria-controls="password">
          Show password</a>
      </p>

      <input type="submit" value="Sign in" />
      <p><a href="#" title="Forgot username">
        Forgot username?</a></p>
      <p><a href="#" title="Forgot password">
        Forgot password?</a></p>
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
      <li>As you customize this form template, ensure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
      <li>Don’t automatically sign out a user without giving them 20 seconds advance notice to request more time. Users with disabilities sometimes require more time to respond to prompts.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When users expect information to be customized or private, place it behind a sign-in form.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>Allow users to access as much as of your online services as possible without having to sign in. Sign-in forms are a barrier between users and the content they want.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Less is more — make your explanations concise. Users sign in faster when less text surrounds the form.</li>
      <li>Allow people to use their email address to sign in; people have an easier time remembering their email address rather than a unique username.</li>
      <li>When a sign-in form is required, consider allowing users to stay logged in (“Remember me”) on trusted computers so they can avoid this barrier in the future.</li>
      <li>Make it easy to retrieve a forgotten username and password. Most authentication failures occur because a user has forgotten their username or password, especially common when a long time passes between visits, as is the case with most federal websites.</li>
      <li>Password masking (replacing what the user types with a generic symbol) makes it more likely that users will make mistakes when trying to log in, and doesn't offer much in additional security. Allow users to unmask this field so they can see what they type. This is especially useful on mobile devices, when mistakes are more likely.</li>
    </ul>
  </div>
</div>

<h2 class="usa-heading" id="password-reset-form">Password reset form</h2>
<p class="usa-font-lead">A standard template for resetting a password</p>

<div class="preview">

  <form>
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
            aria-controls="password">
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
      <li>As you customize this form template, ensure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
    </ul>    
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>To offer a way to easily reset a password any time users are able to sign in to your site.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>If users need a password to access your site, they will forget that password and need a way to reset it.</li>
      <li>State any password requirements (for example, “Must include one capital letter”) upfront. Don’t leave users guessing, only to hit them with an error message later.</li>
      <li>The requirements shown above are just provided as an example and should not be taken as recommendations.</li>
    </ul>
  </div>
</div>
