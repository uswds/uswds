# Releasing the Web Design Standards

This is our official process for releasing new versions of the Web Design Standards **after v1.0**.


## Table of contents
1. [Principles](#principles)
1. [Versioning](#versioning)
  1. [What is a release?](#what-is-a-release)
  1. [The public API](#the-public-api)
1. [Release process](#release-process)
  1. [Git(/Hub) workflow](#git-workflow)


## Principles
1. Follow well-established [versioning practices](#versioning)
1. Provide detailed notes for each [release](#what-is-a-release)
1. Encourage contributions and thank contributors for their hard work


## Versioning
[Semantic versioning][semver] is a method of numbering release versions that aims to help users understand the implications of
upgrading from one [release](#what-is-a-release) to another. Semantic version numbers take the form `major.minor.patch`, where:

* Bug fixes increment the `patch` number (e.g. `1.0.0` to `1.0.1`)
* New features increment the `minor` number and reset `patch` (e.g. `1.0.1` to `1.1.0`)
* Changes to the [public API](#public-api) (so-called "breaking changes") increment the `major` version and reset `minor` and `patch` (e.g. `1.1.2` to `2.0.0`)

### What is a release?
Technically, release of the Web Design Standards core code "lives" in two different places:

1. On GitHub as a [tag][git tag] and corresponding [release][releases]
1. On [npm][what is npm] as a release of the [`uswds` package][uswds on npm] with the same version number as the GitHub release

### The public API
In most software projects, the "public API" corresponds to a single set of programming constructs, such as public classes or functions.
Because the Standards consist of tightly-bound HTML, CSS, and JavaScript, we must consider any "breaking" change to _any_ of these as
a change to the public API. For instance, any of the following should trigger a major version increment:

* Changing the name of any `.usa-` class name (documented or not)
* Changing the way in which elements with `.usa-` class names are structured in HTML
* Changing the HTML "API" for any of our interactive components, such as the [accordion](https://standards.usa.gov/accordions/)


## Release process

### Git workflow

* We have two main branches that are never deleted:
  * `master` always points to the latest release
  * `develop` contains changes being prepped for a release

* **TODO**: Migrate `staging` to `develop`

* When introducing a change (feature, bug fix, etc.):
  1. Branch off `develop`:
  
      ```sh
      git fetch origin
      git co -b feature-foo origin/develop
      ```
      
  1. As a naming convention, your branch name can be anything except `master`, `develop`, or with the `release-` or `hotfix-` prefix
  1. Changes are merged back into the `develop` branch
  
* When publishing a new release:

  1. Branch off `develop` and use the branch name format `release-{version}`, e.g.

      ```sh
      git fetch origin
      git co -b release-1.0.0 origin/develop
      ```
  
  1. Merge release commits back into `master` _and_ `develop`
  1. Run [`npm version`][npm version] with `--no-tag` to increment the version number semantically.
     (Versions are tagged on the `master` branch.)
     
    * For minor and major versions, publish a pre-release:
  
      ```sh
      npm version prerelease --no-tag
      ```
      
    * Otherwise, run either `npm version minor --no-tag` or `npm version major --no-tag`
    * In either case, `npm version` will increments the version number in `package.json` and commit the changes to git

  1. That is the only thing that happens on a release branch!
  1. Merge into `master` with a PR
  1. List the key changes for a release in the description of the PR that merges the release branch into master.
     (The diff will show you exactly what has changed since the previous release.)
  1. Tag the release on the `master` branch
  1. Write the release notes on GitHub:
    1. Draft the release from the corresponding tag on master
    1. Have folks on the team review it
    1. Publish the release!
  1. Update the docs site with the new version number and release notes



[git tag]: https://git-scm.com/book/en/v2/Git-Basics-Tagging
[releases]: https://github.com/18F/web-design-standards/releases
[new release]: https://github.com/18F/web-design-standards/releases/new
[what is npm]: https://docs.npmjs.com/getting-started/what-is-npm
[uswds on npm]: https://npmjs.com/package/uswds
[semver]: http://semver.org/
[npm version]: https://docs.npmjs.com/cli/version
