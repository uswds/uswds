# Draft U.S. Web Design Standards

[![CircleCI Build Status](https://circleci.com/gh/18F/web-design-standards/tree/staging.svg?style=shield)](https://circleci.com/gh/18F/web-design-standards/tree/staging)

The [Draft U.S. Web Design Standards](https://standards.usa.gov) include a library of open source UI components and a visual style guide for U.S. federal government websites.

Previously, the website and documentation for the Draft U.S. Web Design Standards were also part of this repository. To provide more clarity to both people who want to work with the Standards and people who work with the documentation locally, we have separated these into two repositories. This repository is for the Standards themselves.

18F maintains [another repository for the documentation and website](https://github.com/18F/web-design-standards-docs). To see the Standards and documentation on the web, visit [https://standards.usa.gov](https://standards.usa.gov).

## Contents

* [Background](#background)
* [Recent updates](#recent-updates)
* [Getting started](#getting-started)
* [Use the Standards](#using-the-standards)
  * [Download](#download)
  * [Install using npm](#install-using-npm)
  * [Use another framework or package manager](#use-another-framework-or-package-manager)
* [Our use of branches](#our-use-of-branches)
* [Need installation help?](#need-installation-help)
* [Contributing to the code base](#contributing-to-the-codebase)
* [Reuse of open-source style guides](#reuse-of-open-source-style-guides)
* [Licenses and attribution](#licenses-and-attribution)

## Background

The components and style guide of the Draft U.S. Web Design Standards follow industry-standard web accessibility guidelines and use the best practices of existing style libraries and modern web design. The [U.S. Digital Service](https://www.whitehouse.gov/digital/united-states-digital-service) and [18F](https://18f.gsa.gov/) created and maintain the Draft U.S. Web Design Standards for designers and developers. They are designed for use by government product teams who want to create beautiful, easy-to-use online experiences for the public. To learn more about the project, check out this [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/).

## Recent updates

Information about the most recent release of the Standards can always be found in the [release history](https://github.com/18F/web-design-standards/releases). We include details about significant updates and any backwards incompatible changes along with a list of all changes.

## Getting started

We’re glad you’d like to use the Standards — here’s how you can get started:

* Designers: [Check out our Getting Started for Designers information](https://standards.usa.gov/getting-started/designers/).
    * [Design files of all the assets included in the Standards are available for download](https://github.com/18F/web-design-standards-assets/archive/master.zip).
* Developers: Follow the instructions in this README to get started.
    * [CSS, JavaScript, image, and font files of all the assets on this site are available for download](https://github.com/18F/web-design-standards/releases/download/v0.13.1/uswds-0.13.1.zip).

## Using the Standards

There are a few different ways to use the Standards within your project. Which one you choose depends on the needs of your project and how you are most comfortable working.

### Download

To use the Draft Web Design Standards on your project, you’ll need to include the CSS and JavaScript files in each HTML page in your project.

First, download the Draft Web Design Standards assets:

[https://github.com/18F/web-design-standards/releases/download/v0.13.1/uswds-0.13.1.zip](https://github.com/18F/web-design-standards/releases/download/v0.13.1/uswds-0.13.1.zip)

Then, add the following folders into a relevant place in your code base — likely a directory where you keep third-party libraries:

```

uswds-0.13.1/
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
into each of your HTML pages:

Add this to your `<head>` element:

```html
<link rel="stylesheet" href="/path/to/your/assets/css/lib/uswds.min.css">
```

Add this before the closing `</body>` tag:

```html
<script src="/path/to/your/assets/js/lib/uswds.min.js"></script>
```

We offer both files, the CSS and the JavaScript, in two versions — a minified
version, and an un-minified one. (In the examples above, we are using the minified
files.) Use the minified files in a production environment or to reduce the
file size of your downloaded assets. And the un-minified files are better if you
are in a development environment or would like to debug the CSS or JavaScript
assets in the browser.

This version of the Standards includes jQuery version `2.2.0` bundled within the
JavaScript file. Please make sure that you’re not including any other version
of jQuery on your page.

And that’s it — you should be set to use the Standards.

### Install using npm

If you have `node` installed on your machine, you can use npm to install the Standards. Add `uswds`
to your project’s `package.json` as a dependency:

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

`require('uswds')` will load all of the Draft U.S. Web Design Standards’ JavaScript onto the page. The `uswds` module itself does not export anything.

The main Sass (SCSS) source file is here:

```
node_modules/uswds/src/stylesheets/all.scss
```

The non-minified CSS that’s been precompiled is here:

```
node_modules/uswds/dist/css/uswds.css
```

### Use another framework or package manager

If you’re using another framework or package manager that doesn’t support npm, you can find the source files in this repository and use them in your project. Otherwise, we recommend that you follow the [download instructions](#download). Please note that the core team [isn’t responsible for all frameworks’ implementations](https://github.com/18F/web-design-standards/issues/877).

If you’re interested in maintaining a package that helps us distribute the Draft U.S. Web Design Standards, the project’s build system can help you create distribution bundles to use in your project. Please read our [contributing guidelines](CONTRIBUTING.md#building-the-project-locally-with--gulp-) to locally build distributions for your framework or package manager.

## Our use of branches

The `staging` branch is the bleeding edge of development. When cutting a new [release](https://github.com/18F/web-design-standards/releases), we update the versioning on our files by branching off of the `staging` branch and submitting a pull request into our `release` branch. This helps to make `staging` a place that can always receive contributions, no matter where we are in the release process. New commits to `staging` are automatically deployed to [our staging site](https://standards-staging.usa.gov/).

The `master` branch always holds the latest production-ready release. When cutting a [release](https://github.com/18F/web-design-standards/releases), we create a release branch from `staging` named for the new version: for example, `v0.9.x`. Once we’ve completed QA on that branch, we tag the release and merge it into the `master` branch.

The branches `18f-pages` and `18f-pages-staging` _used_ to be the primary release and development branches, back when the site was hosted on `pages.18f.gov`. Those branches still auto deploy to 18F Pages, but will now only contain minimal redirects to the new site.

## Need installation help?

Do you have questions or need help with setup? Did you run into any weird errors while following these instructions? Feel free to open an issue here:

[https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

You can also email us directly at uswebdesignstandards@gsa.gov.

## Contributing to the code base

For complete instructions on how to contribute code, please read [CONTRIBUTING.md](CONTRIBUTING.md). These instructions also include guidance on how to set up your own copy of the Standards style guide website for development.

If you would like to learn more about our workflow process, check out the [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) and [Label Glossary](https://github.com/18F/web-design-standards/wiki/Label-glossary) pages on the wiki.

If you have questions or concerns about our contributing workflow, please contact us by [filing a GitHub issue](https://github.com/18F/web-design-standards/issues) or [emailing our team](mailto:uswebdesignstandards@gsa.gov).

## Reuse of open-source style guides

Much of the guidance in the Draft U.S. Web Design Standards leans on open source designs, code, and patterns from other civic and government organizations, including:

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
