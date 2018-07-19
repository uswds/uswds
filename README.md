# U.S. Web Design System

[![CircleCI Build Status](https://circleci.com/gh/uswds/uswds/tree/develop.svg?style=shield)](https://circleci.com/gh/uswds/uswds/tree/develop) [![Test Coverage](https://api.codeclimate.com/v1/badges/c10cd4505d61d161cd3a/test_coverage)](https://codeclimate.com/github/uswds/uswds/test_coverage)

The [U.S. Web Design System](https://designsystem.digital.gov) includes a library of open source UI components and a visual style guide for U.S. federal government websites.

This repository is for the Design System itself. We maintain [another repository for the documentation and website](https://github.com/uswds/uswds-site). To see the Design System and documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

## Contents

* [Background](#background)
* [Recent updates](#recent-updates)
* [Getting started](#getting-started)
* [Using the Design System](#using-the-design-system)
  * [Download](#download)
  * [Install using `npm`](#install-using-npm)
    * [Importing assets](#importing-assets)
    * [Sass](#sass)
    * [JavaScript](#javascript)
  * [Use another framework or package manager](#use-another-framework-or-package-manager)
* [CSS architecture](#css-architecture)
* [JS customization](#js-customization)
* [Customization and theming](#customization-and-theming)
  * [Set the base asset path (fonts and images)](#set-the-base-asset-path-fonts-and-images)
  * [Main variables that can be customized](#main-variables-that-can-be-customized)
* [Where things live](#where-things-live)
* [Browser support](#browser-support)
* [Accessibility](#accessibility)
* [Fractal](#fractal)
  * [Template compatibility](#template-compatibility)
* [Need installation help?](#need-installation-help)
* [Contributing to the code base](#contributing-to-the-code-base)
* [Reuse of open-source style guides](#reuse-of-open-source-style-guides)
* [Licenses and attribution](#licenses-and-attribution)

## Background

The components and style guide of the U.S. Web Design System follows industry-standard web accessibility guidelines and use the best practices of existing style libraries and modern web design. The [U.S. Digital Service](https://www.whitehouse.gov/digital/united-states-digital-service) and [18F](https://18f.gsa.gov/) created the U.S. Web Design System for designers and developers. The U.S. Web Design System is a project of GSA’s [Technology Transformation Service](https://www.gsa.gov/about-us/organization/federal-acquisition-service/technology-transformation-services), maintained by the Office of Products and Programs. They are designed for use by government product teams who want to create beautiful, easy-to-use online experiences for the public. To learn more about the project, check out this [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/) and to view websites and applications check out our list [here](docs/WHO_IS_USING_USWDS.md).


## Recent updates

Information about the most recent release of the Design System can always be found in the [release history](https://github.com/uswds/uswds/releases). We include details about significant updates and any backwards incompatible changes along with a list of all changes.


## Getting started

We’re glad you’d like to use the Design System — here’s how you can get started:

* Designers: [Check out our Getting Started for Designers information](https://designsystem.digital.gov/getting-started/designers/).
  * [Design files of all the assets included in the Design System are available for download](https://github.com/uswds/uswds-assets/archive/master.zip).
* Developers: [Follow the instructions in this README to get started.](#using-the-design-system)
  * [CSS, JavaScript, image, and font files of all the assets on this site are available for download](https://github.com/uswds/uswds/releases/latest).


## Using the Design System

There are a few different ways to use the Design System within your project. Which one you choose depends on the needs of your project and how you are most comfortable working. Here are a few notes on what to consider when deciding which installation method to use:

*Download the Design System if:*
- You are not familiar with `npm` and package management.

*Use the Design System `npm` package if:*
- You are familiar with using `npm` and package management.

### Download

1. Download the [USWDS zip file](https://github.com/uswds/uswds/releases/latest) from the latest release and open that file.

    After extracting the zip file you should see the following file and folder structure:

    ```
    uswds-1.0.0/
    ├── css/
    │   ├── uswds.min.css.map
    │   ├── uswds.min.css
    │   └── uswds.css
    ├── fonts/
    ├── img/
    ├── js/
    │   ├── uswds.min.js.map
    │   ├── uswds.min.js
    │   └── uswds.js
    └── scss/

    ```

2. Copy these files and folders into a relevant place in your project's code base. Here is an example structure for how this might look:

    ```
    example-project/
    ├── assets/
    │   ├── uswds-1.0.0/
    │   ├── stylesheets/
    │   ├── images/
    │   └── javascript/
    └── index.html
    ```

    You'll notice in our example above that we also outline a `stylesheets`, `images` and `javascript` folder in your `assets` folder. These folders are to help organize any assets that are unique to your project.

3. To use the Design System on your project, you’ll need to reference the [CSS (*C*ascading *S*tyle *S*heets)](https://developer.mozilla.org/en-US/docs/Web/CSS) and JavaScript files in each HTML page or dynamic templates in your project. (We also provide Sass (SCSS) files in the zip file which you can compile to CSS. See [Sass](#sass).)

    Here is an example of how to reference these assets in your `index.html` file:

    ```html
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>My Example Project</title>
      <link rel="stylesheet" href="assets/uswds-1.0.0/css/uswds.min.css">
    </head>
    <body>

      <script src="assets/uswds-1.0.0/js/uswds.min.js"></script>
    </body>
    </html>
    ```

We offer both files, the CSS and the JavaScript, in two versions — a minified version, and an un-minified one. (In the examples above, we are using the minified files.) Use the minified files in a production environment or to reduce the file size of your downloaded assets. And the un-minified files are better if you are in a development environment or would like to debug the CSS or JavaScript assets in the browser.

And that’s it — you should now be able to copy our code samples into your `index.html` and start using the Design System.

### Install using npm

`npm` is a package manager for Node based projects. The U.S. Web Design System maintains a [`uswds` package](https://www.npmjs.com/package/uswds) for you to utilize both the pre-compiled and compiled files on your project.

1. Install `Node/npm`. Below is a link to find the install method that coincides with your operating system:

    - Node v4.2.3+, [Installation guides](https://nodejs.org/en/download/)

    **Note for Windows users:** If you are using Windows and are unfamiliar with `Node` or `npm`, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information.

2. Make sure you have installed it correctly:

    ```shell
    npm -v
    3.10.8 # This line may vary depending on what version of Node you've installed.
    ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `uswds` to your project’s `package.json`:

    ```shell
    npm install --save uswds
    ```

The `uswds` module is now installed as a dependency. You can use the un-compiled files found in the `src/` or the compiled files in the `dist/` directory.

```
node_modules/uswds/
├── dist/
│   ├── css/
│   ├── fonts/
│   ├── img/
│   ├── js/
│   └── scss/
└── src/
    |── components/
    ├── fonts/
    ├── img/
    ├── js/
    └── stylesheets/
```

#### Importing assets

Since you are already using `npm`, the U.S. Web Design System team recommends leveraging the ability to write custom scripts. Here are some links to how we do this with our docs website using `npm` + [`gulp`](http://gulpjs.com/):

[Link to `npm` scripts example in `uswds-site`](https://github.com/uswds/uswds-site/blob/master/package.json#L28)

[Link to gulpfile.js example in `uswds-site`](https://github.com/uswds/uswds-site/blob/master/gulpfile.js)

#### Sass

The Design System is easily customizable using the power of [Sass (Syntactically Awesome Style Sheets)](http://sass-lang.com/). The main Sass (SCSS) source file is located here:

```
node_modules/uswds/src/stylesheets/uswds.scss
```

Global variables are defined in the `node_modules/uswds/src/stylesheets/core/_variables.scss` file. Custom theming can be done by copying the `_variables.scss` file into your own project’s Sass folder, changing applicable variable values, and importing it before `uswds.scss`.

Below is an example of how you might setup your main Sass file to achieve this:

```scss
@import 'variables.scss'; # Custom Sass variables file
@import 'node_modules/uswds/src/stylesheets/uswds.scss';
```

You can now use your copied version of `_variables.scss` to override any styles to create a more custom look and feel to your application.

The Design System uses [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer) to automatically add vendor prefixes to the precompiled stylesheets (`css/uswds.min.css` and `css/uswds.css`) however prefixes will not be applied when using the Sass source files directly. If your project requires the use of Sass and vendor prefixes we recommend incorportaing a plugin such as [Autoprefixer](https://github.com/postcss/autoprefixer) into your build process.

#### JavaScript
`require('uswds')` will load all of the U.S. Web Design System’s JavaScript onto the page. Add this line to whatever initializer you use to load JavaScript into your application.

### Use another framework or package manager

If you’re using another framework or package manager that doesn’t support `npm`, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the [download instructions](#download). Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/uswds/uswds/issues/877).

If you’re interested in maintaining a package that helps us distribute the U.S. Web Design System, the project’s build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](CONTRIBUTING.md#building-the-project-locally-with--gulp-) to locally build distributions for your framework or package manager.


## CSS architecture

* The CSS foundation of this site is built with the **[Sass](https://sass-lang.com)** preprocessor language.
* Uses **[Bourbon](http://bourbon.io/)** for its simple and lightweight Sass mixin library, and the **[Neat](http://neat.bourbon.io/)** library for the grid framework. Bourbon and Neat are open-source products from **[thoughtbot](https://thoughtbot.com/)**.
* The CSS organization and naming conventions follow **[18F’s CSS Front End Guide](https://frontend.18f.gov/css/)**.
* CSS selectors are **prefixed** with `usa` (For example: `.usa-button`). This identifier helps the design system avoid conflicts with other styles on a site which are not part of the U.S. Web Design System.
* Uses a **[modified BEM](https://frontend.18f.gov/css/naming/)** approach created by 18F for naming CSS selectors. Objects in CSS are separated by single dashes. Multi-word objects are separated by an underscore (For example: `.usa-button-cool_feature-active`).
* Uses **modular CSS** for scalable, modular, and flexible code.
* Uses **nesting** when appropriate. Nest minimally with up to two levels of nesting.
* Hard-coded magic numbers are avoided and, if necessary, defined in the `core/variables` scss file.
* Media queries are built **mobile first**.
* **Spacing units** are as much as possible defined as rem or em units so they scale appropriately with text size. Pixels can be used for detail work and should not exceed 5px (For example: 3px borders).

**For more information, visit:**
[18F’s CSS Front End Guide](https://frontend.18f.gov/css/)


## JS customization

**Unfortunately, customizing the JavaScript for the USWDS currently requires NodeJS and a module bundler like Browserify or Webpack. We apologize for this inconvenience, and are working to resolve it in a future release of the Design System.**

The JavaScript for the USWDS is separated into components in the same manner as the visual interface which is all initialized with event handlers when the DOM is ready. These components are accessible as CommonJS modules that can be required in other JavaScript files which then must be built for the browser. The components are currently not accessible in the global browser scope, but can be extended to be included by requiring `components` and setting it to a global scope:

```js
window.uswds = require('./components');
```

Each component has a standardized interface that can be used to extend it further. The components store a HTML class name (e.g. `.usa-accordion-button[aria-controls]`) that's used to link HTML elements with the JS component, so when a component is initialized, it will search through the current HTML DOM finding all elements that match its class and inialize the component JavaScript for those elements. The primary methods each component has are as follows:

- `on`: Initialize a component's JavaScript behavior by passing the root element, such as `window.document`.
- `off`: The opposite of `on`, de-initializes a component, removing any JavaScript event handlers on the component.
- `hide`: Hide the whole component.
- `show`: Shows a whole, hidden component.
- `toggle`: Toggles the visibility of a component on and off based on the previous state.

Some components have additional methods for manipulating specific aspects of them based on what they are and what they do. These can be found in the component's JS file.


## Customization and theming

The Design System can be customized to use different typography, colors and grid systems. The easiest way to do this is to use Sass and override the Design System’s global variables. If it isn’t possible to use Sass, do theming by overriding the CSS rules in the Design System set.

To start theming through Sass, copy the `core/variables` file into your own project’s Sass folder, changing applicable variable values, and importing it before the WDS. Below is an example of customizing the import of the Design System's all.scss file.

```scss
// src/main.scss
@import 'path/to/my/scss/files/main/scss/my-custom-vars';
@import 'lib/uswds/src/stylesheets/all';
```

```scss
// path/to/my/scss/files/main/scss/my-custom_vars.scss

// Colors
$color-primary: #2c3e50;
$color-secondary: #ad2020;
$color-secondary-dark: #b0392e;

// Typography
$font-serif: 'Georgia', 'Times', serif;
$h2-font-size: 2rem;
$h3-font-size: 1.75rem;
$heading-line-height: 1.4;

// Grid/breakpoints
$small-screen:  540px !default;
$medium-screen: 620px !default;
$large-screen:  1120px !default;
```

### Set the base asset path (fonts and images)
If you copy the USWDS `dist` directory to a folder on your project or your fonts and images are in the same folder, set the location of the directory with `$asset-path: path/to/my/assets/`. The default is set to `$asset-path: ../`. This will be appended to the font and image path variables so you only need to set this variable. You can also set the font and image paths individually:

```
$font-path: path/to/my/fonts;
$image-path: path/to/my/images;
```

NOTE: If you plan on upgrading to newer versions of the Design System in the future, or are not using your own forked version of the Design System, try to avoid making changes in the Design System folder itself. Doing so could make it impossible to upgrade in the future without undoing your custom changes.

### Main variables that can be customized
* Colors can be found in the `core/variables` [file, line 35](https://github.com/uswds/uswds/blob/develop/src/stylesheets/core/_variables.scss#L35).
* Font families can be found in the `core/variables` [file, line 28](https://github.com/uswds/uswds/blob/develop/src/stylesheets/core/_variables.scss#L28).
* Typography sizing can be found in `core/variables` [file, line 13](https://github.com/uswds/uswds/blob/develop/src/stylesheets/core/_variables.scss#L13).
* Grid and breakpoint settings can be found in `core/variables` [file, line 87](https://github.com/uswds/uswds/blob/develop/src/stylesheets/core/_variables.scss#L87).


## Where things live

* **HTML** markup for the components is located in: `src/html` in the site root.
* **Sass** styles are located in: `src/stylesheets/ (/core, /elements, /components)`. **Compiled CSS** is located in the [downloadable zip file](https://github.com/uswds/uswds/releases/latest).
* **JS** is located in: `src/js/components (accordion.js, toggle-field-mark.js, toggle-form-input.js, validator.js)`.
* **Fonts** are located in: `src/fonts`.
* **Images** and icons are located in: `src/img`.


## Browser support

We’ve designed the Design System to support older and newer browsers through [progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement). The current major version of the Design System (1.0) is designed to support the newest versions of Chrome, Firefox, Safari, and Internet Explorer 9 and up. The next major release (2.0) will follow the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we will officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/). Currently, this means that the Design System version 2.0 will support the newest versions of Chrome, Firefox, Safari, and Internet Explorer 11 and up.


## Accessibility

The Design System also meets the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and conforms to the standards of [Section 508 of the Rehabilitation Act](http://www.section508.gov/). We’re happy to answer questions about accessibility — email us for more information.


## Fractal

We're using [Fractal](http://fractal.build) to generate an interactive component library for the Design System. You can run it locally after `npm install` with:

```sh
npm start
```

Then, visit [http://localhost:3000/](http://localhost:3000/) to see the Design System in action.

_**Optional**: To re-build when code changes are made, run the following command from the project directory in a separate terminal window:_
```sh
npm run watch
```

### Template compatibility

Many of our Fractal view templates are compatible with [Nunjucks](https://mozilla.github.io/nunjucks/) (for JavaScript/Node), [Jinja](http://jinja.pocoo.org/docs/2.9/) (Python), and [Twig](https://twig.sensiolabs.org/) (PHP) out of the box. Components that reference other components use a Fractal-specific `{% render %}` tag that will either need to be implemented in other environments or replaced with the appropriate `{% include %}` tags.


## Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/uswds/uswds/issues](https://github.com/uswds/uswds/issues).

You can also email us directly at uswds@gsa.gov.


## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the Design System style guide website for development.

If you would like to learn more about our workflow process, check out the [Workflow](https://github.com/uswds/uswds/wiki/Workflow) and [Issue label Glossary](https://github.com/uswds/uswds/wiki/Issue-label-glossary) pages on the wiki.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/uswds/uswds/issues) or [emailing our team](mailto:uswebdesignstandards@gsa.gov).


## Reuse of open-source style guides

Much of the guidance in the U.S. Web Design System leans on open source designs, code, and patterns from other civic and government organizations, including:

* Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
* U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
* Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
* UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
* Code for America’s Chime [Styleguide](https://github.com/chimecms/chime-starter)
* Pivotal Labs [Component Library](http://styleguide.cfapps.io/)


## Licenses and attribution

A few parts of this project are not in the public domain. Attribution and licensing information for those parts are described in detail in [LICENSE.md](LICENSE.md).

The rest of this project is in the worldwide public domain, released under the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).


## Contributing

All contributions to this project will be released under the CC0 dedication alongside the public domain portions of this project. For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).
