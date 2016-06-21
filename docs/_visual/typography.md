---
layout: styleguide
title: Typography
subheading: UI components
order: 01
---

<p>U.S. government websites have common typographic needs: clear and consistent headings, highly legible body paragraphs, clear labels, and easy-to-use input fields. We recommend a font system that uses two open-source font families: Source Sans Pro and Merriweather, both of which are designed for legibility and can beautifully adapt to a variety of visual styles.</p>

<h3 class="usa-heading heading-margin-alt" id="typefaces">Typefaces</h3>

<h4 class="usa-heading-alt">Source Sans Pro</h4>

<div class="usa-grid-full">
  <div class="usa-width-one-half">
    <p>Source Sans Pro is an open-source sans serif typeface created for legibility in UI design. With a variety of weights that read easily at all sizes, Source Sans Pro provides clear headers as well as highly-readable body text.</p>
    <p>Inspired by twentieth-century American gothic typeface design, its slender but open letters offer a clean and friendly simplicity. Advanced hinting allows Source Sans Pro to render well on Windows systems which run Cleartype, and across browsers and devices. Moreover, it supports a variety of languages and alphabets, including Western and European language, Vietnamese, pinyin Romanization of Chinese, and Navajo.</p>
  </div>

  <div class="typography-sans-intro usa-width-one-half usa-end-row">
    <span class="text-huge">Aa</span>
    <div>
      <p class="text-tiny">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
      <p class="text-tiny">a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
      <p class="text-tiny">0 1 2 3 4 5 6 7 8 9</p>
    </div>
  </div>
</div>

<h4 class="usa-heading-alt">Merriweather</h4>

<div class="usa-grid-full">
  <div class="usa-width-one-half">
    <p>Merriweather is an open-source serif typeface designed for on-screen reading. This font is ideal for text-dense design: the letterforms have a tall x-height but remain relatively small, making for excellent readability across screen sizes while not occupying extra horizontal space.</p>
    <p>The combination of slim and thick weights gives the font family stylistic range, while conveying a desirable mix of classic, yet modern simplicity. Merriweather communicates warmth and credibility at both large and smaller font sizes.</p>
  </div>

  <div class="typography-serif-intro usa-width-one-half usa-end-row usa-serif">
    <span class="text-huge">Aa</span>
    <div>
      <p class="text-tiny">A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
      <p class="text-tiny">a b c d e f g h i j k l m n o p q r s t u v w x y z</p>
      <p class="text-tiny">0 1 2 3 4 5 6 7 8 9</p>
    </div>
  </div>
</div>

<h3 class="usa-heading heading-margin-alt" id="pairings">Pairings + Styles</h3>
<p>To support both more contemporary and more traditional web design aesthetics, this font system offers recommended font pairings. Each pairing includes web hierarchy guidance on font family, weight, size, and spacing which express either more modern or more classical type design.</p>
<p>Note: Some pairings require more font weights than others. While this allows more typographic expression, the use of more than four font weights will have a negative impact on page load performance. Find the balance that works for your product.</p>

<div class="usa-accordion-bordered usa-typography-example">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-0">
        <h5>Default: Merriweather headings, Source Sans Pro body (lite)</h5>
      </button>
      <div id="collapsible-0" class="usa-accordion-content">

        <div class="usa-grid-full">
          <div class="usa-width-two-thirds">
            <p>A simple serif and sans serif combination designed to communicate warmth and credibility. Strong Merriweather heading weights offer clear information hierarchy and when paired with Source Sans Pro’s easy-to-read body text, create a clean and professional feel.</p>
            <p>This pairing is included in our design standards.</p>
            <p>Recommended applications: digital services that feature forms; basic and text heavy sites.</p>
            <p>Font weights included in this package:</p>
            <ul>
              <li>1. Merriweather, Bold 700</li>
              <li>2. Source Sans Pro, Regular 400</li>
              <li>3. Source Sans Pro, Bold 700</li>
              <li>4. Source Sans Pro, Italic 400</li>
            </ul>
          </div>
          <aside class="usa-width-one-third usa-end-row">
            <h6 class="usa-heading-alt">Page Performance</h6>
            <p><span class="usa-label-big">Fast</span></p>
            <p>Ideal number of fonts. Will allow for optimal page load performance.</p>
            <h6 class="usa-heading-alt">Example</h6>
            <p>
              <a class="media_link" href="{{ site.baseurl }}/assets/img/epa-emanifest-screenshot.png">
                <img src="{{ site.baseurl }}/assets/img/default_example_emanifest.png" alt="EPA eManifest example">
              </a>
              <a href="{{ site.baseurl }}/assets/img/epa-emanifest-screenshot.png">EPA eManifest (screenshot of non-public site)</a>
            </p>
          </aside>
          <h6 class="usa-heading-alt">Web Hierarchy</h6>
        </div>

        <div class="usa-grid usa-typography-example-font">
          <div class="usa-width-one-half">
            <h3 class="usa-display">Display</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 52px<br>
              line-height: 1.3em/68px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h1>Heading 1</h1>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 40px<br>
              line-height: 1.3em/52px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h2>Heading 2</h2>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 30px<br>
              line-height: 1.3em/39px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3>Heading 3</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 20px<br>
              line-height: 1.3em/26px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h4>Heading 4</h4>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 17px<br>
              line-height: 1.3em/22px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h5>Heading 5</h5>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 15px<br>
              line-height: 1.3em/20px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h6>Heading 6</h6>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 13px<br>
              line-height: 1.3em/17px<br>
              text-transform: uppercase
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead">Lead <br>paragraph</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 400<br>
              font-size: 20px<br>
              line-height: 1.7em/34px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph">Body copy. A series of sentences together which make a paragraph.</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph"><em>Italic body copy. A series of sentences together which make a paragraph.</em></p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-style: Italic<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

<div class="usa-accordion-bordered usa-typography-example">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-0">
        <h5>Merriweather headings, Source Sans Pro Body (robust)</h5>
      </button>
      <div id="collapsible-0" class="usa-accordion-content">

        <div class="usa-grid-full">
          <div class="usa-width-two-thirds">
            <p>A variation of the previous font pairing, expanded to include an additional Merriweather weight. The slimmer Merriweather headings creates an elegance that compliments weights and allows you to intentionally move users’ attention around a page.</p>
            <p>Recommended applications: text heavy sites and more visual promotional sites.</p>
            <p>Font weights included in this package:</p>
            <ul>
              <li>1. Merriweather, Bold 700</li>
              <li>2. Merriweather, Light 300</li>
              <li>3. Source Sans Pro, Regular 400</li>
              <li>4. Source Sans Pro, Bold 700</li>
              <li>5. Source Sans Pro, Italic 400</li>
            </ul>
          </div>
          <aside class="usa-width-one-third usa-end-row">
            <h6 class="usa-heading-alt">Page Performance</h6>
            <p><span class="usa-label-big">Medium</span></p>
            <p>Exceeds ideal number of fonts by one. May negatively impact page load performance.</p>
            <h6 class="usa-heading-alt">Example</h6>
            <p>
              <a class="media_link" href="/">
                <img src="{{ site.baseurl }}/assets/img/robust_example_standardshome.png" alt="Draft U.S. Web Design Standards homepage example">
              </a>
              <a href="/">Draft U.S. Web Design Standards homepage</a>
            </p>
          </aside>
          <h6 class="usa-heading-alt">Web Hierarchy</h6>
        </div>

        <div class="serif-robust usa-grid usa-typography-example-font">
          <div class="usa-width-one-half">
            <h3 class="usa-display">Display 1</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 52px<br>
              line-height: 1.3em/68px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3 class="usa-display usa-display-alt">Display 2</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 300<br>
              font-size: 40px<br>
              line-height: 1.3em/52px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h1>Heading 1</h1>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 40px<br>
              line-height: 1.3em/52px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h2>Heading 2</h2>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 30px<br>
              line-height: 1.3em/39px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3>Heading 3</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 20px<br>
              line-height: 1.3em/26px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h4>Heading 4</h4>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 17px<br>
              line-height: 1.3em/22px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h5>Heading 5</h5>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 15px<br>
              line-height: 1.3em/20px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h6>Heading 6</h6>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 13px<br>
              line-height: 1.3em/17px<br>
              text-transform: uppercase
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead">Lead <br>paragraph 1</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 300<br>
              font-size: 20px<br>
              line-height: 1.7em/34px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead usa-font-lead-alt">Lead <br>paragraph 2</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.7em/29px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph">Body copy. A series of sentences together which make a paragraph.</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph"><em>Italic body copy. A series of sentences together which make a paragraph.</em></p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-style: Italic<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

<div class="usa-accordion-bordered usa-typography-example">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-0">
        <h5>Merriweather headings and body</h5>
      </button>
      <div id="collapsible-0" class="usa-accordion-content">

        <div class="usa-grid-full">
          <div class="usa-width-two-thirds">
            <p>The most formal of the options, this pairing uses Merriweather for both headings and body text. The full suite of serif styles communicates trustworthiness, while Merriweather’s contemporary shapes convey freshness and a modern relevance. The weights are designed to pair together for easy reading and clean page design. Light use of Source Sans Pro suggested for legibility of small text needs.</p>
            <p>Recommended applications: sites which need to convey reliability and trust; basic and text heavy sites.</p>
            <p>Font weights included in this package:</p>
            <ul>
              <li>1. Merriweather, Bold 700</li>
              <li>2. Merriweather, Regular 400</li>
              <li>3. Merriweather, Italic 400</li>
              <li>4. Merriweather, Light 300</li>
              <li>5. Source Sans Pro, Regular 400</li>
              <li>6. Source Sans Pro, Bold 700</li>
            </ul>
          </div>
          <aside class="usa-width-one-third usa-end-row">
            <h6 class="usa-heading-alt">Page Performance</h6>
            <p><span class="usa-label-big">Medium</span></p>
            <p>Exceeds ideal number of fonts by two. May negatively impact page load performance.</p>
            <h6 class="usa-heading-alt">Example</h6>
            <p>
              <a class="media_link" href="http://playbook.cio.gov">
                <img src="{{ site.baseurl }}/assets/img/merriweatheronly_example_playbook.png" alt="U.S. Digital Service Playbook example">
              </a>
              <a href="http://playbook.cio.gov">U.S. Digital Service Playbook</a>
            </p>
          </aside>
          <h6 class="usa-heading-alt">Web Hierarchy</h6>
        </div>

        <div class="serif-robust serif-sans-minor serif-body usa-grid usa-typography-example-font">
          <div class="usa-width-one-half">
            <h3 class="usa-display">Display 1</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 52px<br>
              line-height: 1.3em/68px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3 class="usa-display usa-display-alt">Display 2</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 300<br>
              font-size: 40px<br>
              line-height: 1.3em/52px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h1>Heading 1</h1>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 40px<br>
              line-height: 1.3em/52px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h2>Heading 2</h2>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 30px<br>
              line-height: 1.3em/39px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3>Heading 3</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 20px<br>
              line-height: 1.3em/26px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h4>Heading 4</h4>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 17px<br>
              line-height: 1.3em/22px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h5>Heading 5</h5>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 700<br>
              font-size: 15px<br>
              line-height: 1.3em/20px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h6>Heading 6</h6>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 13px<br>
              line-height: 1.3em/17px<br>
              text-transform: uppercase
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead">Lead <br>paragraph 1</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 300<br>
              font-size: 20px<br>
              line-height: 1.7em/34px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead usa-font-lead-alt">Lead <br>paragraph 2</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.7em/29px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph">Body copy. A series of sentences together which make a paragraph.</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 400<br>
              font-size: 15px<br>
              line-height: 1.7em/26px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph"><em>Italic body copy. A series of sentences together which make a paragraph.</em></p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-style: Italic<br>
              font-weight: 400<br>
              font-size: 15px<br>
              line-height: 1.7em/26px
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

<div class="usa-accordion-bordered usa-typography-example">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-0">
        <h5>Source Sans Pro headings, Merriweather body</h5>
      </button>
      <div id="collapsible-0" class="usa-accordion-content">

        <div class="usa-grid-full">
          <div class="usa-width-two-thirds">
            <p>A variation on the serif and sans serif pairing, this combination uses multiple weights of Source Sans Pro for clear headings combined with the formal feeling of Merriweather for body text. This pair similarly communicates professionalism, with extra emphasis on sleek and legible headings.</p>
            <p>Recommended applications: digital services that feature forms; basic and text heavy sites; marketing sites.</p>
            <p>Font weights included in this package:</p>
            <ul>
              <li>1. Source Sans Pro, Light 300</li>
              <li>2. Source Sans Pro, Regular 400</li>
              <li>3. Source Sans Pro, Bold 700</li>
              <li>4. Merriweather, Regular 400</li>
              <li>5. Merriweather, Italic 400</li>
              <li>6. Merriweather, Bold 700</li>
            </ul>
          </div>
          <aside class="usa-width-one-third usa-end-row">
            <h6 class="usa-heading-alt">Page Performance</h6>
            <p><span class="usa-label-big">Medium</span></p>
            <p>Exceeds ideal number of fonts by two. May negatively impact page load performance.</p>
          </aside>
          <h6 class="usa-heading-alt">Web Hierarchy</h6>
        </div>

        <div class="sans-style serif-body usa-grid usa-typography-example-font">
          <div class="usa-width-one-half">
            <h3 class="usa-display">Display 1</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 59px<br>
              line-height: 1.3em/77px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3 class="usa-display usa-display-alt">Display 2</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 300<br>
              font-size: 44px<br>
              line-height: 1.3em/57px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h1>Heading 1</h1>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 44px<br>
              line-height: 1.3em/57px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h2>Heading 2</h2>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 34px<br>
              line-height: 1.3em/44px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3>Heading 3</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 24px<br>
              line-height: 1.3em/31px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h4>Heading 4</h4>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 19px<br>
              line-height: 1.3em/25px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h5>Heading 5</h5>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 16px<br>
              line-height: 1.3em/21px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h6>Heading 6</h6>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 13px<br>
              line-height: 1.3em/17px<br>
              text-transform: uppercase
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead">Lead <br>paragraph</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 300<br>
              font-size: 22px<br>
              line-height: 1.5em/33px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph">Body copy. A series of sentences together which make a paragraph.</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-weight: 400<br>
              font-size: 15px<br>
              line-height: 1.7em/26px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph"><em>Italic body copy. A series of sentences together which make a paragraph.</em></p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Merriweather’<br>
              font-style: Italic<br>
              font-weight: 400<br>
              font-size: 15px<br>
              line-height: 1.7em/26px
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

<div class="usa-accordion-bordered usa-typography-example usa-accordion-docs">
  <ul class="usa-unstyled-list">
    <li>
      <button class="usa-button-unstyled"
          aria-expanded="false" aria-controls="collapsible-0">
        <h5>Source Sans Pro headings and body</h5>
      </button>
      <div id="collapsible-0" class="usa-accordion-content">

        <div class="usa-grid-full">
          <div class="usa-width-two-thirds">
            <p>Inspired by the growth of simple and welcoming type in modern web UI design, this suite uses Source Sans Pro exclusively. With a range of weights designed to fit into heading styles to clearly communicate hierarchy of information, this pairing can support both extremely simple designs and more polished, promotional sites.</p>
            <p>Recommended applications: digital services that feature forms; basic and text heavy sites; marketing sites.</p>
            <p>Font weights included in this package:</p>
            <ul>
              <li>1. Source Sans Pro, Light 300</li>
              <li>2. Source Sans Pro, Regular 400</li>
              <li>3. Source Sans Pro, Bold 700</li>
              <li>4. Source Sans Pro, Italic 400</li>
            </ul>
          </div>
          <aside class="usa-width-one-third usa-end-row">
            <h6 class="usa-heading-alt">Page Performance</h6>
            <p><span class="usa-label-big">Fast</span></p>
            <p>Ideal number of fonts. Will allow for optimal page load performance.</p>
            <h6 class="usa-heading-alt">Example</h6>
            <p>
              <a class="media_link" href="{{ site.baseurl }}/assets/img/va-appeals-screenshot.png">
                <img src="{{ site.baseurl }}/assets/img/ssponly_example_va.png" alt="Veterans Affairs appeals review example">
              </a>
              <a href="{{ site.baseurl }}/assets/img/va-appeals-screenshot.png">Department of Veterans Affairs appeals review (screenshot of non-public site)</a>
            </p>
          </aside>
          <h6 class="usa-heading-alt">Web Hierarchy</h6>
        </div>

        <div class="sans-style usa-grid usa-typography-example-font">
          <div class="usa-width-one-half">
            <h3 class="usa-display">Display 1</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 59px<br>
              line-height: 1.3em/77px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3 class="usa-display usa-display-alt">Display 2</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 300<br>
              font-size: 44px<br>
              line-height: 1.3em/57px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h1>Heading 1</h1>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 44px<br>
              line-height: 1.3em/57px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h2>Heading 2</h2>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 34px<br>
              line-height: 1.3em/44px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h3>Heading 3</h3>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 24px<br>
              line-height: 1.3em/31px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h4>Heading 4</h4>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 19px<br>
              line-height: 1.3em/25px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h5>Heading 5</h5>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 700<br>
              font-size: 16px<br>
              line-height: 1.3em/21px
            </p>
          </div>
          <div class="usa-width-one-half">
            <h6>Heading 6</h6>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 13px<br>
              line-height: 1.3em/17px<br>
              text-transform: uppercase
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="usa-font-lead">Lead <br>paragraph</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 300<br>
              font-size: 22px<br>
              line-height: 1.5em/33px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph">Body copy. A series of sentences together which make a paragraph.</p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
          <div class="usa-font-example usa-width-one-half">
            <p class="font-example-paragraph"><em>Italic body copy. A series of sentences together which make a paragraph.</em></p>
          </div>
          <div class="usa-width-one-half usa-end-row">
            <p class="usa-monospace">
              font-family: ‘Source Sans Pro’<br>
              font-style: Italic<br>
              font-weight: 400<br>
              font-size: 17px<br>
              line-height: 1.5em/26px
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
</div>

<!-- Typsetting section begin -->

<h3 class="usa-heading" id="typesetting">Typesetting</h3>
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

<!-- Links section begin -->

<h3 class="usa-heading" id="links">Links</h3>

<p class="usa-font-lead">Links lead users to a different page or further information.
</p>

<div class="preview">

  <p><a href="#">This</a> is a text link on a light background.</p>

  <p><a class="usa-color-text-visited" href="#">This</a> is a visited link.</p>

  <p>This is a link that goes to an <a class="usa-external_link" href="http://media.giphy.com/media/8sgNa77Dvj7tC/giphy.gif">external website</a>.</p>

  <div class="usa-background-dark">
    <p><a href="#">This</a> is a text link on a dark background.</p>
  </div>
</div>

<!-- Links section end -->

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" class="usa-accordion-content">
    <h4 class="usa-heading">Accessibility</h4>
    <ul class="usa-content-list">
      <li>Users should be able to tab to navigate between links.
      <li>Users should be able to activate a link when pressing ‘Enter’ on their keyboard.</li>
      <li>Users should be able to identify links without relying on color alone.</li>
      <li>Users should be able to activate hover and focus states with both a mouse and a keyboard.</li>
    </ul>
  </div>
</div>

<!-- Lists section begin -->

<h3 class="usa-heading" id="lists">Lists</h3>

<p class="usa-font-lead">Lists organize written information for users.</p>

<div class="preview">

  <div class="usa-grid">
    <div class="usa-width-one-third">

      <h6 class="usa-heading-alt">Unordered list</h6>

      <ul>
        <li>Unordered list item</li>
        <li>Unordered list item</li>
        <li>Unordered list item</li>
      </ul>

    </div>

    <div class="usa-width-one-third">

      <h6 class="usa-heading-alt">Ordered list</h6>

      <ol>
        <li>Ordered list item</li>
        <li>Ordered list item</li>
        <li>Ordered list item</li>
      </ol>

    </div>
  </div>
</div>

<!-- Lists section end -->

<div class="usa-accordion-bordered usa-accordion-docs">
  <button class="usa-button-unstyled usa-accordion-button"
      aria-expanded="true" aria-controls="collapsible-0">
    Documentation
  </button>
  <div id="collapsible-0" class="usa-accordion-content">
  <h4 class="usa-heading">Implementation</h4>
  <p>Lists are styled by default. For unstyled lists, use either the <code>usa-unstyled-list</code> class or unstyled list mixin: <code>@include unstyled-list;</code>. Both are located in <code>assets/_scss/core/<wbr>utilities.scss</code>.</p>
    <h4 class="usa-heading">Usability</h4>
    <h5>When to use</h5>
    <ul class="usa-content-list">
      <li>Use an ordered list when you need to display text in some ranking, hierarchy, or series of steps.</li>
      <li>Use unordered lists to display text in no specific order.</li>
    </ul>
    <h5>When to consider something different</h5>
    <ul class="usa-content-list">
      <li>If you need to communicate long lists of narrative text.</li>
    </ul>
    <h5>Guidelines</h5>
    <ul class="usa-content-list">
      <li>Use sentence case and begin lists with a capital letter.</li>
      <li>Use punctuation appropriate to the text. Do not leave sentences without periods.</li>
    </ul>
  </div>
</div>
