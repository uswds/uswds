---
type: component
title: Typesetting
maturity: beta
parent: typography
order: 03
---

<!-- Typsetting section begin -->

<p>Readable text allows users to efficiently read and take in textual information, whereas text that is not readable turns off readers or makes it challenging for them to stay focused. The following guidelines promote good readability.</p>

<div class="preview">
  <h6 class="usa-heading-alt">Alignment</h6>
  <div class="alignment-example">
    <h4>The Grand Canyon</h4>
    <p>Grand Canyon National Park is the United States' 15th oldest national park. Named a UNESCO World Heritage Site in 1979, the park is located in Arizona.</p>
  </div>

  <h6 class="usa-heading-alt">Line length - Desktop</h6>
  <div class="usa-line-length-example">
    <p>Yosemite National Park is set within California’s Sierra Nevada mountains. It’s famed for its giant, ancient sequoias, and for Tunnel View, the iconic vista of towering Bridalveil Fall and the granite cliffs of El Capitan and Half Dome.</p>
    <p class="help-text">75 characters max on desktop</p>
  </div>

  <h6 class="usa-heading-alt">Spacing</h6>
  <h1>Section heading</h1>
  <p class="usa-font-lead">Great Smoky Mountains National Park straddles the border of North Carolina and Tennessee.</p>
  <h2>Section heading</h2>
  <h3>Section of the page</h3>
  <p>The sprawling landscape encompasses lush forests and an abundance of wildflowers that bloom year-round. Streams, rivers and waterfalls appear along hiking routes that include a segment of the Appalachian Trail.</p>
  <h4>Subsection of the page</h4>
  <p>World renowned for its diversity of plant and animal life, the beauty of its ancient mountains, and the quality of its remnants of Southern Appalachian mountain culture, this is America's most visited national park.</p>
  <p>Right now scientists think that we only know about 17 percent of the plants and animals that live in the park, or about 17,000 species of a probable 100,000 different organisms.</p>
  <h5>Subsection of the page</h5>
  <p>Entrance to Great Smoky Mountains National Park is free. The park is one of the few national parks where no entrance fees are charged.</p>
</div>

<!-- Typsetting section end -->

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" class="usa-accordion-content">
    <h4 class="usa-heading">Implementation</h4>
    <p>To get the max-width on body text, add the class <code>usa-content</code> to your document. Use at the specificity that best suits your project's needs.</p>
    <p>Lists must use <code>usa-content-list</code> for the above.</p>
    <p>You can change the max-width value <code>$text-max-width</code> in <code>assets/_scss/core/<wbr>variables.scss</code>.</p>
    <h4 class="usa-heading">Usability</h4>
    <ul class="usa-content-list">
      <li>Alignment: Type set flush left provides the eye a constant starting point for each line, making text easier to read.</li>
      <li>Line length: Controlling the length of lines of text in extended copy makes reading more comfortable by helping readers’ eyes flow easily from one line to the next. Somewhere between 50 and 75 characters per line is broadly considered to be a readable line length, while 66 characters is considered the ideal. Other factors beyond line length also affect reading comfort. Text with more space between lines can have somewhat longer line length. Also, contexts in which users will not be reading long passages of text (such as footnotes or alerts) can safely be set with somewhat longer lines as well.</li>
      <li>Spacing: White space affects how the user focuses their attention on the content. It makes it easier to know what to read and where to begin. Spacing between typographic elements should be open enough to feel light, but close enough to establish a proper relationship between elements. When setting headers and body copy, white space should be 60px, 30px, 20px, or 15px.</li>
    </ul>
  </div>
</div>
