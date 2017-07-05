## Welcome!

We’re so glad you’re thinking about contributing to an 18F open source project! If you’re unsure about anything, just ask — or submit your issue or pull request anyway. The worst that can happen is we’ll politely ask you to change something. We appreciate all friendly contributions.

One of our goals is to ensure a welcoming environment for all contributors to our projects. Our staff follows the [18F Code of Conduct](https://18f.gsa.gov/code-of-conduct/), and all contributors should do the same.

We encourage you to read this project’s CONTRIBUTING policy (you are here), its [LICENSE](https://github.com/18F/web-design-standards/blob/develop/LICENSE.md), [README](https://github.com/18F/web-design-standards/blob/develop/README.md) and its [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) process.

If you have any questions or want to read more, check out the [18F Open Source Policy GitHub repository]( https://github.com/18f/open-source-policy), or just [shoot us an email](mailto:18f@gsa.gov).

## Guidelines

### Contributor Guidelines for Design

We have provided some guidelines for folks that would like to submit new components to the U.S. Web Design Standards and the lifecycle those new components will go through. For more detail, please visit the [guidelines on our wiki](https://github.com/18F/web-design-standards/wiki/Contribution-Guidelines:-Design).

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

[Open an issue](https://github.com/18F/web-design-standards/issues/new) if you have questions or need help with setup.

### Running locally

The U.S. Web Design Standards `uswds` package (the zip download and the
files needed to use the Standards on your project) is built primarily with
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
and SCSS source files meet our coding standards. To lint without the unit
tests, you'll need [Gulp][]. Install it globally (`npm install -g
gulp-cli`), then run:

```sh
gulp eslint
gulp stylelint
```

(Or, if you don't want to install Gulp globally, you can run `$(npm
bin)/gulp` instead of `gulp`.)

### Building

To build the `uswds` package in preparation for releases, run:

```sh
npm run build:package
# or
gulp release
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

## Our use of branches

See the [release documentation](RELEASE.md#release-process) for more information on our git/GitHub release workflow.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see [LICENSE.md](https://github.com/18F/web-design-standards/blob/develop/LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](https://github.com/18F/web-design-standards/blob/develop/LICENSE.md).

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
