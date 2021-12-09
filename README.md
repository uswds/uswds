# United States Web Design System

[![CircleCI Build Status](https://img.shields.io/circleci/build/gh/uswds/uswds/develop?style=for-the-badge&logo=circleci)](https://circleci.com/gh/uswds/uswds/tree/develop) ![Snyk vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/uswds?style=for-the-badge) [![npm Version](https://img.shields.io/npm/v/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![npm Downloads](https://img.shields.io/npm/dt/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![GitHub issues](https://img.shields.io/github/issues/uswds/uswds?style=for-the-badge&logo=github)](https://github.com/uswds/uswds/issues) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?style=for-the-badge)](https://github.com/prettier/prettier)

The [United States Web Design System](https://designsystem.digital.gov) includes a library of open source UI components and a visual style guide for U.S. federal government websites.

This repository is for the design system code itself. We maintain [another repository for the documentation and website](https://github.com/uswds/uswds-site). To see the design system and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

## Contents

- [United States Web Design System](#united-states-web-design-system)
  - [Contents](#contents)
  - [Background](#background)
  - [Recent updates](#recent-updates)
  - [Getting started](#getting-started)
  - [Using the design system](#using-the-design-system)
    - [Download and install without npm](#download-and-install-without-npm)
  - [CSS architecture](#css-architecture)
  - [JS customization](#js-customization)
  - [Customization, theming, and tokens](#customization-theming-and-tokens)
    - [Using tokens in theme settings](#using-tokens-in-theme-settings)
    - [Set the base asset paths (fonts and images)](#set-the-base-asset-paths-fonts-and-images)
  - [Where things live](#where-things-live)
  - [Browser support](#browser-support)
  - [Accessibility](#accessibility)
  - [Fractal](#fractal)
    - [Template compatibility](#template-compatibility)
  - [Long-term support of v1.x](#long-term-support-of-v1x)
  - [Need installation help?](#need-installation-help)
  - [Contributing to the code base](#contributing-to-the-code-base)
  - [Reuse of open-source style guides](#reuse-of-open-source-style-guides)
  - [Licenses and attribution](#licenses-and-attribution)
  - [Contributing](#contributing)

## Background

USWDS's components and style guide follow industry-standard accessibility guidelines and use the best practices of existing style libraries and modern web design. The [U.S. Digital Service](https://www.usds.gov/) and [18F](https://18f.gsa.gov/) created USWDS for designers and developers. USWDS is a project of GSA’s [Technology Transformation Service](https://www.gsa.gov/about-us/organization/federal-acquisition-service/technology-transformation-services), maintained by the Office of Products and Programs. It is designed for use by government product teams who want to create beautiful, easy-to-use online experiences for the public. To learn more about the project, check out this [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/), and to view websites and applications, check out our list [here](docs/WHO_IS_USING_USWDS.md).

## Recent updates

Information about the most recent release of the design system can always be found in the [release history](https://github.com/uswds/uswds/releases). We include details about significant updates and any backward-incompatible changes along with a list of all changes.

## Getting started

We’re glad you’d like to use the design system — here’s how you can get started:

- Designers: Check out our [Getting started for designers information](https://designsystem.digital.gov/documentation/getting-started-for-designers/).
- Developers: Follow the guidance on our website to [get started with `npm` (recommended)](https://designsystem.digital.gov/documentation/getting-started-for-developers/). Follow the instructions in this README to [get started without `npm`.](#using-the-design-system)
  - [CSS, JavaScript, image, and font files of all the assets on this site are available for download](https://github.com/uswds/uswds/releases/latest).

## Using the design system

How you implement the design system depends on the needs of your project and your workstyle. We recommend implementing the design system with `npm`, but we also provide a direct download if `npm` will not work for you or your project.

- **[Download the design system](#download-and-install-without-npm)** if you are not familiar with `npm` and package management.

- **[Use the design system `npm` package](https://designsystem.digital.gov/documentation/getting-started-for-developers/)** if you are familiar with using `npm` and package management.

If you’re interested in maintaining a package that helps us distribute USWDS, the project’s build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](CONTRIBUTING.md#building-the-project-locally-with--gulp-) to locally build distributions for your framework or package manager.

### Download and install without `npm`
If you’re using a framework or package manager that doesn’t support `npm`, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the steps outlined in this section. Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/uswds/uswds/issues/877).

1. Download the [USWDS zip file](https://github.com/uswds/uswds/releases/download/v2.12.2/uswds-2.12.2.zip) from the latest USWDS release and open that file.

   After extracting the zip file you should see the following file and folder structure:

   ```
   uswds-2.12.2/
   ├── css/
   │   ├── uswds.min.css.map
   │   ├── uswds.min.css
   │   └── uswds.css
   ├── fonts/
   ├── img/
   ├── js/
   │   ├── uswds-init.js
   │   ├── uswds-init.min.js
   │   ├── uswds-init.min.js.map
   │   ├── uswds.min.js.map
   │   ├── uswds.min.js
   │   └── uswds.js
   └── scss/

   ```

   The three files critical to any USWDS project are the **stylesheet**, the **library**, and the **intializer**. Any project requires both the stylesheet and library to function properly.

   **Stylesheet:** This is the compiled CSS stylesheet that describes how design system components look. Reference either `uswds.css` or `uswds.min.css` in the `<head>` of your document.

   **Library:** This is the compiled JavaScript that controls component interactivity. Reference either `uswds.js` or `uswds.min.js` at the end of the `<body>` of your document.

   **Initializer:** This small JavaScript file (less than 1 KB minified) helps the browser know if the USWDS JavaScript library is loading properly. This prevents component content from "flashing" or "shifting" while the page loads. Reference `uswds-init.min.js` in the `<head>` of your page, or inline its contents directly into the `<script>` tag.

2. Copy these files and folders into a relevant place in your project's code base. Here is an example structure for how this might look:

   ```
   example-project/
   ├── assets/
   │   ├── uswds-2.12.2/
   │   ├── stylesheets/
   │   ├── images/
   │   └── javascript/
   └── index.html
   ```

   You'll notice in our example above that we also outline a `stylesheets`, `images` and `javascript` folder in your `assets` folder. These folders are to help organize any assets that are unique to your project and separate from the design system assets.

3. Reference the stylesheet, library, and initializer in each HTML page or dynamic template in your project. We also provide Sass (.scss) files in the zip package which you should use to generate new CSS with project-specific settings. See [Sass and theme settings](#sass-and-theme-settings) for more information.

   Here is an example of how to reference these assets in your `index.html` file:

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <meta charset="utf-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <title>My Example Project</title>
       <script src="assets/uswds-2.12.2/js/uswds-init.min.js"></script>
       <link rel="stylesheet" href="assets/uswds-2.12.2/css/uswds.min.css" />
     </head>
     <body>
       <script src="assets/uswds-2.12.2/js/uswds.min.js"></script>
     </body>
   </html>
   ```

We offer both the CSS and the JavaScript in two versions — minified and un-minified. (In the examples above, we are using the minified files.) Use the minified files in a production environment or to reduce the file size of your downloaded assets. Use the un-minified files if you are in a development environment or would like to debug the CSS or JavaScript assets in the browser.

And that’s it — you should now be able to copy our code samples into your `index.html` and start using the design system.

## CSS architecture

- The CSS foundation of this site is built with the **[Sass](https://sass-lang.com)** preprocessor language.
- The CSS organization and naming conventions follow **[18F’s Front End Guide](https://frontend.18f.gov/css/)**.
- We format our code with [Prettier](https://prettier.io/), per the formatting section of the **[18F Front End Guide](https://frontend.18f.gov/css/formatting/)**.
- CSS selectors are **prefixed** with `usa` (For example: `.usa-button`). This identifier helps the design system avoid conflicts with other styles on a site which are not part of USWDS.
- Uses a **[BEM](http://getbem.com/)** approach for naming CSS selectors. Blocks are separated from elements with two underscores (`__`). Multi-word blocks use single hyphens instead of spaces. Modifier classes are additive — proper markup requires the base class _and_ the modifier class or classes. Modifier classes consist of the base class plus a modifier suffix, separated by two hyphens (`--`) as in `.usa-button.usa-button--secondary` or `usa-accordion.usa-accordion--bordered`.
- Uses **modular CSS** for scalable, modular, and flexible code.
- Uses **nesting** when appropriate. Nest minimally with up to two levels of nesting.
- Hard-coded magic numbers are avoided.
- Media queries are built **mobile first**.
- **Spacing units** are set with the `units()` function as described in [the USWDS 2.0 documentation](https://designsystem.digital.gov/design-tokens/spacing-units/). In general, we use spacing in multiples of `8px` — expressed as a multiple in `units([multiple])`. For instance `units(2)` is the equivalent of `2 * 8px` or `16px`. In the final, compiled CSS, this value will be expressed in rem, as a multiple of the base font size set with `$theme-base-font-size`.

**For more information, visit:**
[18F’s CSS Front End Guide](https://frontend.18f.gov/css/)

## JS customization

**Unfortunately, customizing the JavaScript for the USWDS currently requires NodeJS and a module bundler like Browserify or Webpack. We apologize for this inconvenience, and are working to resolve it in a future release of the design system.**

USWDS JavaScript is separated into components (just as with the CSS and HTML) and initialized with event handlers when the DOM is ready. These components are accessible as CommonJS modules that can be required in other JavaScript files, then built for the browser. The components are not accessible in the global browser scope, but can be extended to be included by requiring `components` and setting it to a global scope:

```js
window.uswds = require("./components");
```

Each component has a standardized interface that can be used to extend it further. The components store a HTML class (like `.usa-accordion__button[aria-controls]`) used to link HTML elements with the JavaScript component. When a component is initialized, it searches through the current HTML DOM to find all elements that match the class and initializes the component JavaScript for those elements. The primary methods for each component include:

- `on`: Initialize a component's JavaScript behavior by passing the root element, such as `window.document`.
- `off`: The opposite of `on`, de-initializes a component, removing any JavaScript event handlers on the component.
- `hide`: Hide the whole component.
- `show`: Shows a whole, hidden component.
- `toggle`: Toggles the visibility of a component on and off based on the previous state.

Some components have additional methods based on that component's functionality. Any additional methods are found in that component's JavaScript file.

**If you’re using a modern framework like React or Angular you can import components and initialize them in your library's DOM ready lifecycle event.**

Importing a modular component.

```js
import USWDS from "../node_modules/uswds/src/js/components";
const { characterCount, accordion } = USWDS; // deconstruct your components here
```

React hooks example:

```js
function App() {
  const ref = document.body;

  useEffect(() => {
    // initialize
    characterCount.on(ref);
    // default ref is document.body, if you want to use
    // default you do not have to pass arguments
    accordion.on();

    // remove event listeners when component un-mounts.
    return () => {
      characterCount.off();
      accordion.off();
    };
  });
}
```

Angular example:

```js
export class App implements OnInit {
  constructor() {
    this.ref = document.body;
    // default ref is document.body, if you want to use
    // default you do not have to pass arguments
  }

  ngOnInit() {
    // initialize
    characterCount.on(this.ref);
    accordion.on();
  }

  // remove event listeners when component un-mounts.
  ngOnDestroy() {
    characterCount.off();
    accordion.off();
  }
}
```

> Those using **Webpack 5** can take advantage of the updated exports field which allows declaration for requests like `import "uswds"` or `import accordion from "uswds/src/js/components/accordion"`

## Customization, theming, and tokens

USWDS 2.0 provides extensive support for theming via its theme settings files introduced in [Sass and theme settings](#sass-and-theme-settings), above.

Set theme settings with USWDS design tokens, not with values directly. They tend to be quoted strings like `'desktop'` or `'md'` or unitless numbers like `2` or `-1.5`. Tokens are the values _passed into_ the USWDS functions and mixins that parse them. They are the _keys_ that, through the mechanism of a function or mixin, unlock a _value_ — they are not the values themselves.

Visit the [Design tokens section](https://designsystem.digital.gov/design-tokens/) of USWDS 2.0 documentation for more on the available tokens for [color](https://designsystem.digital.gov/design-tokens/color), [spacing units](https://designsystem.digital.gov/design-tokens/spacing-units), [font size](https://designsystem.digital.gov/design-tokens/typesetting/font-size/), and more.

### Using tokens in theme settings

The following is an example of theme settings from `_uswds-theme-spacing.scss`:

```scss
$theme-site-max-width: "desktop";
$theme-site-margins-breakpoint: "desktop";
$theme-site-margins-width: 4;
$theme-site-margins-mobile-width: 2;
```

The USWDS uses those tokens to build component styles:

```scss
.usa-example {
  @include u-padding-x($theme-site-margins-mobile-width);
  max-width: units($theme-site-max-width);

  @include at-media($theme-site-margins-breakpoint) {
    @include u-padding-x($theme-site-margins-width);
  }
}
```

This is the functional equivalent of:

```scss
.usa-example {
  @include u-padding-x(2);
  max-width: units("desktop");

  @include at-media("desktop") {
    @include u-padding-x(4);
  }
}
```

Which, if `$theme-respect-user-font-size` is set to `true` would output something like:

```css
.usa-example {
  padding-left: 1rem;
  padding-right: 1rem;
  max-width: 64rem;
}

@media screen and (min-width: 64em) {
  .usa-example {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
```

In general, USWDS sets **variables** with **tokens**, and passes those variables into **functions and mixins** in the source Sass.

### Set the base asset paths (fonts and images)

The values of `$theme-font-path` and `$theme-image-path` will be appended to USWDS font paths and image paths, respectively:

```
$theme-font-path:   '../fonts';
$theme-image-path:  '../img';
```

## Where things live

- **HTML** markup for the components is located in: `src/components` in the site root. These, however, are written in the templating language Nunjucks. It's best to get HTML source markup directly from [designsystem.digital.gov/components](https://designsystem.digital.gov/components)
- **Sass** stylesheets are located in: `dist/scss/ (/core, /elements, /components)`. **Compiled CSS** is located in the [downloadable zip file](https://github.com/uswds/uswds/releases/latest).
- **JS** is located in: `src/js (/components, /utils)`.
- **Fonts** are located in: `dist/fonts`.
- **Images** and icons are located in: `dist/img`.

## Browser support

We’ve designed the design system to support older and newer browsers through [progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement). The current major version of the design system (2.0) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/). Currently, this means that the design system version 2.0 supports the newest versions of Chrome, Firefox, Safari, and Internet Explorer 11 and up.

## Accessibility

The design system also meets the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and conforms to the standards of [Section 508 of the Rehabilitation Act](http://www.section508.gov/).

We use the following tools to ensure USWDS is accessible:
- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html).
- [Axe core](https://www.deque.com/axe/).
- [Axe dev tools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US).

We’re happy to answer questions about accessibility — email us for more information.

## Fractal

We're using [Fractal](http://fractal.build) to generate an interactive component library for the design system. You can run it locally after `npm install` with:

```sh
npm start
```

Then, visit [http://localhost:3000/](http://localhost:3000/) to see the design system in action.

_**Optional**: To re-build when code changes are made, run the following command from the project directory in a separate terminal window:_

```sh
npm run watch
```

### Template compatibility

Many of our Fractal view templates are compatible with [Nunjucks](https://mozilla.github.io/nunjucks/) (for JavaScript/Node), [Jinja](http://jinja.pocoo.org/docs/2.9/) (Python), and [Twig](https://twig.sensiolabs.org/) (PHP) out of the box. Components that reference other components use a Fractal-specific `{% render %}` tag that will either need to be implemented in other environments or replaced with the appropriate `{% include %}` tags.

## Long-term support of v1.x

[Version 1.x](https://v1.designsystem.digital.gov) is in maintenance mode. We will only make critical updates like security patches.

## Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/uswds/uswds/issues](https://github.com/uswds/uswds/issues).

You can also email us directly at uswds@gsa.gov.

## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the design system style guide website for development.

If you would like to learn more about our workflow process, check out the [Workflow](https://github.com/uswds/uswds/wiki/Workflow) and [Issue label Glossary](https://github.com/uswds/uswds/wiki/Issue-label-glossary) pages on the wiki.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/uswds/uswds/issues) or [emailing our team](mailto:uswebdesignstandards@gsa.gov).

## Reuse of open-source style guides

Much of the guidance in USWDS leans on open source designs, code, and patterns from other civic and government organizations, including:

- Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
- U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
- Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
- UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
- Code for America’s Chime [Styleguide](https://github.com/chimecms/chime-starter)
- Pivotal Labs [Component Library](http://styleguide.cfapps.io/)

## Licenses and attribution

A few parts of this project are not in the public domain. Attribution and licensing information for those parts are described in detail in [LICENSE.md](LICENSE.md).

The rest of this project is in the worldwide public domain, released under the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

## Contributing

All contributions to this project will be released under the CC0 dedication alongside the public domain portions of this project. For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).
