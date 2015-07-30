---
layout: default
type: component
title: Accordions
---

<h3>Bordered Accordion</h3>

<div class="usa-accordion">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="true" aria-controls="collapsible-0">
        Apple Pie
      </button>
      <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-1">
        Stawberry Pie
      </button>
      <div id="collapsible-1" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-2">
        Peace Pie
      </button>
      <div id="collapsible-2" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-3">
        Key Lime
      </button>
      <div id="collapsible-3" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-4">
        Blackberry
      </button>
      <div id="collapsible-4" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
  </ul>
</div>

<div class="usa-grid-box">
  <div class="usa-width-one-half">
    <h3>Use</h3>
    <ul>
      <li>
        Accordions are best used when users only need a few specific pieces of content within a page.
      </li>
      <li>
        Accordion headers can serve as a mini-outline for the content on a page.
      </li>
      <li>
        Accordions can also be useful when information needs to be displayed in a small space.
      </li>
      <li>
        One major drawback of accordions is that they increase cognitive load and interaction cost, as users have to make decisions on what headers to click on.
      </li>
      <li>
        Accordions should <em>not</em> be used when visitors need to see most or all of the information on a page, or when there is not enough content to warrant condensing.
      </li>
      <li>
        Clicking anywhere on the header (not just on the icon) triggers expansion or collapse of that section.
      </li>
      <li>
        Any interactive element within each section should be placed a minimum of 2 mm from the header to avoid accidentally triggering the wrong interaction.
      </li>
      </ul>
  </div>
  <div class="usa-width-one-half">
    <h3>Accessibility</h3>
    <ul>
      <li>
        Code header areas in the accordion as <code>&lt;buttons&gt;</code> so that they are usable with both screen readers and the keyboard.
      </li>
      <li>
        All the buttons need to state whether they are expanded or not with the appropriate attribute, either <code>aria-expanded=’true’</code> or <code>aria-expanded=’false’</code>.
      </li>
      <li>
        Each button has a unique name <code>aria-controls=’collapsible-#’</code> that associates the control to the appropriate region by referencing the controlled elements <code>id</code>.
      </li>
      <li>
        Each content area has an <code>aria-hidden</code> attribute set to either <code>true</code> or <code>false</code>. When <code>false</code>, the element (and all children) are neither visible or perceivable, and assistive technologies will skip this content.
      </li>
    </ul>
  </div>
</div>

<hr>

<div class="code-snippets hidden">

  <a href="#" class="code-snippet-button"></a>

  <table>
    <tr>
      <th>
        HTML
      </th>
    </tr>
    <tr>
      <td class="snippet">
        <button class="code-copy-button" data-clipboard-target="accordion-html">Copy</button>
        <div id="accordion-html">
          {% highlight html %}
<div class="usa-accordion">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="true" aria-controls="collapsible-0">
        Apple Pie
      </button>
      <div id="collapsible-0" aria-hidden="false" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-1">
        Stawberry Pie
      </button>
      <div id="collapsible-1" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-2">
        Peace Pie
      </button>
      <div id="collapsible-2" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-3">
        Key Lime
      </button>
      <div id="collapsible-3" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-4">
        Blackberry
      </button>
      <div id="collapsible-4" aria-hidden="true" class="usa-accordion-content">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    </li>
  </ul>
</div>
          {% endhighlight %}
        </div>
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
        <button class="code-copy-button" data-clipboard-target="accordion-css">Copy</button>
        <div id="accordion-css">
          {% highlight css %}
.usa-accordion ul {
  border: 1px solid #757575;
  border-radius: 5px;
  color: #212121;
  margin: 0;
  overflow: hidden;
  padding: 0;
}

.usa-accordion ul li {
  background-color: #eeeeee;
  border-bottom: 1px solid #757575;
  font-family: "Source Sans Pro", "Helvetica", "Arial", sans-serif;
  list-style: none;
  margin: 0;
}

.usa-accordion ul li:last-child {
  border-bottom: 0;
}

.usa-accordion ul button[aria-expanded=false] {
  background: url("../img/arrow-right.png") no-repeat;
  background-position: 15px;
  border-bottom: 0;
}

.usa-accordion ul button {
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

.usa-accordion-content {
  display: block;
  background-color: white;
  padding: 15px;
}
          {% endhighlight %}
        </div>
      </td>
      <td>
        <button class="code-copy-button" data-clipboard-target="accordion-js">Copy</button>
        <div id="accordion-js">
          {% highlight js %}
function Accordion($el) {
  var self = this;
  this.$root = $el;
  this.$root.on('click', 'button', function(ev) {
    ev.preventDefault();
    self.hideAll();
    self.show($(this));
  });
}

Accordion.prototype.$ = function(selector) {
  return this.$root.find(selector);
}

Accordion.prototype.hide = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', false);
  $content.attr('aria-hidden', true);
};

Accordion.prototype.show = function($button) {
  var selector = $button.attr('aria-controls'),
      $content = this.$('#' + selector);

  $button.attr('aria-expanded', true);
  $content.attr('aria-hidden', false);
};

Accordion.prototype.hideAll = function() {
  var self = this;
  this.$('button').each(function() {
    self.hide($(this));
  });
};

function accordion($el) {
  return new Accordion($el);
}

$(function() {
  $('.usa-accordion').each(function() {
    accordion($(this));
  });
});
          {% endhighlight %}
        </div>
      </td>
    </tr>
  </table>
</div>

<!-- TODO: Add borderless accordion -->
