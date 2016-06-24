---
layout: styleguide
type: element
title: Labels
subheading: UI components
lead: Labels draw attention to new or important content.
---

<div class="preview">

  <h6>Small</h6>
  <span class="usa-label">New</span>

  <h6>Large</h6>
  <span class="usa-label-big">New</span>

</div>

<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <p>When labels are used to call out new content that is dynamically loaded onto a page, be sure to use ARIA live regions to alert screen readers of the change.</p>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>To draw attention to new, important content on a page that might otherwise be missed.</li>
      <li>To filter results with one or more tags.</li>
      <li>To indicate the number of new or unread items within a container. For example, to indicate the number of unread emails within a person’s inbox.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>When users are likely to confuse a static label with a button. For example, when the label appears in the same area of the page as buttons.</li>
      <li>To call attention to new or updated content, consider changing the background color of the object itself or experiment with changing the font weight.</li>
      <li>When users already expect content to be updated frequently. For example, on a site dedicated to breaking news. In this case placing the new content at the top may be enough.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Users frequently confuse labels as buttons. Always conduct usability testing to make sure your particular implementation is not causing frustration.</li>
      <li>If your labels are not interactive, be sure to disable hover, focus, and active styles.</li>
      <li>Don’t mix interactive and static labels on your site. Once you establish a pattern for how labels behave, users will expect that behavior every time.</li>
      <li>Don’t over do it — if everything on a page is called out as important, nothing is important.</li>
    </ul>
  </div>
</div>
