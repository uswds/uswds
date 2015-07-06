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
  border: 1px solid #757575;
  border-radius: 5px;
  color: #212121;
  margin: 0;
  overflow: hidden;
  padding: 0; 
}

.usa-accordion li {
  background-color: #eeeeee;
  border-bottom: 1px solid #757575;
  font-family: "Source Sans Pro", "Helvetica", "Arial", sans-serif;
  list-style: none;
  margin: 0;
}

.usa-accordion li button[aria-expanded=false] {
  background: url("../img/arrow-right.png") no-repeat;
  background-position: 15px;
  border-bottom: 0;
}

.usa-accordion li:last-child {
  border-bottom: 0;
}

.usa-accordion li button {
  background: url("../img/arrow-down.png") no-repeat;
  background-position: 15px;
  border-bottom: 1px solid #757575;
  color: #212121;
  cursor: pointer;
  display: inline-block;
  font-family: "Source Sans Pro", "Helvetica", "Arial", sans-serif;
  margin: 0;
  padding: 10px 15px 10px 35px;
  width: 100%;
}

.usa-accordion li .usa-accordion-content {
  display: block;
  background-color: white;
  padding: 15px;
}


        {% endhighlight %}
        </td>
        <td>
        {% highlight js %}
$(function() {
  $('.usa-accordion').each(function() {
    accordion($(this));
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
