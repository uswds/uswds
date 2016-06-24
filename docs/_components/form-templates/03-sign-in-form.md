---
title: Sign-in form
parent: Form templates
maturity: beta
order: 03
lead: A template for signing a user into a website or app
---

<div class="preview">

  <form class="usa-form">
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
      <li>As you customize this form template, make sure it continues to follow the <a href="{{ site.baseurl }}/form-templates/">accessibility guidelines for form templates</a> and the <a href="{{ site.baseurl }}/form-controls/">accessibility guidelines for form controls</a>.</li>
      <li>Don’t automatically sign out a user without giving them 20 seconds' advance notice to request more time. Users with disabilities sometimes require more time to respond to prompts.</li>
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
      <li>Allow people to use their email address to sign in. People have an easier time remembering their email address than they do a unique username.</li>
      <li>If you must include a sign-in form, consider allowing users to stay logged in (“Remember me”) on trusted computers so they can avoid this barrier in the future.</li>
      <li>Make it easy for users to retrieve a forgotten username and password. Most authentication failures occur because a user has forgotten their username or password. This is especially common when a long time passes between visits, as is the case with most federal websites.</li>
      <li>Password masking (replacing what the user types with a generic symbol) makes it more likely that users will make mistakes when trying to sign in, and doesn't offer much in the way of additional security. Allow users to unmask the password field so they can see what they type. This is especially useful on mobile devices, when users are more likely to mistype.</li>
    </ul>
  </div>
</div>
