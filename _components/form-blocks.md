---
layout: default
type: component
title: Forms Blocks
---

<h3 class="usa-heading">Accessibility</h3>

<p>As you customize these templates, ensure they continue to meet the <a href="{{ site.baseurl }}/elements/#inputs">accessibility guidelines for all form controls</a> as well as the accessibility guidelines for each individual control.</p>

<p>In addition, when creating forms with multiple controls or customizing these templates, ensure:</p>

<ul>
  <li>Form controls should appear in the same  order in the HTML as they do on the screen. Do not use CSS to rearrange the form controls so they are in a different order. Screen readers narrate forms in the order they appear in the HTML, not on screen.</li>
  <li>Visually align validation messages with the input fields, so people using screen magnifiers can read them quickly.</li>
  <li>Group each set of thematically related controls in a "fieldset" element. Use the "legend" element to offer a label within each one. The fieldset and legend element makes it easier for screen reader users to navigate the form.</li>
  <li>A single legend is always required for fieldset. A common use of fieldset and legend is a question with radio button options for answers. The question text and radio buttons are wrapped in a fieldset, with the question itself being inside the legend tag.</li>
  <li>You can embed multiple fieldsets and legends for more complex forms.</li>
  <li>Keep your form blocks in a vertical pattern. It is an ideal approach for accessibility, due to limited vision that makes it hard to scan from right to left.</li>
</ul>

<div class="preview">
  <form class="usa-form-large">
    <fieldset>
      <legend>Mailing Address</legend>
      <label for="mailing-address-1">Street Address 1</label>
      <input id="mailing-address-1" name="mailing-address-1" type="text">

      <label for="mailing-address-2">Street Address 2 <span class="usa-additional_text">Optional</span></label>
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
      <input class="usa-input-medium" id="zip" name="zip" type="text" pattern="[\d]{5}(-[\d]{4})" data-grouplength="5,4" data-delimiter="-" data-politespace>
    </fieldset>
  </form>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h3 class="usa-heading">Use</h3>
    <p>As you customize this form, ensure it continues to:</p>
    <ul>
      <li>Label the optional ones. Users can infer that all the others are required.</li>
      <li>Support both 5 and 9 digit zips. Some addresses require a nine digit ZIP code. The input mask should be "#####-####"" so that the text is properly formatted, regardless of whether a user enters a 5 or 9 digit zip code. However, this input mask should only appear when people click away from the ZIP code input box (see the accessibility guidelines).</li>
    </ul>

    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>We also recommend:</p>
    <ul>
      <li>Make sure any input masking is accessible to people using screen readers. We use <a href="https://github.com/filamentgroup/politespace">Filament Group's Politespace</a> to ensure a good experience.</li>
    </ul>
  </div>
</div>

<div class="preview">
  <form>
    <fieldset>
      <legend>Name</legend>
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
    </fieldset>
  </form>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Leave the title and suffix fields as text boxes (instead of offering drop downs.) There are many possible titles and suffixes; text boxes accommodate them all.</li>
      <li>Do not restrict the types of characters users can enter in any of these fields. Names can include characters outside the standard Roman alphabet.</li>
    </ul>

    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>
  </div>
</div>


<div class="preview">
  <form>

    <fieldset>
      <legend>Social Security Number</legend>

      <label for="ssn">SSN <span class="usa-additional_text">Required</span>
      </label>
      <input id="ssn" name="ssn" type="password" class="usa-ssn"
          data-grouplength="3,2,4" data-delimiter="-" data-politespace
          required pattern="^d{8}$">
      <p class="usa-form-note">
        <a title="Show password" href="javascript:void(0)"
            class="usa-show_ssn"
            aria-controls="ssn">
          Show SSN</a>
      </p>

    </fieldset>

  </form>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Don’t ask for a social security number unless it’s absolutely essential. Users are reluctant to divulge personal information unless the reason for why it’s needed is clear.  If it’s not clear why it’s needed, offer an explanation.</li>
      <li>Allow users to show or hide their entry so they can check for errors.</li>
    </ul>

    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>We also recommend:</p>
    <ul>
      <li>Make sure any input masking is accessible to people using screen readers. We use <a href="https://github.com/filamentgroup/politespace">Filament Group's Politespace</a> to ensure a good experience.</li>
    </ul>
  </div>
</div>


<h2>Login</h2>

<div class="preview">
  <form>
    <fieldset>
      <legend class="usa-drop_text">Sign in</legend>
      <span class="usa-serif">or <a href="javascript:void(0)">create an account</a></span>

      <label for="username">Username or email address</label>
      <input id="username" name="username" type="text" autocapitalize="off" autocorrect="off">

      <label for="password">Password</label>
      <input id="password" name="password" type="password">
      <p class="usa-form-note">
        <a title="Show password" href="javascript:void(0)"
            class="usa-show_password"
            aria-controls="password">
          Show password</a>
      </p>

      <input type="submit" value="Sign in" />
      <p><a href="javascript:void(0)" title="Forgot password">
        Forgot username?</a></p>
      <p><a href="javascript:void(0)" title="Forgot password">
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
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Sign in forms are a barrier between users and the content they want, so allow users to access as much as of your online services as possible without having to log in.</li>
      <li>People have an easier time remembering their email address rather than a unique username, so allow them to use their email address to log in. However, some people don’t have an email address, so don’t let this be the only option.</li>
      <li>When a Sign in form is required, consider allowing users to stay logged in ("Remember me") on trusted computers so they can avoid this barrier in the future.</li>
      <li>Make it easy to retrieve a forgotten username and password. Most authentication failures occur because a user has forgotten their username or password. This is especially common when a long time passes between visits, as is the case with most federal websites.</li>
      <li>Password masking (replacing what the user types with a generic symbol) makes it more likely that users will make mistakes when trying to log in without offering much in additional security. Allow users to unmask this field so they can see what they type. This is especially useful on mobile, when mistakes are more likely.</li>
    </ul>

    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>We also recommend:</p>
    <ul>
      <li>Don’t automatically log a user out without giving them 20 seconds advance notice to request more time. Users with disabilities sometimes require more time to respond to prompts.</li>
    </ul>
  </div>
</div>


<h2 class="usa-heading">Password Reset</h2>
<div class="preview">
  <form>

    <fieldset>
      <legend class="usa-drop_text">Reset Password</legend>
      <span class="usa-serif">Please enter your new password</span>

      <div class="usa-alert usa-alert-info">
        <div class="usa-alert-body">
          <h3 class="usa-alert-heading">Passwords must:</h3>
        </div>
        <ul class="usa-check_list" id="validation_list">
          <li data-validator="length">Be at least 8 characters</li>
          <li data-validator="uppercase">Have at least 1 uppercase character</li>
          <li data-validator="numerical">Have at least 1 numerical character</li>
          <li>Another requirement</li>
        </ul>
      </div>

      <label for="password">New Password</label>
      <input id="password" name="password" type="password"
        aria-describedby="validation_list"
        class="js-validate_password"
        data-validate-length=".{8,}"
        data-validate-uppercase="[A-Z]"
        data-validate-numerical="\d"
        data-validation-element="#validation_list">

      <label for="confirmPassword">Confirm Password</label>
      <input id="confirmPassword" name="confirmPassword" type="password">
      <p class="usa-form-note">
        <a title="Show My Typing" href="javascript:void(0)"
            class="usa-show_multipassword"
            aria-controls="password">
          Show My Typing</a>
      </p>

      <input type="submit" value="Reset Password" />
    </fieldset>

  </form>
</div>

<div class="usa-grid">
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Most authentication failures occur because a user has forgotten their username or password. This is especially common when a long time passes between visits, as is the case with most federal websites.</li>
      <li>State any password requirements (e.g. "Must include one capital letter") upfront. Don’t leave users guessing only to hit them with an error message later.</li>
      <li>Indicate which criteria have been fulfilled as the user types.</li>
    </ul>
  </div>
  <div class="usa-width-one-half">
    <h3 class="usa-heading">Accessibility</h3>
    <ul>
      <li>Using aria-describedby is a good way to associate the password strength information with the field.</li>
    </ul>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
  </div>  
</div>

<h2 class="usa-heading">Contact Form</h2>

<div class="preview">
  <form class="usa-form-large">
    <fieldset>
      
      <legend>Contact us</legend>
      <p>Email us <a href="javascript:void(0)">info@agency.gov</a>, give us a call at (800)-CALL-GOVT, or send us a message below.</p>
      
      <div class="usa-form-width">
        <label for="contact-name">Name <span class="usa-additional_text">Optional</span></label>
        <input id="contact-name" name="contact-name" type="text">
        
        <label for="contact-email">Email Address</label>
        <input id="contact-email" name="contact-email" type="text">
      </div>
      
      <label for="contact-comments">Comments</label>
      <textarea id="contact-comments" name="contact-comments" rows="4" cols="50"></textarea>
      
      <div class="usa-input-buttons-inline">
        <input type="submit" value="Submit">
        <a href="javascript:void(0)">Cancel</a>
      </div>
      
    </fieldset>
  </form>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h3 class="usa-heading">Use</h3>
    <ul>
      <li>Avoid adding too many fields to this form – the more you add, the less likely people are to complete the form. This is especially true if you ask for unnecessary personal information, such as phone numbers, that people may not be ready to give out.</li>
      <li>Wherever possible, include a direct email address and phone number on your form. Some users may prefer to write an email or call.</li>
    </ul>

    <h3 class="usa-heading">Accessibility</h3>
    <p>As you customize this form template, ensure it continues to follow the:</p>
    <ul>
      <li><a href="{{ site.baseurl }}/components/#forms-blocks">accessibility guidelines for form templates</a> and</li>
      <li><a href="{{ site.baseurl }}/elements/#inputs">the accessibility guidelines for form controls</a>.</li>
    </ul>
    <p>There are no other specific accessibility guidelines for this form template.</p>
  </div>
</div>
