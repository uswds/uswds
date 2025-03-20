# United States Web Design System

[![CircleCI Build Status](https://img.shields.io/circleci/build/gh/uswds/uswds/develop?style=for-the-badge&logo=circleci)](https://circleci.com/gh/uswds/uswds/tree/develop) ![Snyk vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@uswds/uswds?style=for-the-badge) [![npm Version](https://img.shields.io/npm/v/@uswds/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![npm Downloads](https://img.shields.io/npm/dt/@uswds/uswds?style=for-the-badge)](https://www.npmjs.com/package/uswds) [![GitHub issues](https://img.shields.io/github/issues/uswds/uswds?style=for-the-badge&logo=github)](https://github.com/uswds/uswds/issues) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?style=for-the-badge)](https://github.com/prettier/prettier)

The [United States Web Design System](https://designsystem.digital.gov) includes a library of open source UI components and a visual style guide for U.S. federal government websites.

This repository is for the design system code itself. We maintain [another repository for the documentation and website](https://github.com/uswds/uswds-site). To see the design system and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

## Contents

- [Recent updates](#recent-updates)
- [Getting started](#getting-started)
- [What's included in USWDS](#whats-included-in-uswds)
  - [Directory structure](#directory-structure)
  - [Package contents](#package-contents)
- [Installing the design system](#installing-the-design-system)
- [Using USWDS CSS and JavaScript in your project](#using-uswds-css-and-javascript-in-your-project)
- [Compiling USWDS Sass into CSS](#compiling-uswds-sass-into-css)
  - [Sass compilation requirements](#sass-compilation-requirements)
  - [Sass and theme settings](#sass-and-theme-settings)
- [JS customization](#js-customization)
- [Style theming and tokens](#style-theming-and-tokens)
- [CSS architecture](#css-architecture)
- [Browser support](#browser-support)
- [Accessibility](#accessibility)
- [Long-term support of v1.x](#long-term-support-of-v1x)
- [Long-term support of v2.x](#long-term-support-of-v2x)
- [Need installation help?](#need-installation-help)
- [Contributing to the code base](#contributing-to-the-code-base)
- [Reuse of open-source style guides](#reuse-of-open-source-style-guides)
- [Licenses and attribution](#licenses-and-attribution)
- [Contributing](#contributing)

## Recent updates

Information about the most recent release of the design system can always be found in the [release history](https://github.com/uswds/uswds/releases). We include details about significant updates and any backward-incompatible changes along with a list of all changes.

**USWDS 3.0 is our most recent major release.**
- [Read about what's new in USWDS 3.0](https://designsystem.digital.gov/whats-new/updates/2022/04/28/introducing-uswds-3-0/)
- [Read our USWDS 3.0 Migration Guide](https://designsystem.digital.gov/documentation/migration)

## Getting started

We’re glad you’d like to use the design system — here’s how you can get started:

- **Designers:** Check out our [Getting started for designers information](https://designsystem.digital.gov/documentation/getting-started-for-designers/).
- **Developers:** Check out our [Getting started for developers information](https://designsystem.digital.gov/documentation/getting-started-for-developers/). If your project doesn't use npm for package management, follow the instructions in this README to [install the design system without npm.](#installing-the-design-system)
- **Anyone:** Take a look at our new [USWDS Tutorial](https://github.com/uswds/uswds-tutorial). Follow the instructions in this GitHub repo to clone a sample project, install USWDS, customize it, and add USWDS components. It should take about an hour, and is a good introduction to USWDS concepts.

## What's included in USWDS
The USWDS package includes compiled assets in a `dist` directory and component source files in a `packages` directory.

As of USWDS 3.0.0, our codebase is centered around functional packages, typically components. For more about how we organize packages, [see our Packages documentation](https://designsystem.digital.gov/components/packages). In each of the following examples, we use `[package]` to represent a specific package. For example, component Sass is located in `packages/[package]/src/styles` for an accordion, this would be `packages/usa-accordion/src/styles`.

- **Fonts** are located in both `dist/fonts` and `packages/uswds-core/src/assets/fonts`. The fonts in `dist` are simply a copy of the files in `uswds-core`.
- **Images** and icons are located in: `dist/img`. The source for component-specific images can be found in a package's `src/img` directory.
- **JavaScript** for components is located in `packages/[package]/src/index.js`. General JavaScript utilities are located in the `uswds-core` package: `packages/uswds-core/src/js`
- **Sass** component-specific stylesheets are located in: `packages/[package]/src/styles`. Many components also have a component entry point at `packages/[package]/_index.scss` that includes references to all a component's dependencies as well. **Compiled CSS** is located in `dist/css`.
- **Template** markup for the components is located in: `packages/[package]/src/[package.twig]` in the site root. These, however, are written in the templating language Twig. It's best to get HTML source markup directly from [designsystem.digital.gov/components](https://designsystem.digital.gov/components)

### Directory structure
Here's what you can expect to find inside the USWDS package:

```
[uswds package]
├── .storybook/
├── dist/
│   ├── css/
│   │   ├── uswds.css
│   │   ├── uswds.min.css
│   │   └── uswds.min.css.map
│   ├── fonts/
│   │   ├── merriweather/
│   │   ├── public-sans/
│   │   ├── roboto-mono/
│   │   └── source-sans-pro/
│   ├── img/
│   │   ├── usa-icons/
│   │   ├── material-icons/
│   │   ├── uswds-icons/
│   │   ├── usa-icons-bg/
│   │   ├── sprite.svg
│   │   ├── [individual images]
│   │   ...
│   ├── js/
│   │   ├── uswds-init.js
│   │   ├── uswds-init.min.js
│   │   ├── uswds-init.min.js.map
│   │   ├── uswds.js
│   │   ├── uswds.min.js
│   │   └── uswds.min.js.map
│   ├── scss/
│   │   └── stylesheets/
│   │       └── uswds.scss
│   └── theme/
│       ├── _uswds-theme.scss
│       ├── _uswds-theme-custom-styles.scss
│       └── styles.scss
├── packages/
│   ├── usa-component/
│   │   ├── src/
│   │   │   ├── content/
│   │   │   ├── styles/
│   │   │   │   ├── _index.scss
│   │   │   │   └── component.scss
│   │   │   ├── test/
│   │   │   │   ├── component.spec.js
│   │   │   │   └── template.html
│   │   │   ├── index.js
│   │   │   ├── usa-component.stories.js
│   │   │   └── usa-component.twig
│   │   └── _index.scss_/
│   ├── usa-component/
│   ├── usa-component/
│   ├── uswds-bundle/
│   ├── uswds-bundle/
│   ...
├── src/
│   ├── img/
│   ├── stylesheets/
│   └── test/
└── tasks/
```

### Package contents
Here's what you can expect to find in each of the directories and files in the USWDS package:

- `/.storybook`: Storybook configuration files (not used in USWDS projects)
- `/dist`: Compiled or collected files
- `/dist/css`: Precompiled CSS files with USWDS defaults
- `/dist/fonts`: Default fonts available to the design system
- `/dist/img`: All USWDS images collected into a single directory
- `/dist/img/usa-icons`: All icons collected into the USWDS icon sprite (`sprite.svg`)
- `/dist/img/material-icons`: All Material Icons
- `/dist/img/uswds-icons`: All icons created by USWDS
- `/dist/img/sprite.svg`: Precompiled icon sprite with default icon set
- `/dist/js`: Precompiled JavaScript files
- `/dist/scss/stylesheets/uswds.scss`: Backwards compatible USWDS Sass entry point
- `/dist/scss/theme`: Example theme files
- `/dist/scss/theme/_uswds-theme.scss`: Example theme settings file
- `/dist/scss/theme/_uswds-theme-custom-styles.scss`: Example custom settings file
- `/dist/scss/theme/styles.scss`: Example project Sass entry point
- `/packages`: Source files for USWDS components and other functionality.
- `/packages/usa-[component]`: Each package has a name like `usa-[component]` that matches its class name in the design system, like `usa-accordion`.
- `/packages/usa-[component]/_index.scss`: Sass entry point for the package.
- `/packages/usa-[component]/src`: Package source files
- `/packages/usa-[component]/src/index.js`: Package javascript
- `/packages/usa-[component]/src/usa-component.stories.js`: Storybook setup
- `/packages/usa-[component]/src/usa-component.twig`: Component template
- `/packages/usa-[component]/src/index.js`: Package javascript
- `/packages/usa-[component]/src/content`: Package template content
- `/packages/usa-[component]/src/test`: Package unit tests
- `/packages/usa-[component]/src/styles`: Package source Sass

- `/packages/uswds`: The package most projects include by default. This bundle includes all USWDS components and functionality.
- `/packages/uswds-[bundle]`: Other non-component functionality is included in `uswds-`-prefixed packages. These bundles might collect common component packages (`uswds-form-controls`) or important internal functionality (`uswds-core`).
- `/src`: Placeholders included for backwards compatibility. Most projects should avoid using the contents of this directory.
- `/tasks`: Internal build process files (not used in USWDS projects)

## Installing the design system
There are two ways to install the design system on a project:
- Installing it as a project dependency using Node and npm
- Installing the package directly from GitHub

**We recommend using npm to make it as straightforward as possible to install the design system and update it as we release new versions.**

### Install using Node and npm
Use the npm package manager for Node-based projects. USWDS maintains the [`@uswds/uswds` package](https://www.npmjs.com/package/uswds) that includes both the pre-compiled and compiled files. We rely on npm packages to easily update and install the design system from the command line.

1. Install `Node/npm`. Below is a link to find the install method that coincides with your operating system:

   - Node (see [.nvmrc](https://github.com/uswds/uswds/blob/develop/.nvmrc) for version number), [Installation guides](https://nodejs.org/en/download)

   **Note for Windows users:** If you are using Windows and are unfamiliar with Node or npm, we recommend following [Team Treehouse's tutorial](http://blog.teamtreehouse.com/install-node-js-npm-windows) for more information.

2. Make sure you have installed it correctly:

   ```shell
   npm -v
   6.13.0 # This line may vary depending on what version of Node you've installed.
   ```

3. Create a `package.json` file. You can do this manually, but an easier method is to use the `npm init` command. This command will prompt you with a few questions to create your `package.json` file.

4. Add `@uswds/uswds` to your project’s `package.json`:

   ```shell
   npm install --save @uswds/uswds@latest
   ```

The `@uswds/uswds` module is now installed as a dependency. You can use the compiled files found in the `node_modules/@uswds/uswds/dist/` directory or the source files in the `node_modules/@uswds/uswds/packages/` directory.

**Note:** We do _not_ recommend directly editing the design system files in `node_modules`. One of the benefits of using a package manager is its ease of upgrade and installation. If you make customizations to the files in the package, any upgrade or re-installation will wipe them out.

### Install the package directly from GitHub
If you’re using a framework or package manager that doesn’t support npm, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the steps outlined in this section.

1. Download the [USWDS package](https://github.com/uswds/uswds/releases) directly from the latest USWDS release and uncompress that file.

2. Copy these files and folders into a relevant place in your project's code base. Here is an example structure for how this might look:

   ```
   example-project/
   ├── assets/
   │   ├── uswds/
   │   │   ├── dist/
   │   │   ├── packages/
   │   │   └── src/
   │   ├── stylesheets/
   │   ├── images/
   │   └── javascript/
   └── index.html
   ```

   You'll notice in our example above that we also outline a `stylesheets`, `images` and `javascript` folder in your `assets` folder. These folders are to help organize any assets that are unique to your project and separate from the design system assets.

    <!--
      This note also exists on the USWDS Site download page, which is maintained in the USWDS-Site repo.
      If any changes are made, make sure to update there as well.
    -->
    **Note:** Files in the downloadable USWDS package will show a "last modified" date of October 26, 1985. This is [intentional](https://github.com/npm/npm/issues/20439#issuecomment-385121133). This default date is set by npm on all its packages to ensure builds will be identical.

## Using USWDS CSS and JavaScript in your project

The three files critical to any USWDS project are the **stylesheet**, the **JavaScript**, and the **initializer**. Most projects require all of these to function properly.

- **Stylesheet:** This is the compiled CSS stylesheet that describes how design system components look. To start, reference either `uswds.css` or `uswds.min.css` in the `<head>` of your document. Find this file in `/dist/css`. Most projects will want to compile their own CSS from USWDS source Sass instead of using the precompiled version. For more about this, see [Compiling USWDS Sass into CSS](#compiling-uswds-sass-into-css), below.
- **Library:** This is the compiled JavaScript that controls component interactivity. Reference either `uswds.js` or `uswds.min.js` at the end of the `<body>` of your document. Find this file in `/dist/js`.
- **Initializer:** This small JavaScript file (less than 1 KB minified) helps the browser know if the USWDS JavaScript library is loading properly. This prevents component content from "flashing" or "shifting" while the page loads. Reference `uswds-init.min.js` in the `<head>` of your page, or inline its contents directly into the `<script>` tag. Find this file in `/dist/js`.

Reference the stylesheet, library, and initializer in each HTML page or dynamic template in your project.

Here is an example of how to reference these assets in your `index.html` file:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Example Project</title>
    <script src="assets/uswds/dist/js/uswds-init.min.js"></script>
    <link rel="stylesheet" href="assets/uswds/dist/css/uswds.min.css" />
  </head>
  <body>
    <script src="assets/uswds/dist/js/uswds.min.js"></script>
  </body>
</html>
```

And that’s it — you should now be able to copy our code samples into your `index.html` and start using the design system.

## Compiling USWDS Sass into CSS

If you want to take full advantage of USWDS custom settings and add build new styles and components with the USWDS toolset, you'll need a way to access the assets in the USWDS package and compile custom CSS from the USWDS source files.

USWDS uses the task manager [Gulp](http://gulpjs.com/) as a way to add USWDS assets to a project and compile our CSS from the package source. Gulp is a useful and powerful tool, but it can be difficult to set up if you are new to it.

The [USWDS Compile package](https://github.com/uswds/uswds-compile) is made for developers new to Gulp or those who just want a simple setup to compile USWDS Sass. The repo contains files and instructions for setting up the compiler, initializing USWDS, and compiling CSS from the source files.

### Sass compilation requirements

USWDS Sass needs three things to compile properly:
- **Sass Module syntax:** USWDS requires a modern Sass compiler that can parse Sass Module syntax.
- **Autoprefixing:** USWDS requires Autoprefixing your CSS with a specific `.browserslistrc`.
- **Sass Load Paths:** USWDS requires Sass compilers use Load Paths that reference the `/packages` directory in the USWDS package

**Note: Using a compiler package like [USWDS Compile](https://github.com/uswds/uswds-compile) is a good way to fulfill these requirements automatically.**

#### Autoprefixing

The design system requires autoprefixing to work properly. Don't add vendor prefixes to your custom styles manually — it is more reliable to use autoprefixing. Autoprefixing services like [gulp-autoprefixer](https://github.com/sindresorhus/gulp-autoprefixer) automatically add vendor prefixes to CSS rules. We use the following autoprefixer settings via `.browserslistrc` config:

```
> 2%
last 2 versions
not dead
```

#### Sass Load Paths

USWDS 3.0 and newer require the use of [Sass Load Paths](https://sass-lang.com/documentation/at-rules/use#load-paths) to compile properly.

USWDS 3.0 load paths must include a path to the `/packages` directory in the USWDS package, typically by updating an `IncludePaths` setting to include `node_modules/@uswds/uswds/packages`.

Here's how this might look in Gulp and in Webpack:

##### Gulp

```js
.pipe(
  sass({
    includePaths: [
      "./node_modules/@uswds/uswds/packages",
    ],
  })
```

##### Webpack

```js
loader: "sass-loader",
options: {
  sassOptions: {
    includePaths: [
      "./node_modules/@uswds/uswds/packages"
    ],
  },
},
```


#### Other useful compiler postprocessing

- **Minification:** We recommend using a **minifier** like [csso](https://github.com/css/csso) to compress your final compiled CSS.
- **Sourcemaps:** We recommend using a **sourcemap** tool like [`gulp-sourcemaps`](https://www.npmjs.com/package/gulp-sourcemaps) to assist debugging by keeping  track of source Sass locations.

### Sass and theme settings

The design system is customizable using the power of [Sass (Syntactically Awesome Style Sheets)](http://sass-lang.com/). The critical files you'll need in your project are those in `dist/scss/theme`:

- `_uswds-theme.scss`: custom theme settings
- `_uswds-theme-custom-styles.scss`: additional project CSS for customizing or adding to what USWDS provides
- `styles.scss`: The Sass entry point. This is the primary Sass file that you'll compile. It collects theme settings, USWDS source files, and custom CSS

`styles.scss` looks something like the following code. It adds all the project theme settings, then adds USWDS source, and finally adds your project's custom styles:

```scss
@forward "uswds-theme";
@forward "uswds";
@forward "uswds-theme-custom-styles";
```

**Technical note:** The `@forward 'uswds'` statement above references the `uswds` package in `node_modules/@uswds/uswds/packages`. The compile functions included in [`uswds-compile`](https://github.com/uswds/uswds-compile) automatically look for USWDS packages in the proper directory using `includePaths`.

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
import accordion from "@uswds/uswds/js/usa-accordion";
import characterCount from "@uswds/uswds/js/usa-character-count";
```

⚠️Requires webpack 5+

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

    // remove event listeners when the component un-mounts.
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

  // remove event listeners when the component un-mounts.
  ngOnDestroy() {
    characterCount.off();
    accordion.off();
  }
}
```

## Style theming and tokens

USWDS 3.0 provides extensive support for theming via its theme settings files introduced in [Sass and theme settings](#sass-and-theme-settings), above.

Set theme settings with USWDS design tokens, not with values directly. They tend to be quoted strings like `'desktop'` or `'md'` or unitless numbers like `2` or `-1.5`. Tokens are the values _passed into_ the USWDS functions and mixins that parse them. They are the _keys_ that, through the mechanism of a function or mixin, unlock a _value_ — they are not the values themselves.

Visit the [Design tokens section](https://designsystem.digital.gov/design-tokens/) of USWDS 3.0 documentation for more on the available tokens for [color](https://designsystem.digital.gov/design-tokens/color), [spacing units](https://designsystem.digital.gov/design-tokens/spacing-units), [font size](https://designsystem.digital.gov/design-tokens/typesetting/font-size/), and more.

### Using tokens in theme settings

The following is an example of theme settings from `_uswds-theme.scss`:

```scss
@use "uswds-core" with (
  $theme-grid-container-max-width: "desktop",
  $theme-site-margins-breakpoint: "desktop",
  $theme-site-margins-width: 4,
  $theme-site-margins-mobile-width: 2,
)
```

The USWDS uses those tokens to build component styles:

```scss
.usa-example {
  @include u-padding-x($theme-site-margins-mobile-width);
  max-width: units($theme-grid-container-max-width);

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

```scss
@use "uswds-core" with (
  $theme-font-path: "../fonts",
  $theme-image-path: "../img",
);
```

## CSS architecture

- The CSS foundation of this site is built with the **[Sass](https://sass-lang.com)** preprocessor language.
- The CSS organization and naming conventions follow **[18F’s Engineering Guide](https://guides.18f.gov/engineering/languages-runtimes/css/#naming)**.
- We format our code with [Prettier](https://prettier.io/), per the formatting section of the **[18F Engineering Guide](https://guides.18f.gov/engineering/languages-runtimes/css/#formatting)**.
- CSS selectors are **prefixed** with `usa` (For example: `.usa-button`). This identifier helps the design system avoid conflicts with other styles on a site which are not part of USWDS.
- Uses a **[BEM](http://getbem.com/)** approach for naming CSS selectors. Blocks are separated from elements with two underscores (`__`). Multi-word blocks use single hyphens instead of spaces. Modifier classes are additive — proper markup requires the base class _and_ the modifier class or classes. Modifier classes consist of the base class plus a modifier suffix, separated by two hyphens (`--`) as in `.usa-button.usa-button--secondary` or `usa-accordion.usa-accordion--bordered`.
- Uses **modular CSS** for scalable, modular, and flexible code.
- Uses **nesting** when appropriate. Nest minimally with up to two levels of nesting.
- Hard-coded magic numbers are avoided.
- Media queries are built **mobile first**.
- **Spacing units** are set with the `units()` function as described in [the USWDS 3.0 documentation](https://designsystem.digital.gov/design-tokens/spacing-units/). In general, we use spacing in multiples of `8px` — expressed as a multiple in `units([multiple])`. For instance `units(2)` is the equivalent of `2 * 8px` or `16px`. In the final, compiled CSS, this value will be expressed in rem, as a multiple of the base font size set with `$theme-base-font-size`.

**For more information, visit:**
[18F’s CSS Guide](https://guides.18f.gov/engineering/languages-runtimes/css/)

## Browser support

We’ve designed the design system to support older and newer browsers through [progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement). The current major version of the design system (3.0.0) follows the [2% rule](https://gds.blog.gov.uk/2012/01/25/support-for-browsers/): we officially support any browser above 2% usage as observed by [analytics.usa.gov](https://analytics.usa.gov/). Currently, this means that the design system version 3.0.0 supports the newest versions of Chrome, Firefox, and Safari.

As of USWDS 3.0.0, we no longer officially support Internet Explorer 11 (IE11). We continued to include IE11 polyfills and prefixing for the first few releases in USWDS 3.x. We started to remove IE11-related polyfills in [USWDS 3.8.2](https://github.com/uswds/uswds/releases/tag/v3.8.2), and removed the remaining polyfills in [USWDS 3.10.0](https://github.com/uswds/uswds/releases/tag/v3.10.0).

## Accessibility

The design system also meets the [WCAG 2.0 AA accessibility guidelines](https://www.w3.org/TR/WCAG20/) and conforms to the standards of [Section 508 of the Rehabilitation Act](http://www.section508.gov/). Additionally, we try to meet the requirements of [WCAG 2.1](https://www.w3.org/TR/WCAG21/).

We use the following tools to ensure USWDS is accessible:
- [ANDI](https://www.ssa.gov/accessibility/andi/help/install.html).
- [Axe core](https://www.deque.com/axe/).
- [Axe dev tools](https://chrome.google.com/webstore/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?hl=en-US).

If you find any issues with our accessibility conformance, please create an issue in our GitHub repo or send us an email at [uswds@gsa.gov](mailto:uswds@gsa.gov). We prioritize accessibility issues. See [the Accessibility page of our website](https://designsystem.digital.gov/documentation/accessibility/) for more information.

## Long-term support of v1.x

[Version 1.x](https://v1.designsystem.digital.gov) is no longer maintained.

## Long-term support of v2.x

Version 2.x is in maintenance mode and will continue to get important bugfixes and security patches until May 2023.

## Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/uswds/uswds/issues](https://github.com/uswds/uswds/issues).

You can also email us directly at [uswds@gsa.gov](mailto:uswds@gsa.gov).

## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the design system style guide website for development.

If you would like to learn more about our workflow process, check out the [Workflow](https://github.com/uswds/uswds/wiki/Workflow) and [Issue label Glossary](https://github.com/uswds/uswds/wiki/Issue-label-glossary) pages on the wiki.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/uswds/uswds/issues) or [emailing our team](mailto:uswds@gsa.gov).

## Reuse of open-source style guides

Much of the guidance in USWDS leans on open source designs, code, and patterns from other civic and government organizations, including:

- Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
- U.S. Patent and Trademark Office’s [Design System](https://uspto.github.io/USPTO-Design-System/)
- Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
- UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
- Code for America’s Chime [Styleguide](https://github.com/chimecms/chime-starter)
- Pivotal Labs [Component Library](https://pivotal-cf.github.io/pivotal-ui/)

## Licenses and attribution

A few parts of this project are not in the public domain. Attribution and licensing information for those parts are described in detail in [LICENSE.md](LICENSE.md).

The rest of this project is in the worldwide public domain, released under the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

## Contributing

All contributions to this project will be released under the CC0 dedication alongside the public domain portions of this project. For more information, see [CONTRIBUTING.md](CONTRIBUTING.md).
