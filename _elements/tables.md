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
        <th scope='col'>Project Name</th>
        <th scope='col'>Description</th>
        <th scope='col'>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td scope='row'>Apple Pie</td>
        <td>A fruit pie in which the principal filling ingredient is apple</td>
        <td>$4.50</td>
      </tr>
      <tr>
        <td scope='row'>Blueberry Pie</td>
        <td>Composed of blackberry filling, usually in the form of either blackberry jam</td>
        <td>$4.25</td>
      </tr>
      <tr>
        <td scope='row'>Blackberry Pie</td>
        <td>A fruit pie in which the principal filling ingredient is blackberry</td>
        <td>$3.78</td>
      </tr>
      <tr>
        <td scope='row'>Key Lime Pie</td>
        <td>Made of Key lime juice, egg yolks, and sweetened condensed milk in a pie crust</td>
        <td>$1.99</td>
      </tr>
      <tr>
        <td scope='row'>Lemon Meringue Pie</td>
        <td>Made of shortcrust pastry, lemon custard filling and a fluffy meringue topping</td>
        <td>$2.66</td>
      </tr>
      <tr>
        <td scope='row'>Boston Creme Pie</td>
        <td>A cake that is filled with a custard or cream filling and frosted with chocolate</td>
        <td>$5.55</td>
      </tr>      
    </tbody>
  </table>

  <h6>Borderless Table</h6>

  <table class="usa-table-borderless">
    <thead>
      <tr>
        <th scope='col'>Project Name</th>
        <th scope='col'>Description</th>
        <th scope='col'>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td scope='row'>Apple Pie</td>
        <td>A fruit pie in which the principal filling ingredient is apple</td>
        <td>$4.50</td>
      </tr>
      <tr>
        <td scope='row'>Blueberry Pie</td>
        <td>Composed of blackberry filling, usually in the form of either blackberry jam</td>
        <td>$4.25</td>
      </tr>
      <tr>
        <td scope='row'>Blackberry Pie</td>
        <td>A fruit pie in which the principal filling ingredient is blackberry</td>
        <td>$3.78</td>
      </tr>
      <tr>
        <td scope='row'>Key Lime Pie</td>
        <td>Made of Key lime juice, egg yolks, and sweetened condensed milk in a pie crust</td>
        <td>$1.99</td>
      </tr>
      <tr>
        <td scope='row'>Lemon Meringue Pie</td>
        <td>Made of shortcrust pastry, lemon custard filling and a fluffy meringue topping</td>
        <td>$2.66</td>
      </tr>
      <tr>
        <td scope='row'>Boston Creme Pie</td>
        <td>A cake that is filled with a custard or cream filling and frosted with chocolate</td>
        <td>$5.55</td>
      </tr>      
    </tbody>
  </table>

</div>

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Simple tables can have two levels of headers. Each header cell should have <code>scope=<wbr>'col'</code> or <code>scope=<wbr>'row'</code>.</li>
      <li>Complex tables are tables with more than two levels of headers. Each header should be given a unique <code>id</code> and each data cell should have a <code>headers</code> attribute with each related header cell’s <code>id</code> listed.</li>
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
      <li>Tables are great at displaying tabular data—minimal visual styling helps surface this information more easily.</li>
    </ul>
  </div>
</div>
