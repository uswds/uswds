---
permalink: /getting-started/developers/
layout: styleguide
title: For developers
subheading: Getting started
lead: The UI components are built on a solid HTML foundation, progressively enhanced to provide core experiences across browsers. All users will have access to the same critical information and experiences regardless of what browser they use, although those experiences will render better in newer browsers. If JavaScript fails, users will still get a robust HTML foundation.
---

## Installation<a id="installation"></a>

Here are a few different ways to use the Standards within your project.

### Download

To use the Draft Web Design Standards on your project, you’ll need to include the CSS and JavaScript files in each HTML page in your project.

First, download the Draft Web Design Standards assets:

[https://github.com/18F/web-design-standards/releases/download/v{{ site.version }}/uswds-{{ site.version }}.zip](https://github.com/18F/web-design-standards/releases/download/v{{ site.version }}/uswds-{{ site.version }}.zip)

Then, add the following folders into a relevant place in your code base — likely a directory where you keep third-party libraries:

```
uswds-{{ site.version }}/
├── js/
│   ├── uswds.min.js.map
│   ├── uswds.min.js
│   └── uswds.js
├── css/
│   ├── uswds.min.css.map
│   ├── uswds.min.css
│   └── uswds.css
├── img/
└── fonts/
```

Refer to these files by adding the following `<link>` and `<script>` elements
into your HTML pages:

Add this to your `<head>` element:

```html
<link rel="stylesheet" href="/path/to/your/assets/css/lib/uswds.min.css">
```

Add this before the closing `</body>` tag:

```html
<script src="/path/to/your/assets/js/lib/uswds.min.js"></script>
```

We offer two versions — a minified version, and an un-minified one. Use the minified version in a production environment or to reduce the file size
of your downloaded assets. And the un-minified version is better if you are in a
development environment or would like to debug the CSS or JavaScript assets in
the browser. The examples above recommend using the minified versions.

This version of the Standards includes jQuery version `2.2.0` bundled within the
JavaScript file. Please make sure that you're not including any other version
of jQuery on your page.

And that’s it — you should be set to use the Standards.

### Using npm

If you have `node` installed on your machine, you can use npm to install the Standards. Add `uswds`
to your project's `package.json` as a dependency:

```shell
npm install --save uswds
```

The package will be installed in `node_modules/uswds`. You can use the un-compiled files
found in the `src/` or the compiled files in the `dist/` directory.

```
node_modules/uswds/
├── dist/
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
└── src/
    ├── fonts/
    ├── img/
    ├── js/
    └── stylesheets/
```

`require('uswds')` will load all of the Draft U.S. Web Design Standard's JavaScript onto the page. The `uswds` module itself does not export anything.

The main Sass (SCSS) source file is here:

```
node_modules/uswds/src/stylesheets/all.scss
```

The non-minified CSS that’s been precompiled is here:

```
node_modules/uswds/dist/css/uswds.css
```

### Using another framework or package manager

If you’re using another framework or package manager that doesn’t support NPM, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the [download instructions](#download). Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/18F/web-design-standards/issues/877).

If you’re interested in maintaining a package that helps us distribute the Draft U.S. Web Design Standards, the project's build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](CONTRIBUTING.md#building-the-project-locally-with--gulp-) to locally build distributions for your framework or package manager.

### Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

You can also email us directly at uswebdesignstandards@gsa.gov.

## CSS architecture<a id="css-architecture"></a>

* The CSS foundation of this site is built with the **[Sass](https://sass-lang.com)** preprocessor language.
* Uses **[Bourbon](http://bourbon.io/)** for its simple and lightweight Sass mixin library, and the **[Neat](http://neat.bourbon.io/)** library for the grid framework. Bourbon and Neat are open-source products from **[thoughtbot](https://thoughtbot.com/)**.
* The CSS organization and naming conventions follow **[18F's CSS Coding Styleguide](https://pages.18f.gov/frontend/css-coding-styleguide/)**.
* CSS selectors are **prefixed** with `usa` (For example: `.usa-button`).
* Uses a **[modified BEM](https://pages.18f.gov/frontend/css-coding-styleguide/naming/)** approach created by 18F for naming CSS selectors. Objects in CSS are separated by single dashes. Multi-word objects are separated by an underscore (For example: `.usa-button-cool_feature-active`).
* Uses **modular CSS** for scalable, modular, and flexible code.
* Uses **nesting** when appropriate. Nest minimally with up to two levels of nesting.
* **Global variables** are defined in the _variables.scss file. This is where custom theming can be done to change site-wide colors, fonts, etc.
* Hard-coded magic numbers are avoided and, if necessary, defined in the `_variables.scss` file.
* Media queries are built **mobile first**.
* **Spacing units** are as much as possible defined as rem or em units so they scale appropriately with text size. Pixels can be used for detail work and should not exceed 5px (For example: 3px borders).

**For more information, visit:  
[https://pages.18f.gov/frontend/css-coding-styleguide/](https://pages.18f.gov/frontend/css-coding-styleguide/)**

## Where things live<a id="where-things-live"></a>

* **HTML** markup for the components are located in: `docs/_visual, docs/_layout-system, docs/_elements, docs/_components` in the site root.
* **Sass** styles are located in: `src/stylesheets/ (/core, /elements, /components)`. **Compiled CSS** is located in the [downloadable zip file]({{ site.repos[0].url }}/releases/download/v{{ site.version }}/uswds-{{ site.version }}.zip) .
* **JS** is located in: `src/js/components (accordion.js, toggle-field-mark.js, toggle-form-input.js, validator.js)`.
* **Fonts** are located in: `src/fonts`.
* **Images** and icons are located in: `src/img`.

## Notes on accessibility<a id="notes-on-accessibility"></a>

We’ve designed the Standards to support older and newer browsers through progressive enhancement, and they officially support Internet Explorer 9 and up, along with the latest versions of Chrome, Firefox, and Safari. Internet Explorer 8 and below generally see very low usage, and most agency websites should be able to safely begin support at Internet Explorer 9.

The Standards also meet the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and are compliant with [Section 508 of the Rehabilitation Act](http://www.section508.gov/). We’re happy to answer questions about accessibility — email us for more information. 

## Contribution guidelines<a id="contribution-guidelines"></a>

Welcome!

We're so glad you're thinking about contributing to the Standards! You can find our complete [contribution guidelines](https://github.com/18F/web-design-standards/blob/staging/CONTRIBUTING.md) in our repo — please review them before submitting your contribution.

If you have any questions about these guidelines (or the Standards, more generally), don’t hesitate to [email us](mailto:uswebdesignstandards@gsa.gov) — we’ll get back to you within 48 hours. 
