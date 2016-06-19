---
layout: styleguide
type: component
title: Alerts
lead: Alerts keep users informed of important and sometimes time-sensitive changes.
---

<div class="preview">

  <div class="usa-alert usa-alert-success">
    <div class="usa-alert-body">
      <h3 class="usa-alert-heading">Success Status</h3>
      <p class="usa-alert-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
    </div>
  </div>

  <div class="usa-alert usa-alert-warning">
    <div class="usa-alert-body">
      <h3 class="usa-alert-heading">Warning Status</h3>
      <p class="usa-alert-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
    </div>
  </div>

  <div class="usa-alert usa-alert-error" role="alert">
    <div class="usa-alert-body">
      <h3 class="usa-alert-heading">Error Status</h3>
      <p class="usa-alert-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
    </div>
  </div>

  <div class="usa-alert usa-alert-info">
    <div class="usa-alert-body">
      <h3 class="usa-alert-heading">Information Status</h3>
      <p class="usa-alert-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.</p>
    </div>
  </div>

  <div class="usa-alert usa-alert-info">
    <div class="usa-alert-body">
      <h3 class="usa-alert-heading">Information Status</h3>
      <p class="usa-alert-text">Multi line. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui atione voluptatem sequi nesciunt. Neque porro quisquam est, qui doloremipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
    </div>
  </div>
</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Use the ARIA <code>role=<wbr>"alert"</code> to inform assistive technologies of a time-sensitive and important message that is not interactive. If the message is interactive, use the <code>alertdialog</code> role instead.
      <li>Do not visually hide alert messages on the page and then make them visible when they are needed. Users of older assistive technologies may still be able to perceive the alert messages even if they are not currently applicable.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>As a notification that keeps people informed of the status of the system and which may or may not require the user to respond. This includes errors, warnings, and general updates.</li>
      <li>As a validation message that alerts someone that they just did something that needs to be corrected or as confirmation that a task was completed successfully.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>On long forms, always include in-line validation in addition to any error messages that appear at the top of the form. </li>
      <li>If an action will result in destroying a user’s work (for example, deleting an application) use a more intrusive pattern, such as a confirmation modal dialogue, to allow the user to confirm that this is what they want.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>When the user is required to do something in response to an alert, let them know what they need to do and make that task as easy as possible. Think about how much context to provide with your message. For example, a notification of a system change may require more contextual information than a validation message. Write the message in concise, human readable language; avoid jargon and computer code.</li>
      <li>Be polite in error messages — don’t place blame on the user.</li>
      <li>Users generally won’t read documentation but will read a message that helps them resolve an error; include some educational material in your error message.</li>
      <li>But don’t overdo it — too many notifications will either overwhelm or annoy the user and are likely to be ignored.</li>
      <li>Allow a user to dismiss a notification wherever appropriate.</li>
      <li>Don’t include notifications that aren’t related to the user’s current goal.</li>
    </ul>
  </div>
</div>
