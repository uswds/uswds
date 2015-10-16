# U.S. Web Design Standards

[![Build Status](https://api.travis-ci.org/18F/web-design-standards.svg?branch=18f-pages-staging)](https://travis-ci.org/18F/web-design-standards)

The [U.S. Web Design Standards](https://playbook.cio.gov/designstandards) is a library of open source UI components and a visual style guide for U.S. federal government websites.

These tools follow industry-standard web accessibility guidelines and reuse the best practices of existing style libraries and modern web design. Created and maintained by [U.S. Digital Service](https://www.whitehouse.gov/digital/united-states-digital-service) and [18F](https://18f.gsa.gov) designers and developers, the Web Design Standards are designed to support government product teams in creating beautiful and easy-to-use online experiences for the American people. Learn more about this project in our announcement [blog post](https://18f.gsa.gov/2015/09/28/web-design-standards/).

Design files of all the assets included on this site are available for download here: [https://github.com/18F/web-design-standards-assets](https://github.com/18F/web-design-standards-assets).

The structural setup of this repo is based off of [https://github.com/18F/pages](https://github.com/18F/pages).

### Reuse of open source style guides

Much of the guidance in Web Design Standards leans on open source designs, code, and patterns from other civic and government organizations, including:
- Consumer Financial Protection Bureau’s [Design Manual](https://cfpb.github.io/design-manual/)
- U.S. Patent and Trademark Office’s [Design Patterns](http://uspto.github.io/designpatterns/)
- Healthcare.gov [Style Guide](http://styleguide.healthcare.gov/)
- UK’s Government Digital Service’s [UI Elements](http://govuk-elements.herokuapp.com/)
- Code for America’s [Chime Styleguide](https://github.com/chimecms/chime-starter)
- Pivotal Labs [Component Library](http://styleguide.cfapps.io/)

## Getting started

To begin using the U.S. Web Design Standards, include the CSS and JavaScript files in each HTML page of your project. Copy the full `_site/assets/` directory to a relevant place in your code base `cp ./_site/assets/css/main.css /path/to/your/repo/static/dir`. Add the following `<link>` and `<script>` elements in your HTML:

- `<link rel="stylesheet" href="/path/to/your/assets/css/main.css">`
- `<link rel="stylesheet" href="/path/to/your/assets/css/google-fonts.css">`
- `<script src="/path/to/your/assets/js/components.js"></script>`

## Setup for your local environment

### Requirements

You will need [Ruby](https://www.ruby-lang.org) ( > version 2.2.3 ). You may
consider using a Ruby version manager such as
[rbenv](https://github.com/sstephenson/rbenv) or [rvm](https://rvm.io/) to
help ensure that Ruby version upgrades don't mean all your
[gems](https://rubygems.org/) will need to be rebuilt.

On OS X, you can also use [Homebrew](http://brew.sh/) to install Ruby in
`/usr/local/bin`, which may require you to update your `$PATH` environment
variable. Here are the commands to follow to install via homebrew:

```shell
$ brew update
$ brew install ruby
```

### Installation

Now that you have verified that you have Ruby installed, clone and run the
following [go script](https://github.com/18F/go_script) commands to initialize and serve the library locally.

```shell
$ git clone git@github.com:18F/web-design-standards.git
$ cd web-design-standards
$ ./go serve
```

You should now be able to visit `http://127.0.0.1:4000/`
and view the web design standards locally.

Questions or need help with setup? Feel free to open an issue here [https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

## Contributing to the code base

See [CONTRIBUTING](CONTRIBUTING.md).

## Got feedback?

Please create a [GitHub Issue](https://github.com/18F/web-design-standards/issues).

## Licenses and attribution

### A few parts of this project are not in the public domain

The font files in `assets/fonts` are from [Google Web Fonts](https://www.google.com/fonts#UsePlace:use/Collection:Source+Sans+Pro:400,300,400italic,700,700italic|Merriweather:400,300,400italic,700,700italic), licensed under the [SIL Open Font License](http://scripts.sil.org/cms/scripts/page.php?item_id=OFL).

* The Source Sans Pro fonts are copyright 2010, 2012 [Adobe Systems Incorporated](http://www.adobe.com/), with Reserved Font Name 'Source'. All Rights Reserved. Source is a trademark of Adobe Systems Incorporated in the United States and/or other countries.

* The Merriweather fonts are copyright © 2010-2013, [Sorkin Type Co](www.sorkintype.com) with Reserved Font Name 'Merriweather'.

The files in `assets/img` are from [Font Awesome](http://fontawesome.io/) by Dave Gandy under the [SIL Open Font License 1.1](http://scripts.sil.org/OFL).

The files in `assets/_scss/lib/bourbon` are from [Bourbon](http://bourbon.io/), copyright © 2011–2015 [thoughtbot](https://thoughtbot.com/), inc., under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The files in `assets/_scss/lib/neat` are from [Neat](http://neat.bourbon.io/), copyright © 2012–2015 [thoughtbot](https://thoughtbot.com/), inc., also under the [MIT license](https://github.com/thoughtbot/neat/blob/master/LICENSE.md).

The file `assets/css/normalize.min.css` is from [Normalize.css](https://github.com/necolas/normalize.css), copyright © Nicolas Gallagher and Jonathan Neal, under the [MIT license](https://github.com/necolas/normalize.css/blob/master/LICENSE.md).

The file `assets/js/component.js` includes `politespace.js` from [Politespace](https://github.com/filamentgroup/politespace), copyright © 2013 Zach Leatherman, under the [MIT license](https://github.com/filamentgroup/politespace/blob/master/LICENSE).

The file `assets/js/vendor/html5shiv.js` is from [HTML5 Shiv](https://github.com/afarkas/html5shiv), copyright © 2014 Alexander Farkas (aFarkas), under the [MIT license](https://github.com/aFarkas/html5shiv/blob/master/MIT%20and%20GPL2%20licenses.md).

The file `assets/js/vendor/jquery-1.11.3.min.js` is from [jQuery](https://jquery.com/), copyright © 2015 The jQuery Foundation, under the [MIT license](https://jquery.org/license/).

The file `assets/js/vendor/rem.min.js` is from [REM unit polyfill](https://github.com/chuckcarpenter/REM-unit-polyfill), copyright © 2015 Chuck Carpenter, under the [MIT license](https://github.com/chuckcarpenter/REM-unit-polyfill/blob/master/LICENSE.md).

The file `assets/js/vendor/respond.js` is from [Respond.js](https://github.com/scottjehl/Respond), copyright © 2012 Scott Jehl, under the [MIT license](https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT).

The file `assets/js/vendor/selectivisr-min.js` is from [Selectivizr](http://selectivizr.com/), copyright © Keith Clark, under the [MIT license](http://opensource.org/licenses/mit-license.php).

The files `assets-styleguide/js/vendor/prism.js` and `assets-styleguide/css/prism.css` are from [Prism](http://prismjs.com/), copyright © 2012-2013 Lea Verou, under the [MIT license](https://github.com/PrismJS/prism/blob/gh-pages/LICENSE).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
