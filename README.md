# Draft U.S. Web Design Standards

[![Build Status](https://api.travis-ci.org/18F/web-design-standards.svg?branch=18f-pages-staging)](https://travis-ci.org/18F/web-design-standards)

The [Draft U.S. Web Design Standards](https://playbook.cio.gov/designstandards) is a library of open source UI components and a visual style guide for U.S. federal government websites.

These tools follow industry-standard web accessibility guidelines and reuse the best practices of existing style libraries and modern web design. Created and maintained by [U.S. Digital Service](https://www.whitehouse.gov/digital/united-states-digital-service) and [18F](https://18f.gsa.gov) designers and developers, the Draft Web Design Standards are designed to support government product teams in creating beautiful and easy-to-use online experiences for the American people. Learn more about this project in our announcement [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/).

Design files of all the assets included on this site are available for download here: [https://github.com/18F/web-design-standards-assets](https://github.com/18F/web-design-standards-assets).

To begin using the Draft Web Design Standards (to help you contribute to it or reuse it for your own purposes), go to [Getting Started](https://github.com/18F/web-design-standards#getting-started). To run the [Draft Web Design Standards website](https://playbook.cio.gov/designstandards/) locally on your machine, go to [Setup for your local environment](https://github.com/18F/web-design-standards/#setup-for-your-local-environment).

### Reuse of open source style guides

Much of the guidance in Draft Web Design Standards leans on open source designs, code, and patterns from other civic and government organizations, including:
- Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
- U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
- Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
- UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
- Code for America’s [Chime Styleguide](https://github.com/chimecms/chime-starter)
- Pivotal Labs [Component Library](http://styleguide.cfapps.io/)

## Getting started

To begin using the Draft Web Design Standards on your project, include the CSS and JavaScript files in each HTML page in your project. Download the the Draft Web Design Standards assets: https://playbook.cio.gov/designstandards/assets/releases/wds-v0.8.3.zip. Add the assets directory to a relevant place in your code base.

Refer to these files by adding a `<link>` and a `<script>` element into your HTML pages:

```
<link rel="stylesheet" href="/path/to/your/assets/css/main.css">
<link rel="stylesheet" href="/path/to/your/assets/css/google-fonts.css">
<script src="/path/to/your/assets/js/components.js"></script>
```

### Install with NPM

If you have `node` installed on your machine, you can use `npm` to install the
Web Design Standards.

```shell
cd path/to/project-using-npm
npm install --save uswds
```

This will add the Web Design Standards as a dependency for your project and save
it to your `package.json` file. The package will be installed in `node_modules`
under `uswds`. The CSS file(s) are generated on the `npm-prepublish` hook and can
found in the following directory: `./node_modules/uswds/assets/css`.

An `npm` task called `build-sass` is supplied, though you are not required to
use it, that will compile the Sass to a CSS file named `uswds.css` (in
`node_modules/uswds/assets/css/uswds.css`).

Note: You might get an [`npm` warning related to `lodash`](https://github.com/18F/web-design-standards/pull/902#issuecomment-161076213), but you can generally ignore it.
This error is related to a dependency found in `node-sass`.

#### Install with `npm-link`

If you have a clone of this repository locally and would like to use it on
another project without using the published version, you can use `npm link`.

**Please note** that this use case is primarily useful if you're developing on the
Web Design Standards locally and would like to see those changes in another
project that is using them. Using `npm link` _should not be done_ if you are using
a release version of the Web Design Standards. Please follow the `npm install`
instructions above if you are using a release version.

The following commands will link your local `web-design-standards` project to
another project.

```
cd path/to/web-design-standards # note: your paths will differ
npm link
cd path/to/another/project-using-npm # note: this project name is reused below
npm link uswds
```

The `node_modules` directory in your project will contain a symbolic link of the
contents of the `web-design-standards` project under `node_modules/uswds` within
the `project-using-npm`. For more information on `npm-link`, you can read about
it in the [`npm-link` documentation](https://docs.npmjs.com/cli/link).

##### Using `uswds` with `npm`

With the `uswds` package installed in your `node_modules` directory, you can
access various included dependencies from the package itself.

Running `require( 'uswds' )` will include the contents of the `components.js`
file in your project. This file does not export currently export anything so it
doesn't need to be assigned to a variable. This library depends on `jQuery` and
`$` to be on the `window` object before it is required. So please be sure that
you include the jQuery dependency from the `uswds` package before `components.js`
is loaded via the `require()` statement.

```html
<script src="./node_modules/uswds/assets/js/vendor/jquery-1.11.3.min.js"></script>
<!-- Loading the components.js file directly from the package -->
<script src="./node_modules/uswds/assets/js/components.js"></script>
<!-- Or loading the components.js file via `require()` within your project's npm-asset-pipeline -->
<script src="path/to/project/all.js"></script>
```

## Setup for your local environment

### Requirements

These setup instructions are for running the [Draft Web Design Standards website](https://playbook.cio.gov/designstandards/) locally on your machine and not for using the assets (CSS, JavaScript, etc) on your own project. If you want to use the standards assets, go to [Getting Started](https://github.com/18F/web-design-standards#getting-started). For context, the styleguide website uses [Jekyll](http://jekyllrb.com/) (a static site generator), which is run via a [`./go` script](https://github.com/18F/go_script). At 18F, we then use [18F Pages](https://github.com/18F/pages) to publish and serve the site.

You will need [Ruby](https://www.ruby-lang.org) ( > version 2.2.3 ). You may consider using a Ruby version manager such as [rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) to help ensure that Ruby version upgrades don't mean all your [gems](https://rubygems.org/) will need to be rebuilt.

On OS X, you can also use [Homebrew](http://brew.sh/) to install Ruby in `/usr/local/bin`, which may require you to update your `$PATH` environment variable. Here are the commands to follow to install via homebrew:

```shell
$ brew update
$ brew install ruby
```

Note: The website is published with [18F Pages](https://github.com/18F/pages).

### Installation

Now that you have verified that you have Ruby installed, clone and run the following [go script](https://github.com/18F/go_script) commands to initialize and serve the library locally.

```shell
$ git clone git@github.com:18F/web-design-standards.git
$ cd web-design-standards
$ ./go serve
```

You should now be able to visit `http://127.0.0.1:4000/`
and view the draft web design standards locally.

Questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here: [https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

## Contributing to the code base

See [CONTRIBUTING](CONTRIBUTING.md).

### Deployment and workflow

* The staging branch `18f-pages-staging` is **automatically deployed** to our staging site: https://pages-staging.18f.gov/designstandards/.
* The production branch `18f-pages` is **automatically deployed** to our production site: https://playbook.cio.gov/designstandards/.

**All development and pull requests should be done against the `18f-pages-staging` branch.**

`18f-pages-staging` is already set to the default branch in this repository.

Deployments to production will be done by site admins, using pull requests from `18f-pages-staging` to `18f-pages`.

## Got feedback?

Please create a [GitHub Issue](https://github.com/18F/web-design-standards/issues).

If you'd rather email, you can reach us at uswebdesignstandards@gsa.gov.

## Licenses and attribution

### A few parts of this project are not in the public domain

The Source Sans Pro font files in `assets/fonts` are a customized subset of [Source Sans Pro](https://github.com/adobe-fonts/source-sans-pro), licensed under the [SIL Open Font License](http://scripts.sil.org/cms/scripts/page.php?item_id=OFL), and copyright [Adobe Systems Incorporated](http://www.adobe.com/), with Reserved Font Name 'Source'. All Rights Reserved. Source is a trademark of Adobe Systems Incorporated in the United States and/or other countries.

The Merriweather font files in `assets/fonts` are from [Google Web Fonts](https://www.google.com/fonts#UsePlace:use/Collection:Merriweather:400,300,400italic,700,700italic), licensed under the [SIL Open Font License](http://scripts.sil.org/cms/scripts/page.php?item_id=OFL), and copyright [Sorkin Type Co](www.sorkintype.com) with Reserved Font Name 'Merriweather'.

The files in `assets/img` are from [Font Awesome](http://fontawesome.io/) by Dave Gandy under the [SIL Open Font License 1.1](http://scripts.sil.org/OFL).

The files in `assets/_scss/lib/bourbon` are from [Bourbon](http://bourbon.io/), copyright [thoughtbot](https://thoughtbot.com/), inc., under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The files in `assets/_scss/lib/neat` are from [Neat](http://neat.bourbon.io/), copyright [thoughtbot](https://thoughtbot.com/), inc., also under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The file `assets/css/normalize.min.css` is from [Normalize.css](https://github.com/necolas/normalize.css), copyright Nicolas Gallagher and Jonathan Neal, under the [MIT license](https://github.com/necolas/normalize.css/blob/master/LICENSE.md).

The file `assets/js/component.js` includes `politespace.js` from [Politespace](https://github.com/filamentgroup/politespace), copyright Zach Leatherman, under the [MIT license](https://github.com/filamentgroup/politespace/blob/master/LICENSE).

The file `assets/js/vendor/html5shiv.js` is from [HTML5 Shiv](https://github.com/afarkas/html5shiv), copyright Alexander Farkas (aFarkas), under the [MIT license](https://github.com/aFarkas/html5shiv/blob/master/MIT%20and%20GPL2%20licenses.md).

The file `assets/js/vendor/jquery-1.11.3.min.js` is from [jQuery](https://jquery.com/), copyright The jQuery Foundation, under the [MIT license](https://jquery.org/license/).

The file `assets/js/vendor/rem.min.js` is from [REM unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill), copyright Chuck Carpenter, under the [MIT license](https://github.com/chuckcarpenter/REM-unit-polyfill/blob/master/LICENSE.md).

The file `assets/js/vendor/respond.js` is from [Respond.js](https://github.com/scottjehl/Respond), copyright Scott Jehl, under the [MIT license](https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT).

The file `assets/js/vendor/selectivisr-min.js` is from [Selectivizr](http://selectivizr.com/), copyright Keith Clark, under the [MIT license](http://opensource.org/licenses/mit-license.php).

The files `assets-styleguide/js/vendor/prism.js` and `assets-styleguide/css/prism.css` are from [Prism](http://prismjs.com/), copyright Lea Verou, under the [MIT license](https://github.com/PrismJS/prism/blob/gh-pages/LICENSE).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
