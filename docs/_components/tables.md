---
layout: styleguide
type: element
title: Tables
category: UI components
lead: Tables show tabular data in columns and rows.
maturity: alpha
---

{% include code/preview.html component="tables" %}
{% include code/accordion.html component="tables" %}
<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Simple tables can have two levels of headers. Each header cell should have <code>scope=<wbr>"col"</code> or <code>scope=<wbr>"row"</code>.</li>
      <li>Complex tables are tables with more than two levels of headers. Each header should be given a unique <code>id</code> and each data cell should have a <code>headers</code> attribute with each related header cell’s <code>id</code> listed.</li>
      <li>When adding a title to a table, include it in a <code>&lt;caption&gt;</code> tag inside of the <code>&lt;table&gt;</code> element.</li>
    </ul>

    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>When you need tabular information, such as statistical data.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>Depending on the type of content, consider using other presentation formats such as definition lists or hierarchical lists. </li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Tables are great at displaying tabular data. Minimal visual styling helps surface this information more easily.</li>
    </ul>
  </div>
</div>
