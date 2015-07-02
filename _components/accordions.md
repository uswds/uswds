---
layout: default
type: component
title: Accordions
---

<h3>Bordered Accordion</h3>

<div class="code-sample">
  <ul class="usa-accordion">
    <li>
      <button class="button-unstyled"
          aria-expanded="true" aria-controls="collapsible-0">
        Apple Pie h4
      </button>
      <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="button-unstyled"
          aria-expanded="false" aria-controls="collapsible-1">
        Stawberry Pie h4
      </button>
      <div id="collapsible-1" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="button-unstyled"
          aria-expanded="false" aria-controls="collapsible-2">
        Peace Pie h4
      </button>
      <div id="collapsible-2" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="button-unstyled"
          aria-expanded="false" aria-controls="collapsible-3">
        Key Lime h4
      </button>
      <div id="collapsible-3" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="button-unstyled"
          aria-expanded="false" aria-controls="collapsible-4">
        Blackberry h4
      </button>
      <div id="collapsible-4" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
  </ul>

  <div class="code-snippet">
    <table>
      <tr>
        <th>
          HTML
        </th>
      </tr>
      <tr>
        <td>
          {% highlight html %}
<ul class="usa-accordion">
  <li>
    <p>Apple Pie h4</p>
    <div class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
  </li>
  <li class="hidden">
    <p>Strawberry Pie</p>
    <div class="usa-accordion-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </li>
  <li class="hidden">
    <p>Peach Pie</p>
    <div class="usa-accordion-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </li>
  <li class="hidden">
    <p>Key Lime Pie</p>
    <div class="usa-accordion-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </li>
  <li class="hidden">
    <p>Blackberry Pie</p>
    <div class="usa-accordion-content">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </li>
</ul>
        {% endhighlight %}
        </td>
      </tr>
    </table>
    <table>
      <tr>
        <th>CSS</th>
        <th>JavaScript</th>
      </tr>
      <tr>
        <td>
        {% highlight css %}
.usa-accordion {
  border-top: 1px solid #757575;
  border-right: 1px solid #757575;
  border-left: 1px solid #757575;
  color: #212121;
  padding: 0;
  margin: 0; 
}

.usa-accordion li {
  background-color: #eeeeee;
  font-family: "Source Sans Pro", "Helvetica", "Arial", sans-serif;
  border-bottom: 1px solid #757575;
  list-style: none;
  margin: 0; 
}

.usa-accordion li.hidden .content {
  display: none; 
}

.usa-accordion li.hidden p {
  background: url("../img/arrow-down.png") no-repeat;
  background-position: 15px; 
}

.usa-accordion li p {
  font-family: "Source Sans Pro", "Helvetica", "Arial", sans-serif;
  color: #212121;
  display: inline-block;
  padding: 10px 15px 10px 35px;
  cursor: pointer;
  margin: 0;
  width: 100%;
  background: url("../img/arrow-right.png") no-repeat;
  background-position: 15px; 
}

.usa-accordion li .content {
  display: block;
  background-color: white;
  padding: 15px; 
}
        {% endhighlight %}
        </td>
        <td>
        {% highlight js %}
$(function() {
  $('.usa-accordion').on('click', 'p', function() {
   $(this).parent().removeClass("hidden")
    .siblings().addClass("hidden");
  });
});
        {% endhighlight %}     
        </td>
      </tr>
    </table>
  </div>
</div>

<div class="grid-box">
  <div class="grid-item width-one-half annotation">
    <h3>Use</h3>
    <p>This is the usage content for the example.</p>
  </div>
  <div class="grid-item width-one-half annotation">
    <h3>Accessibility</h3>
    <p>This is the accessibility content for the example.</p>
  </div>  
</div>

<!-- TODO: Add borderless accordion -->
