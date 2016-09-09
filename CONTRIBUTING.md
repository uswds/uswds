# Welcome!

We’re so glad you’re thinking about contributing to an 18F open source project! If you’re unsure about anything, just ask — or submit your issue or pull request anyway. The worst that can happen is we’ll politely ask you to change something. We appreciate all friendly contributions.

One of our goals is to ensure a welcoming environment for all contibutors to our projects. Our staff follows the [18F Code of Conduct](https://github.com/18F/code-of-conduct/blob/master/code-of-conduct.md), and all contributors should do the same.

We encourage you to read this project’s CONTRIBUTING policy (you are here), its [LICENSE](LICENSE.md), [README](README.md) and its [Workflow](https://github.com/18F/web-design-standards/wiki/Workflow) process.

If you have any questions or want to read more, check out the [18F Open Source Policy GitHub repository]( https://github.com/18f/open-source-policy), or just [shoot us an email](mailto:18f@gsa.gov).

## Guidelines

### Contributor Guidelines for Design
We have provided some guidelines for folks that would like to submit new components to the Draft Web Design Standards and the lifecycle those new components will go through. For more detail, please visit the [guidelines on our wiki](https://github.com/18F/web-design-standards/wiki/Component-Maturity-Scale).

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

### Building the project locally with gulp

The Draft U.S. Web Design Standards `uswds` package (the ZIP download and the
files needed to use the Standards on your project) and Standards website (our
public site that displays examples of each component and the HTML code) are
built using gulp automation. To use gulp, first make sure you’ve installed it on
your machine globally.

```sh
npm install --global gulp-cli
```

Then, to start, run the following command to install any new dependencies:

```sh
npm install
```

The following examples detail a few tasks you’ll encounter as you use gulp:

```sh
gulp build
```

The task above is an alias for running `gulp sass javascript images fonts` and
is the task to build all assets. Building the package will generate a `/dist`
directory with the contents of the ZIP archive made available to download.
Building just the package is useful if you’d like to create your own
distribution bundle for frameworks that aren’t supported via npm. The files in
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

After running this command, you’ll be able to view
the Draft U.S. Web Design Standards website locally (http://127.0.0.1:4000).
This also sets up gulp and Jekyll to watch for file changes to the `/docs`
and `/src` directories and rebuilds the website accordingly. The command is
aliased by `npm start`.

## Licenses and attribution

### A few parts of this project are not in the public domain

For complete attribution and licensing information for parts of the project that are not in the public domain, see [LICENSE.md](LICENSE.md).

### The rest of this project is in the public domain

The rest of this project is in the worldwide [public domain](LICENSE.md).

This project is in the public domain within the United States, and
copyright and related rights in the work worldwide are waived through
the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).

### Contributions will be released into the public domain

All contributions to this project will be released under the CC0
dedication. By submitting a pull request, you are agreeing to comply
with this waiver of copyright interest.
