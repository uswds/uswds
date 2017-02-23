## Welcome!

We’re so glad you’re thinking about contributing to an 18F open source project! If you’re unsure about anything, just ask — or submit your issue or pull request anyway. The worst that can happen is we’ll politely ask you to change something. We appreciate all friendly contributions.

One of our goals is to ensure a welcoming environment for all contibutors to our projects. Our staff follows the [18F Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md), and all contributors should do the same.

We encourage you to read this project’s CONTRIBUTING policy (you are here), its [LICENSE](https://github.com/18F/web-design-standards/blob/staging/LICENSE.md), [README](https://github.com/18F/web-design-standards/blob/staging/README.md) and its [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) process.

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
1. Create a branch from `staging` that lightly defines what you’re working on (for example, add-styles).
1. Ensure that your contribution works via `npm`, if applicable. See below under
   _Install the package locally via `npm-link`_.
1. Once you’re ready to submit a pull request, fill out the PULL REQUEST template provided.
1. Submit your pull request against the `staging` branch.

Have questions or need help with setup? Open an issue here [https://github.com/18F/web-design-standards/issues](https://github.com/18F/web-design-standards/issues).

### Running locally

The U.S. Web Design Standards `uswds` package (the ZIP download and the files needed to use the Standards on your project) is built using gulp automation. To use gulp, first make sure you've installed it on your machine globally.

```sh
npm install --global gulp-cli
```

Then, to start, run the following command to install any new dependencies:

```sh
npm install
```

The following examples detail a few `npm` commands that alias our gulp tasks and that are useful throughout local development:

```sh
npm test
```

This command runs the gulp task for `eslint` and our test suite for the `uswds` package. It is an alias for `gulp eslint test`.

```sh
npm run build
```

This command builds the `uswds` package. It is an alias for `gulp build`.

```sh
npm run build:package
```

This command builds the `uswds` package, which includes the zip files generated for release purposes. It is an alias for `gulp copy-vendor-sass && gulp release`.


```sh
npm run watch
```

This command watches for any changes that happen in the `src` directory and rebuilds the package if any changes are made.

## Coding guidelines

The purpose of our coding styleguides are to create consistent coding practices across 18F. The styleguide should be treated as a guide — rules can be modified according to project needs.

This project follows the 18F Front End Guide [CSS](https://pages.18f.gov/frontend/#css) and [JavaScript](https://pages.18f.gov/frontend/#javascript). Please use this guide for your reference.

## Our use of branches

The `staging` branch is the bleeding edge of development. When cutting a new [release](https://github.com/18F/web-design-standards/releases), we update the versioning on our files by branching off of the `staging` branch and submitting a pull request into our `release` branch. This helps to make `staging` a place that can always receive contributions, no matter where we are in the release process. New commits to `staging` are automatically deployed to [our staging site](https://standards-staging.usa.gov/).

The `master` branch always holds the latest production-ready release. When cutting a [release](https://github.com/18F/web-design-standards/releases), we create a release branch from `staging` named for the new version: for example, `v0.9.x`. Once we’ve completed QA on that branch, we tag the release and merge it into the `master` branch.

The branches `18f-pages` and `18f-pages-staging` _used_ to be the primary release and development branches, back when the site was hosted on `pages.18f.gov`. Those branches still auto deploy to 18F Pages, but will now only contain minimal redirects to the new site.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see [LICENSE.md](https://github.com/18F/web-design-standards/blob/staging/LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](https://github.com/18F/web-design-standards/blob/staging/LICENSE.md).

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

### Contributions will be released into the public domain

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
