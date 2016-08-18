---
layout: styleguide
type: component
title: Footers
category: UI components
lead: Footers serve site visitors who arrive at the bottom of a page without finding what they want.
maturity: alpha
---

{% include code/preview.html component="footers" %}
{% include code/accordion.html component="footers" %}
<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Code the navigation so that pressing the tab key moves focus from link to link in the navigation, even when the navigation has collapsed into an accordion.</li>
      <li>On small screens: when collapsed into an accordion, the navigation should also meet the accessibility requirements outlined in the "Accordion" section.</li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Use the big footer when you want to replicate your site’s navigation scheme in the footer and offer newsletter signups.</li>
      <li>Use the medium footer when you want to offer only a few footer links (for disclaimers, terms of service, etc.), social media icons, and contact information.</li>
      <li>Use the slim footer when you only want to offer a few footer links and nothing else.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>Avoid using the medium and slim footers when your footer has more than five links.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Footer links should point to popular content that might answer a visitor’s remaining questions. Links to disclaimers and legal content sometimes need to be in the footer, but try to minimize “disclaimer bloat” wherever possible.</li>
      <li>Link grouping in the footer does not have to mirror link grouping in top level header navigation (especially if the navigation offers many more links than the footer can).</li>
      <li>Include the newsletter sign up if one of your website’s goals is getting visitors to sign up for a newsletter.</li>
      <li>Link only to social media your agency updates frequently or uses to communicate with customers.</li>
      <li>Important contact information should be limited to general email or phone numbers, which should be clickable links to dial from a mobile phone. Physical addresses should live on contact pages users can navigate to from the accordion links.</li>
    </ul>
  </div>
</div>
