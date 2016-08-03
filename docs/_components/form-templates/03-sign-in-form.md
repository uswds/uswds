---
title: Sign-in form
parent: Form templates
maturity: alpha
order: 03
lead: A template for signing a user into a website or app
---

{% include code/preview.html component="sign-in-form" %}
{% include code/accordion.html component="sign-in-form" %}
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
