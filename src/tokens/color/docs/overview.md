## Introduction

USWDS organizes its colors tokens into [theme tokens]({{ site.baseurl }}/design-tokens/color/theme-tokens/), [state tokens]({{ site.baseurl }}/design-tokens/color/state-tokens/), and [system tokens]({{ site.baseurl }}/design-tokens/color/system-tokens/). System tokens are the complete set of colors available to USWDS. Project tokens are a smaller, role-based subset customized to your project's individual identity, tone, and needs. It will use only a few color families from the broader set of 24 color families available in the system token set.

**Use USWDS color tokens and avoid custom colors whenever possible.** In the long run, it’s a better user experience across government when there’s coherence across sites and services. Of course, your mission, project needs, and user needs always come first, but if you plan to contribute your work back into the system — which helps the system learn, adapt, and improve — that work will need to conform to system standards and use USWDS tokens.

<div>
<div class="bg-base-lighter measure-3 padding-3 usa-section" markdown="1">

{:.font-lang-xs.color-ink.text-bold.text-ls-2.margin-top-0.text-uppercase}
### Color, color family, and grade

Throughout our documentation and guidance, we’ll use the terms color, color family, and grade, but what do we mean when we use them?

**Color** is any specific swatch in our token palettes, like `red-50`, `primary-base`, or `indigo-warm-60v`.

**Color family** is a group of colors that all have the same hue on a color wheel (See [USWDS color wheels](#uswds-color-wheels) below). They contain a number of individual colors, distinguished by the brightness or saturation of each individual color. A system token color family is typically a conventional color name like `red` or `blue-warm`, and a theme token color family is a role-based name like `primary`.

**Grade** is a way to express how light or dark a color is. USWDS uses a 100-point scale to communicate the grade, where 0 is pure white and 100 is pure black. We’ve regularized these grades across color families: a color of grade `50` in one color family should be the same level of lightness as a color of grade `50` in another color family. This has important color contrast and accessibility implications that we’ll discuss later.
</div>
</div>

## Color and accessibility
Color is powerful but unreliable — its effects are neither consistent nor predictable across a population. [Per NIH, color insensitivity impacts approximately 0.5% of adult women and 8% of adult men](https://nei.nih.gov/health/color_blindness/facts_about) (4.5% of the total population). Color insensitivity can make it difficult to distinguish hues (red/green color blindness is the most common form), and some rare conditions prevent the perception of hue altogether. Commonplace vision problems like short- and near-sightedness and astigmatism (among others) also affect how well folks perceive color and contrast.

Accessibility is not a special case. In Q2 of 2018, [sites using USWDS topped 1.4 billion pageviews]({{ site.baseurl }}/about/whats-new/). 4.5% of 1.4 billion is around 60 million pageviews — when it comes to accessibility, thinking broadly and inclusively isn’t just a good idea, it’s our mission and responsibility.

[Section 508](https://section508.gov/), which aligns with [WCAG 2.0 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.0), sets a legal standard for the contrast level necessary between text and its background. The baseline AA contrast standard is 4.5:1 for most text and 3:1 for large text (19px+ bold or 24px+ normal text).

### Accessible color pairings

USWDS helps teams choose accessible colors with a color grade system. Let’s look at the `gray` color family, in grades 5-90 (grade 0 is `white`):

<div class="padding-2 bg-white radius-md measure-3">
  <div class="grid-row font-mono-2 text-400">
    <div class="grid-col-fill">
      <div class="bg-gray-5 height-4"></div>
      <div class="text-center margin-top-2px">5</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-10 height-4"></div>
      <div class="text-center margin-top-2px">10</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-20 height-4"></div>
      <div class="text-center margin-top-2px">20</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-30 height-4"></div>
      <div class="text-center margin-top-2px">30</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-40 height-4"></div>
      <div class="text-center margin-top-2px">40</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-50 height-4"></div>
      <div class="text-center margin-top-2px">50</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-60 height-4"></div>
      <div class="text-center margin-top-2px">60</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-70 height-4"></div>
      <div class="text-center margin-top-2px">70</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-80 height-4"></div>
      <div class="text-center margin-top-2px">80</div>
    </div>
    <div class="grid-col-fill">
      <div class="bg-gray-90 height-4"></div>
      <div class="text-center margin-top-2px">90</div>
    </div>
  </div>
</div>

{:.font-lang-2xs}
**Above:** Each color family has ten grades, from 5-90. Pure `white` is the equivalent of grade 0, and pure `black` is the equivalent of grade 100.

### Magic number
We call the difference in grade between any two colors the _magic number_. Magic numbers have important contrast implications:
- **A magic number of 40+** results in WCAG 2.0 AA Large Text contrast (example: `gray-90` and `indigo-warm-50v`).
- **A magic number of 50+** results in WCAG 2.0 AA contrast or AAA Large Text contrast (example: `gray-90` and `red-40`).
- **A magic number of 70+** results in WCAG 2.0 AAA contrast (example: `gray-10` and `red-80`).
- **Colors of grade 50** result in Section 508 AA contrast against both pure white (grade `0`) and pure black (grade `100`).

Use USWDS magic numbers to choose accessible color combinations from any palette and color family.

USWDS magic number works because each grade conforms to a specific range of values for [relative luminance](https://www.w3.org/WAI/GL/wiki/Relative_luminance). WCAG and Section 508 color contrast is calculated as a ratio of the relative luminances of two colors, so as long as our colors fall between a specific luminance range for each grade, the ratio will conform to contrast requirements.

| grade | minimum luminance | maximum luminance
| --- | --- | ---
| `0`  | `1.000` | `1.000`
| `5`  | `0.850` | `0.930`
| `10` | `0.750` | `0.820`
| `20` | `0.500` | `0.650`
| `30` | `0.350` | `0.450`
| `40` | `0.250` | `0.300`
| `50` | `0.175` | `0.183`
| `60` | `0.100` | `0.125`
| `70` | `0.050` | `0.070`
| `80` | `0.020` | `0.040`
| `90` | `0.005` | `0.015`
| `100` | `0.000` | `0.000`

#### Accessible color combination examples

{:.measure-6}
![gray color contrast example]({{ site.baseurl }}/assets/img/design-tokens/gray-example.png)

{:.font-lang-2xs}
**Above:** Since `90 – 50 = 40`, on a background of `gray-90` use grades of `40` and below to assure Section 508 AA contrast. Grades of `50` and below are acceptable for large text.

{:.measure-6.margin-top-5}
![indigo color contrast example]({{ site.baseurl }}/assets/img/design-tokens/indigo-warm-example.png)

{:.font-lang-2xs}
**Above:** The color grade system works across color families.

### Color, contrast, and readability
Readability is the ease with which a reader can understand a written text. It's a complicated phenomenon affected by many factors in addition to color and contrast, including (but not limited to) type size, typeface, line length, line height, whitespace, word choice, content design, and writing style. Readability issues can be especially important when your site contains documentation or detailed text that requires concentration.

But when it comes to color, consider these general guidelines:

- Section 508 AA+ color contrast helps colorblindness and color perception.
- Avoiding pure black text on white helps dyslexia, [Irlen Syndrome](https://irlen.com/what-is-irlen-syndrome/), light sensitivity, and autism.
- Best combination is the max color contrast of white/light text on black/dark background which seems to visually work well for all.
- The best option, when possible, is to provide a way for users to select their own text and background colors.

## USWDS color wheels

The following color wheels are a way to visualize the entire [USWDS system palette]({{ site.baseurl }}/design-tokens/color/system-tokens/) and its color family naming rubric. The color wheels are arranged around the 360° of the [HSL color model](https://en.wikipedia.org/wiki/HSL_and_HSV). Each color family is labelled with its position (in degrees) on this model. In general, colors within color families stay close to the hue value listed, but it is a custom palette, not generated by an algorithm. Hue variation within color families is intentional — we are trying to find good colors, not just those that fit a function.

{:.bg-white.padding-2.radius-md}
![standard color wheel]({{ site.baseurl }}/assets/img/design-tokens/uswds-standard-color-wheel-2.6.0.jpg)

{:.font-lang-2xs}
**Above:** USWDS standard system color tokens wheel

{:.bg-white.padding-2.radius-md.margin-top-4}
![vivid color wheel]({{ site.baseurl }}/assets/img/design-tokens/uswds-vivid-color-wheel-2.6.0.jpg)

{:.font-lang-2xs}
**Above:** USWDS vivid system color tokens wheel

## General color guidance

If we use color intentionally, consistently, and sensitively, it can make a big difference in the way people understand and connect with our pages, our products and services, and our message. Color is an important component of visual and emotional cognition, and that’s precisely what makes it difficult to use well — what’s strong and confident to one person can be jarring or alarming to another.

**Start in black and white.** Start with your core message and use type scale and hierarchy to test and refine its effectiveness. Then introduce color to support that message. Color can overwhelm interpretation, and since [approximately 4.5% of the population](https://nei.nih.gov/health/color_blindness/facts_about) has some kind of color insensitivity, it’s important not to rely on color to convey information critical to your message.

**Put the practical before the emotional.** Because color can do so much, it can be smart to be focused. Limit the complexity of color by concentrating on functional requirements (like status states or directions) first. Then, use color as progressive enhancement to reinforce or balance the emotional needs of the content. Even so, bear in mind that the effects of color are often personal and cultural as much, or more so, than physiological. Understand that using color to optimize for tone necessarily excludes in in subtle and not-so-subtle ways.

**Use mood boards for guidance.** It can be challenging to derive appropriate color palettes, and it makes sense to let existing colors and palettes be your guide. Collect images from other sources that evoke the desired tone to find commonalities. Then, find close matches in the system palette to help build your theme.

**Ask visual designers.** Your group or agency may have visual designers either on staff or available as contractors. They can be an invaluable resource for building palettes or getting feedback on existing ones. USWDS benefits from the collective experience of visual designers across agencies to build our system palette, and to provide a range of prebuilt project theme palettes. If you have visual design resources, use them.

**Don’t use color exclusively to convey meaning.** Even Section 508 conformant contrast doesn’t ensure that colors are distinguishable for a significant percentage of your audience. [Approximately 0.5% of adult women and 8% of adult men](https://nei.nih.gov/health/color_blindness/facts_about) have some kind of color insensitivity, especially between red and green. Color should only be used as progressive enhancement — if color is the only signal, that signal won’t get through as intended to everyone.

## References
- Accessibility: Color and contrast
  [https://accessibility.digital.gov/visual-design/color-and-contrast](https://accessibility.digital.gov/visual-design/color-and-contrast){:.display-block}
- Color and readability
  [https://www.w3.org/WAI/RD/2012/text-customization/r11](https://www.w3.org/WAI/RD/2012/text-customization/r11){:.display-block}
- Improving accessibility for colorblind users
  [https://www.smashingmagazine.com/2016/06/improving-color-accessibility-for-color-blind-users/](https://www.smashingmagazine.com/2016/06/improving-color-accessibility-for-color-blind-users/){:.display-block}
- Introduction to Irlen Syndrome
  [https://irlen.com/what-is-irlen-syndrome/](https://irlen.com/what-is-irlen-syndrome/){:.display-block}
- Making content accessible for those with dyslexia
  [https://www.dyslexic.com/blog/quick-guide-making-content-accessible/](https://www.dyslexic.com/blog/quick-guide-making-content-accessible/){:.display-block}
- W3C: Contrast levels for readability
  [https://www.w3.org/WAI/test-evaluate/preliminary/#contrast](https://www.w3.org/WAI/test-evaluate/preliminary/#contrast){:.display-block}
- W3C: Gap analysis of the state of accessibility for people with learning disabilities and cognitive disabilities
  [https://w3c.github.io/wcag/coga/gap-analysis.html](https://w3c.github.io/wcag/coga/gap-analysis.html){:.display-block}
- W3C: Low vision needs
  [https://www.w3.org/TR/low-vision-needs/](https://www.w3.org/TR/low-vision-needs/){:.display-block}