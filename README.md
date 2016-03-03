# Draft U.S. Web Design Standards

[![Build Status](https://api.travis-ci.org/18F/web-design-standards.svg?branch=18f-pages-staging)](https://travis-ci.org/18F/web-design-standards)

The [Draft U.S. Web Design Standards](https://playbook.cio.gov/designstandards) include a library of open source UI components and a visual style guide for U.S. federal government websites.

These tools follow industry-standard web accessibility guidelines and use the best practices of existing style libraries and modern web design. Created and maintained by [U.S. Digital Service](https://www.whitehouse.gov/digital/united-states-digital-service) and [18F](https://18f.gsa.gov/) designers and developers, the Draft Web Design Standards are designed for use by government product teams who want to create beautiful, easy-to-use online experiences for the public. To learn more about the project, check out this [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/).

## Getting started

We’re glad you’d like to use the Standards — here’s how you can get started:

* Designers: Check out our Getting Started for Designers information [here](https://playbook.cio.gov/designstandards/getting-started/).
    * Design files of all the assets included on this site are available for download [here](https://playbook.cio.gov/designstandards/assets/releases/wds-design-assets.zip).
* Developers: Follow the instructions in this README to get started.
    * CSS, JavaScript, image, and font files of all the assets on this site are available for download [here](https://github.com/18F/web-design-standards/archive/v0.8.3.zip).


Here are a few different ways to use the Standards within your project.

## Download

To use the Draft Web Design Standards on your project, you’ll need to include the CSS and JavaScript files in each HTML page in your project.

First, download the Draft Web Design Standards assets:

[https://github.com/18F/web-design-standards/archive/v0.8.3.zip](https://github.com/18F/web-design-standards/archive/v0.8.3.zip).

Then, add the `dist` directory files into a relevant place in your code base — likely a directory where you keep third-party libraries:

```
- uswds
  - fonts/
  - img/
  - js/
  - css/
```

Refer to these files by adding a `<link>` and a `<script>` element into your HTML pages:

```
<link rel="stylesheet" href="/path/to/your/assets/css/main.css">
<script src="/path/to/your/assets/js/components.js"></script>
```

And that’s it — you should be set to use the Standards.

## Using npm

If you have `node` installed on your machine, you can use npm to install the Standards. Add `uswds` to your `package.json` as a dependency or a development dependency:

```shell
cd path/to/project-using-npm
npm install --save 'git+https://git@github.com/18F/web-design-standards.git#18f-pages-staging' --registry https://registry.npmjs.org/
```

> __Please note__ that installing the `uswds` package via Github will use the
development version of the Draft Web Design Standards and is not tied to a
stable release. Installation via Github will also be deprecated once this package
is published to `npm`. The library may also have a different structure so some
file paths may be different.

The package will be installed in `node_modules` under `uswds`, and the Sass stylesheets will be available for you to compile using your project’s asset pipeline. (You can also access a compiled version in the `dist/css/uswds.css`.)

Because both the source and compiled/bundled CSS are available to you, you may include the `uswds` package as either a `dependency` or a `devDependency`. For the JavaScript assets, we recommend using `browserify` to bundle your files as the assets are written using CommonJS.

## Using another framework or package manager

If you’re using another framework or package manager that doesn’t support npm, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the [download instructions][link-to-downloads#above-section]. Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/18F/web-design-standards/issues/877).

If you’re interested in maintaining a package that helps us distribute the Draft Web Design Standards, the project’s build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](link-to-contributing#gulp-section) to locally build distributions for your framework or package manager.

If you’d like to use the Standards on a Ruby project, please use the [Ruby gem](https://github.com/18F/us_web_design_standards_gem).

## Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

You can also email us directly at uswebdesignstandards@gsa.gov.

## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](https://github.com/18F/web-design-standards/blob/18f-pages-staging/CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the Standards style guide website for development.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/18F/web-design-standards/issues) or [emailing our team](mailto:uswebdesignstandards@gsa.gov).

## Reuse of open-source style guides

Much of the guidance in the Draft Web Design Standards leans on open source designs, code, and patterns from other civic and government organizations, including:

* Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
* U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
* Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
* UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
* Code for America’s Chime [Styleguide](https://github.com/chimecms/chime-starter)
* Pivotal Labs [Component Library](http://styleguide.cfapps.io/)

## Licenses and attribution

### A few parts of this project are not in the public domain

The Source Sans Pro font files in `src/fonts` are a customized subset of [Source Sans Pro](https://github.com/adobe-fonts/source-sans-pro), licensed under the [SIL Open Font License](http://scripts.sil.org/cms/scripts/page.php?item_id=OFL), and copyright [Adobe Systems Incorporated](http://www.adobe.com/), with Reserved Font Name 'Source'. All Rights Reserved. Source is a trademark of Adobe Systems Incorporated in the United States and/or other countries.

The Merriweather font files in `src/fonts` are from [Google Web Fonts](https://www.google.com/fonts#UsePlace:use/Collection:Merriweather:400,300,400italic,700,700italic), licensed under the [SIL Open Font License](http://scripts.sil.org/cms/scripts/page.php?item_id=OFL), and copyright [Sorkin Type Co](www.sorkintype.com) with Reserved Font Name 'Merriweather'.

The files in `src/img` are from [Font Awesome](http://fontawesome.io/) by Dave Gandy under the [SIL Open Font License 1.1](http://scripts.sil.org/OFL).

The files in `src/stylesheets/_scss/lib/bourbon` are from [Bourbon](http://bourbon.io/), copyright [thoughtbot](https://thoughtbot.com/), inc., under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The files in `src/stylesheets/_scss/lib/neat` are from [Neat](http://neat.bourbon.io/), copyright [thoughtbot](https://thoughtbot.com/), inc., also under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The file `src/stylesheets/css/normalize.min.css` is from [Normalize.css](https://github.com/necolas/normalize.css), copyright Nicolas Gallagher and Jonathan Neal, under the [MIT license](https://github.com/necolas/normalize.css/blob/master/LICENSE.md).

The file `src/js/component.js` includes `politespace.js` from [Politespace](https://github.com/filamentgroup/politespace), copyright Zach Leatherman, under the [MIT license](https://github.com/filamentgroup/politespace/blob/master/LICENSE).

The file `src/js/vendor/html5shiv.js` is from [HTML5 Shiv](https://github.com/afarkas/html5shiv), copyright Alexander Farkas (aFarkas), under the [MIT license](https://github.com/aFarkas/html5shiv/blob/master/MIT%20and%20GPL2%20licenses.md).

The file `src/js/vendor/jquery-1.11.3.min.js` is from [jQuery](https://jquery.com/), copyright The jQuery Foundation, under the [MIT license](https://jquery.org/license/).

The file `src/js/vendor/rem.min.js` is from [REM unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill), copyright Chuck Carpenter, under the [MIT license](https://github.com/chuckcarpenter/REM-unit-polyfill/blob/master/LICENSE.md).

The file `src/js/vendor/respond.js` is from [Respond.js](https://github.com/scottjehl/Respond), copyright Scott Jehl, under the [MIT license](https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT).

The file `src/js/vendor/selectivizr-min.js` is from [Selectivizr](http://selectivizr.com/), copyright Keith Clark, under the [MIT license](http://opensource.org/licenses/mit-license.php).

The files `docs/assets/js/vendor/prism.js` and `assets-styleguide/css/prism.css` are from [Prism](http://prismjs.com/), copyright Lea Verou, under the [MIT license](https://github.com/PrismJS/prism/blob/gh-pages/LICENSE).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
