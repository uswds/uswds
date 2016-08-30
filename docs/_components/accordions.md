---
layout: styleguide
type: component
title: Accordions
category: UI components
lead: Accordions are a list of headers that can be clicked to hide or reveal additional content.
maturity: alpha
---

{% include code/preview.html component="accordion" %}
{% include code/accordion.html component="accordion" %}
<div class="usa-accordion-bordered">
  <button class="usa-button-unstyled usa-accordion-button"
    aria-expanded="true" aria-controls="documentation">
    Documentation
  </button>
  <div id="documentation" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>
        Code header areas in the accordion as <code>&lt;buttons&gt;</code> so that they are usable with both screen readers and the keyboard.
      </li>
      <li>
        Buttons should state if they are expanded with <code>aria-expanded=<wbr>"true"</code>. The <code>aria-expanded=<wbr>"false"</code> attributes will be added to other buttons when the accordion is initialized by the JavaScript.
      </li>
      <li>
        Each button has a unique name <code>aria-controls=<wbr>"id"</code> that associates the control to the appropriate region by referencing the controlled element&rsquo;s <code>id</code>.
      </li>
      <li>
        Each content area will have its <code>aria-hidden</code> attribute set to either <code>true</code> or <code>false</code> by the component, depending on its corresponding button&rsquo;s <code>aria-expanded</code> attribute. To ensure that your content is accessible in the event that the JavaScript does not load or is disabled, you should not set <code>aria-hidden=<wbr>"true"</code> on any of your content areas.
      </li>
    </ul>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Users only need a few specific pieces of content within a page.</li>
      <li>Information needs to be displayed in a small space.</li>
    </ul>
    <h5>When to consider something else</h5>
    <ul class="usa-content-list">
      <li>If visitors need to see most or all of the information on a page. Use well-formatted text instead.</li>
      <li>If there is not enough content to warrant condensing. Accordions increase cognitive load and interaction cost, as users have to make decisions about what headers to click on.</li>
    </ul>
    <h5>Guidance</h5>
    <ul class="usa-content-list">
      <li>Allow users to click anywhere in the header area to expand or collapse the content; a larger target is easier to manipulate.</li>
      <li>Make sure interactive elements within the collapsible region are far enough from the headers that users don’t accidentally trigger a collapse. (The exact distance depends on the device.)</li>
    </ul>
    <a name="deprecated"></a>
    <h4 class="usa-heading">Upgrading deprecated accordions</h4>
    <p>The accordion was changed July 2016 in order to improve it's
    implementation. Currently, both versions of the accordion work, but at some
    point in the future, the deprecated accordion will no longer function correctly.
    To upgrade your existing accordions to the new accordion:</p>
    <ul class="usa-content-list">
      <li>Remove the top level div that contains the <code>usa-accordion</code> or
      <code>usa-accordion-bordered</code> class.</li>
      <li>Add the <code>usa-accordion</code> or <code>usa-accordion-bordered</code>
      class to the <code>ul</code> element that's now at the top level.
    </ul>
  </div>
</div>

<div class="usa-alert usa-alert-warning" style="margin-bottom: 1rem;">
  <div class="usa-alert-body">
    <h3 class="usa-alert-heading">Deprecated</h3>
    <p class="usa-alert-text">
      The following accordion has been deprecated since July 2016. Please follow
      <a href="#deprecated">the instructions</a> to update any existing
      accordions to the new format.
    </p>
  </div>
</div>

<h6>Deprecated</h6>

<div class="usa-accordion">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
        aria-expanded="true" aria-controls="amendment-c-1">
        First Amendment
      </button>
      <div id="amendment-c-1" class="usa-accordion-content">
        <p>
        Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.
        </p>
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
        aria-controls="amendment-c-2">
        Second Amendment
      </button>
      <div id="amendment-c-2" class="usa-accordion-content">
        <p>
        A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.
        </p>
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
        aria-controls="amendment-c-3">
        Third Amendment
      </button>
      <div id="amendment-c-3" class="usa-accordion-content">
        <p>
        No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.
        </p>
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
        aria-controls="amendment-c-4">
        Fourth Amendment
      </button>
      <div id="amendment-c-4" class="usa-accordion-content">
        <p>
        The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized.
        </p>
      </div>
    </li>
    <li>
      <button class="usa-button-unstyled"
        aria-controls="amendment-c-5">
        Fifth Amendment
      </button>
      <div id="amendment-c-5" class="usa-accordion-content">
        <p>
        No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation.
        </p>
      </div>
    </li>
  </ul>
</div>

