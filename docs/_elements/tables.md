---
layout: styleguide
type: element
title: Tables
lead: Tables show tabular data in columns and rows.
---

<div class="preview">

  <h6>Bordered Table</h6>

  <table>
    <thead>
      <tr>
        <th scope="col">Document title</th>
        <th scope="col">Description</th>
        <th scope="col">Year</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Declaration of Independence</th>
        <td>Statement adopted by the Continental Congress declaring independence from the British Empire.</td>
        <td>1776</td>
      </tr>
      <tr>
        <th scope="row">Bill of Rights</th>
        <td>The first ten amendments of the U.S. Constitution guaranteeing rights and freedoms.</td>
        <td>1791</td>
      </tr>
      <tr>
        <th scope="row">Declaration of Sentiments</th>
        <td>A document written during the Seneca Falls Convention outlining the rights that American women should be entitled to as citizens.</td>
        <td>1848</td>
      </tr>
      <tr>
        <th scope="row">Emancipation Proclamation</th>
        <td>An executive order granting freedom to slaves in designated southern states.</td>
        <td>1863</td>
      </tr>
    </tbody>
  </table>

  <h6>Borderless Table</h6>

  <table class="usa-table-borderless">
    <thead>
      <tr>
        <th scope="col">Document Title</th>
        <th scope="col">Description</th>
        <th scope="col">Year</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Declaration of Independence</th>
        <td>Statement adopted by the Continental Congress declaring independence from the British Empire.</td>
        <td>1776</td>
      </tr>
      <tr>
        <th scope="row">Bill of Rights</th>
        <td>The first ten amendments of the U.S. Constitution guaranteeing rights and freedoms.</td>
        <td>1791</td>
      </tr>
      <tr>
        <th scope="row">Declaration of Sentiments</th>
        <td>MadeA document written during the Seneca Falls Convention outlining the rights that American women should be entitled to as citizens.</td>
        <td>1848</td>
      </tr>
      <tr>
        <th scope="row">Emancipation Proclamation</th>
        <td>An executive order granting freedom to slaves in designated southern states.</td>
        <td>1863</td>
      </tr>      
    </tbody>
  </table>

</div>

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
