# Releasing the Web Design Standards

This is our official process for releasing new versions of the [U.S. Web Design
Standards](https://standards.usa.gov).


## Table of contents
1. [Principles](#principles)
1. [Versioning](#versioning)
    1. [What is a release?](#what-is-a-release)
    1. [The public API](#the-public-api)
1. [Release process](#release-process)
    1. [Git(/Hub) workflow](#git-workflow)
    1. [Pre-releases](#pre-releases)
1. [Questions?](#questions)


## Principles
1. Follow well-established [versioning practices](#versioning)
1. Provide detailed notes for each [release](#what-is-a-release)
1. Encourage contributions and thank contributors for their hard work


## Versioning
[Semantic versioning][semver] is a method of numbering release versions that
aims to help users understand the implications of upgrading from one
[release](#what-is-a-release) to another. Semantic version numbers take the
form `major.minor.patch`, where:

* Bug fixes increment the `patch` number (e.g. `1.0.0` to `1.0.1`)
* New features increment the `minor` number and reset `patch` (e.g. `1.0.1` to
  `1.1.0`)
* Changes to the [public API](#public-api) (breaking changes) increment the
  `major` version and reset `minor` and `patch` (e.g. `1.1.2` to `2.0.0`)

### What is a release?
Technically, release of the Web Design Standards core code "lives" in two
different places:

1. On GitHub as a [tag][git tag] and corresponding [release][releases]
1. On [npm][what is npm] as a release of the [`uswds` package][uswds on npm] with the same version number as the GitHub release

### The public API
In most software projects, the "public API" corresponds to a single set of
programming constructs, such as public classes or functions.  Because the
Standards consist of tightly-bound HTML, CSS, and JavaScript, we must consider
any "breaking" change to _any_ of these as a change to the public API. For
example, any of the following should trigger a major version increment:

* Changing the name of any `.usa-` class name (documented or not)
* Changing the way in which elements with `.usa-` class names are structured in
  HTML
* Changing the HTML "API" for any of our interactive components, such as the
  [accordion](https://standards.usa.gov/accordions/)


## Release process

### Git workflow

* We have two main branches that are never deleted:

    * `master` always points to the latest release
    * `develop` contains changes being prepped for a release

* When introducing a change (feature, bug fix, etc.):

    1. Branch off `develop`:
  
        ```sh
        git fetch origin
        git checkout -b feature-foo origin/develop
        ```
      
    1. Name your branch pretty much anything except `master`, `develop`, or
       with the `release-` or `hotfix-` prefix. Suggested prefixes include
       `refactor-`, `feature-`, `docs-`, and `patch-`.

    1. File your pull request to merge into the `develop` branch.
  
* When publishing a new release:

    1. Branch off `develop` and use the branch name format `release-{version}`,
       e.g.

        ```sh
        git fetch origin
        git checkout -b release-1.0.0 origin/develop
        ```

    1. Run [`npm version`][npm version] with `--no-tag` to increment the version
       number semantically. (Versions are tagged on the `master` branch.)
     
        * For minor and major versions, publish a pre-release:

            ```sh
            npm version prerelease --no-tag
            ```

        * Otherwise, run either `npm version minor --no-tag` or `npm version major
          --no-tag`

        * In either case, [`npm version`][npm version] will increment the version
          number in `package.json` and commit the changes to git.

    1. Open a [pull request] from your `release-` branch to merge into `master`.
       List the key changes for a release in the pull request description. (The
       diff will show you exactly what has changed since the previous release.)
       See [the v1.0.0 pull request](https://github.com/18F/web-design-standards/pull/1726)
       for an example.

    1. Tag the release on the `master` branch **or** create the tag when you
       draft the release notes.

    1. Merge the release commits back into `develop` from `master` with a [pull
       request].

    1. Write the release notes on GitHub:

        1. [Draft the release][draft release] from the corresponding tag on the
           `master` branch.

        1. Have at least one team member review the release notes.

        1. Publish the [release](https://github.com/18F/web-design-standards/releases)
           on GitHub.

    1. Update the docs site with the new version number and release notes:

        1. Update the `uswds` Node dependency to the new version, e.g.:

            ```sh
            cd path/to/web-design-standards-docs
            export VERSION=1.0.0
            git fetch origin
            git checkout -b release-${VERSION} origin/develop
            npm install --save-dev uswds@${VERSION}
            ```

        1. Update the `version` [variable in
           _config.yml](https://github.com/18F/web-design-standards-docs/blob/master/_config.yml#L3).

        1. Follow the above release process to merge the changes to `master` via a
           [pull request on the docs repo](https://github.com/18F/web-design-standards-docs/compare),
           minus the GitHub release notes.

### Pre-releases

When releasing potentially disruptive changes, it's good practice to publish pre-releases of
planned versions. These are sometimes also called [release candidates]. Here's how it works:

1. Create a new branch from the release branch (`release-X.Y.Z`) with an additional
   [pre-release identifier](http://semver.org/#spec-item-9), such as `release-1.1.0-pre`,
   `release-1.1.0-alpha`, `release-1.1.0-rc1`.
   
1. Follow the [release process](#git-workflow) for your pre-release branch, with the following
   modifications:
   
   * Publish to npm with a [dist-tag](https://docs.npmjs.com/cli/dist-tag), e.g.
   
      ```sh
      npm version 1.1.0-pre
      npm publish --tag dev
      ```
      
   * Mark the GitHub release as a "pre-release", and be sure to note how long you intend on
     waiting for show-stopping bug reports before proceeding with the release.
     
   * Include instructions for installing the pre-release from npm with the dist-tag, e.g.:
   
      ```sh
      npm install --save uswds@dev
      ```
      
   * Directly notify users who may be impacted by the proposed changes, and encourage
     them to alert us of any new issues within the prescribed testing period.
     
1. If you receive reports of any regressions (specifically, **new issues** introduced in
   the release), you can decide whether to address them in another pre-release or file
   them for the next official release. If you decide to move proceed with the release,
   it's good practice to alert users of the issue in your release notes, preferably with
   a `:warning:` emoji or similar.
   
1. Otherwise, proceed with the next versioned release!

## Questions?
If you need help or have any questions, please reach out to us:

* File an [issue on GitHub](https://github.com/18F/web-design-standards/issues/new).
* Email us at [uswebdesignstandards@gsa.gov](mailto:uswebdesignstandards@gsa.gov).
* [Sign up](https://chat.18f.gov/) for our public [Slack] channel.


[draft release]: https://github.com/18F/web-design-standards/releases/new
[git tag]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[new release]: https://github.com/18F/web-design-standards/releases/new
[npm version]: https://docs.npmjs.com/cli/version
[pull request]: https://github.com/18F/web-design-standards/compare
[releases]: https://github.com/18F/web-design-standards/releases
[semver]: http://semver.org/
[uswds on npm]: https://npmjs.com/package/uswds
[what is npm]: https://docs.npmjs.com/getting-started/what-is-npm
[Slack]: https://slack.com/
[release candidates]: https://en.wikipedia.org/wiki/Software_release_life_cycle#Release_candidate
