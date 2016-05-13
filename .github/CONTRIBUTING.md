# Welcome!

We're so glad you're thinking about contributing to an 18F open source project! If you're unsure about anything, just ask — or submit your issue or pull request anyway. The worst that can happen is we'll politely ask you to change something. We appreciate all friendly contributions.

One of our goals is to ensure a welcoming environment for all contibutors to our projects. Our staff follows the [18F Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md), and all contributors should do the same.

We encourage you to read this project's CONTRIBUTING policy (you are here), its [LICENSE](../LICENSE.md), [README](../README.md) and its [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) process.

If you have any questions or want to read more, check out the [18F Open Source Policy GitHub repository]( https://github.com/18f/open-source-policy), or just [shoot us an email](mailto:18f@gsa.gov).

## Guidelines

### Submitting an issue

To help us get a better understanding of the issue you're submitting, follow our ISSUE TEMPLATE and the guidelines it describes.

### Submitting a pull request

Here are a few guidelines to follow when submitting a pull request:

1. Create a GitHub account or sign in to your existing account.
1. Fork this repo into your GitHub account (or just clone it if you're an 18F team member). Read more about forking a repo here on GitHub:
[https://help.github.com/articles/fork-a-repo/](https://help.github.com/articles/fork-a-repo/)
1. Create a branch that lightly defines what you're working on (for example, add-styles).
1. Ensure that your contribution works via `npm`, if applicable. See below under
   _Install the package locally via `npm-link`_.
1. Once you're ready to submit a pull request, fill out the PULL REQUEST template provided.
1. Submit your pull request against the `18f-pages-staging` branch.

Have questions or need help with setup? Open an issue here [https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

### Building the project locally with gulp

The Draft U.S. Web Design Standards `uswds` package (the ZIP download and the
files needed to use the Standards on your project) and Standards website (our
public site that displays examples of each component and the HTML code) are
built using gulp automation. To use gulp, first make sure you've installed it on
your machine globally.

```sh
npm install --global gulp-cli
```

Then, to start, run the following command to install any new dependencies:

```sh
npm install
```

The following examples detail a few tasks you'll encounter as you use gulp:

```sh
gulp build
```

The task above is an alias for running `gulp sass javascript images fonts` and
is the task to build all assets. Building the package will generate a `/dist`
directory with the contents of the ZIP archive made available to download.
Building just the package is useful if you'd like to create your own
distribution bundle for frameworks that aren't supported via npm. This files in
`/dist` contain no documentation and are compiled and bundled CSS, JavaScript,
fonts, and images files. The command is aliased by `npm run prepublish`.

```sh
gulp website:build
```

The task above builds the entire Draft U.S. Web Design Standards website locally.
It can be useful when debugging for build errors or generating a deployable
version of the Standards website. This creates a `/_site` directory that
contains the Jekyll-built site. This is the same build step that we use to
deploy the website. The command is aliased by `npm run deploy`.

```sh
gulp website:serve
```

The task above is similar to the previous `./go` serve command from earlier
versions of the Standards. After running this command, you’ll be able to view
the Draft U.S. Web Design Standards website locally (http://127.0.0.1:4000).
This also sets up gulp and Jekyll to watch for file changes to the `/docs`
and `/src` directories and rebuilds the website accordingly. The command is
aliased by `npm start`

### Committing files when updating the `/src` directory

When you run `npm start` to preview the website locally, you generate many files
that are tracked by Git. This leaves your working directory in a dirty state,
and it can make knowing which files to include in your commit seem like a
daunting task. The following steps will make it easier for you to commit changes
while the team looks into different approaches for handling changes to the
Standards website and the `uswds` package.

If you made any changes to the `/src` directory, you have also made changes in
the following directories:

```
docs/_scss/
docs/assets/img/
docs/assets/fonts/
docs/assets/js/vendor/
```

This is due to how the Standards website consumes the `uswds` package.

Changes may also appear in these directories and files, if you've made any
changes to `/src`.

```
dist/css/
dist/js/
dist/fonts/
dist/img/
```

These changes must be committed in order for our distribution directories and
Standards website to remain in sync with the `uswds` package. Please keep
changes in a directory within its own series of commits. The commit messages
below offer a few examples.

```sh
git add src/ && \
git commit -m "Update the src files"

git add docs/ && \
git commit -m "Update the Standards website"

git add dist && \
git commit -m "Update the dist directory"
```

Because this will produce three commits, the only commits that may be reviewed
are the commits to the `/src` directory. This only applies to contributions that
are made strictly to the `/src` directory. If any contributions are added to the
Standards website, the `/docs` directory will also be reviewed. The contents of
the `/dist` directory are generated automatically, so commits may not need a
review.

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

The file `assets/js/vendor/selectivizr-min.js` is from [Selectivizr](http://selectivizr.com/), copyright Keith Clark, under the [MIT license](http://opensource.org/licenses/mit-license.php).

The files `assets-styleguide/js/vendor/prism.js` and `assets-styleguide/css/prism.css` are from [Prism](http://prismjs.com/), copyright Lea Verou, under the [MIT license](https://github.com/PrismJS/prism/blob/gh-pages/LICENSE).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](LICENSE.md).

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
