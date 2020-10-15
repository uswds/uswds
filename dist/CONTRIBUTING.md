## Welcome!

We’re so glad you’re thinking about contributing to a Technology Transformation Services (TTS) open source project! If you’re unsure about anything, just ask — or submit your issue or pull request anyway. The worst that can happen is we’ll politely ask you to change something. We appreciate all friendly contributions.

TTS is committed to building a safe, welcoming, harassment-free culture for everyone. We expect everyone on the TTS team and everyone within TTS spaces, including contributors to our projects, to follow the [TTS Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md).

We encourage you to read this project’s CONTRIBUTING policy (you are here), its [LICENSE](LICENSE.md), [README](README.md) and its [Workflow](https://github.com/uswds/uswds/wiki/Workflow) process.

If you have any questions or want to read more, check out the [18F Open Source Policy GitHub repository]( https://github.com/18f/open-source-policy), or [send us an email](mailto:18f@gsa.gov).

## Guidelines

### Contributor Guidelines for Design

We have provided some guidelines for folks that would like to submit new components to the U.S. Web Design System and the lifecycle those new components will go through. For more detail, please visit the [guidelines on our wiki](https://github.com/uswds/uswds/wiki/Contribution-Guidelines:-Design).

### Submitting an issue

To help us get a better understanding of the issue you’re submitting, follow our ISSUE TEMPLATE and the guidelines it describes.

### Submitting a pull request

Here are a few guidelines to follow when submitting a pull request:

1. Create a GitHub account or sign in to your existing account.
1. Fork this repo into your GitHub account (or just clone it if you’re an 18F team member). Read more about forking a repo here on GitHub:
[https://help.github.com/articles/fork-a-repo/](https://help.github.com/articles/fork-a-repo/)
1. Create a branch from `develop` that lightly defines what you’re working on (for example, add-styles).
1. Ensure that your contribution works via `npm`, if applicable.
1. Once you’re ready to submit a pull request, fill out the PULL REQUEST template provided.
1. Submit your pull request against the `develop` branch.

[Open an issue](https://github.com/uswds/uswds/issues/new) if you have questions or need help with setup.

### Running locally

The U.S. Web Design System `uswds` package (the zip download and the
files needed to use the Design System on your project) is built primarily with
two [Node.js] tools: [Fractal] and [Gulp]. Once you've cloned this
repository, you'll need to install its dependencies:

```sh
npm install
```

**ProTip**: You can also use [Yarn], which tends to install dependencies more quickly than npm.

To start the [Fractal] live reload server, run:

```sh
npm start
```

Then, visit [localhost:3000](http://localhost:3000) in a web browser to
peruse the component library. While the server is running, any changes that
you make to the component templates or configurations will reload the page
automatically.

If you're working on the JavaScript or CSS, you can run the "watch" task in
another shell to automatically rebuild the distribution files that Fractal
references with:

```sh
npm run watch
```

### Testing

To run the component unit tests, run:

```sh
npm test
```

This will also run [eslint] and [stylelint] to ensure that the JavaScript
and SCSS source files meet our coding standards along with [snyk test] to check for package dependency vulnerabilities. To lint without the unit
tests, you'll need [Gulp][]. Install it globally (`npm install -g
gulp-cli`), then run:

```sh
gulp eslint
gulp stylelint
```

(Or, if you don't want to install Gulp globally, you can run `$(npm
bin)/gulp` instead of `gulp`.)

Note that running the tests also requires an installation of
Chrome v59 or higher (v60 if you're on Windows).

If you want to run a single test file, run `npm run mocha ${path/to/spec-file}`,
substituting the actual path to the spec. Only javascript files can be executed by the `mocha` runner,
and only those js files in the `spec` directory ending with a `.spec.js`.

Alternatively, you can add an `.only` to a `describe` or `it` block (i.e. `describe.only('my spec')`)
and run the `npm run test` command. Keep in mind that this will also run linters and aXe accessibility tests.

To run all of the unit tests, run `npm run test:unit`.

**For non-OSX users**:
Before running the tests, if you are developing on a machine running an operating system other than OSX,
you'll need to export a `CHROME_PATH` environment variable that points to Chrome's binary location. This ensures `chrome-launcher`
can find a version of Chrome for our aXe visual acceptence tests. A table of the locations of the binary
for each OS can [be found here](https://github.com/SeleniumHQ/selenium/wiki/ChromeDriver#requirements).

#### Visual regression testing

The Design System comes with optional tooling for detecting visual regressions,
which can be especially useful if you're refactoring CSS.

These tests work by comparing current screenshots of the Design System's Fractal
components to "golden" screenshots that represent what the components are
supposed to look like.

Golden screenshots are stored on your local development system *only*;
they're not version controlled. This means that after making changes to a branch,
you can switch to the branch you'd like to compare it to (e.g. the `develop`
branch) to generate your golden screenshots.

To generate the golden screenshots, run:

```
npm run test:visual:update
```

Then, make any CSS refactorings (or switch to a branch that has them).

To compare the current state of your CSS to the golden screenshots, run:

```
npm run test:visual
```

If the current screenshots don't match their golden counterparts, you will
be directed to an HTML file that visually shows the differences between
any conflicting screenshots.

### Building

To build the `uswds` package in preparation for releases, run:

```sh
npm run release
```

## Coding guidelines

The purpose of our coding styleguides are to create consistent coding practices across 18F. The styleguide should be treated as a guide — rules can be modified according to project needs.

This project follows the 18F Front End Guide [CSS](https://pages.18f.gov/frontend/#css) and [JavaScript](https://pages.18f.gov/frontend/#javascript). Please use this guide for your reference.

### Code coverage

We use [code coverage](https://en.wikipedia.org/wiki/Code_coverage) tools to understand how much of our JavaScript is tested by our [unit test suite](spec/unit). Code coverage is one way (among many) of measuring code _quality_ more generally. Here's how it works for contributions:

1. Each pull request creates a new coverage report on [Code Climate](https://codeclimate.com/).
1. Code Climate then posts a status message back to GitHub that lists the coverage percentage on that branch, and the difference between that number and the one last reported on our default branch.

For JavaScript contributions, we will review the code coverage percentage and change to ensure that the quality of our code is not dramatically affected.

High code coverage numbers are generally good, and we would prefer that our coverage increases over time. We will not categorically reject contributions that reduce code coverage, but we may ask contributors to refactor their code, add new unit tests, or modify existing tests to avoid significant reductions in coverage.

## Browser support
See [browser support](https://designsystem.digital.gov/getting-started/developers/#browser-support) in the “Getting started: Developers” guidelines.

## Our use of branches

See the [release documentation](https://github.com/uswds/uswds/wiki/Release-process) for more information on our git/GitHub release workflow.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see the [LICENSE](LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](https://github.com/uswds/uswds/blob/develop/LICENSE.md).

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

### Contributions will be released into the public domain

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.

[Node.js]: https://nodejs.org
[Fractal]: http://fractal.build
[Gulp]: http://gulpjs.com/
[Yarn]: https://yarnpkg.com/
[eslint]: http://eslint.org/
[stylelint]: https://stylelint.io/
