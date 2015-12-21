# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.9.0] - 2015-12-21
### Added
- Add package.json for npm support

### Changed
- Alphabetize Sass `@include`s
- Change explanation in accessibility callout
- Change name of project to draft standards

### Removed
- Remove postinstall script, users will have to compile Sass on their own
- Remove copyright year and sign from license and attributions

### Fixed
- Add the same margin bottom on all password inputs
- Refactor Sass in Core, Elements, and Components
- Fix design assets zip file name
- Fix tables by using table headers for accessibility

## [0.8.2] - 2015-11-24
### Added
- Add Sketch and OmniGraffle files to design download zip
- Add language to specify to use staging branch for development in README
- Add link on the word "Sass" to its project page [styleguide-only]
- Add email address into the mailto link on footer component
- Add email address to web standards email [styleguide-only]

### Changed
- Change accessibility copy on homepage [styleguide-only]
- Change alert colors to use variables
- Update text about Source Sans Pro's origin and license
- Update color contrast guidance
- Update Source Sans Pro fonts

### Removed
- Remove SVG fonts

### Fixed
- Fix unmatched strong tag [styleguide-only]
- Fix typo in docs [styleguide-only]
- Add patch for Firefox media blocks (media_link class)
- Remove extra jQuery link on homepage [styleguide-only]

## [0.8.1] - 2015-10-19
### Added
- Add ethnio activation code [styleguide-only]
- Add image links with `media_link` class
- Add required attributes to required fields
- Add force the ruby version when using RVM/rbenv
- Add note in docs about using caption tag inside table element [styleguide-only]
- Add missing checkmark png
- Add gem 'json' to the Gemfile
- Add alert role to error alerts
- Add link to thoughtbot.com in `pages/getting-started.html` [styleguide-only]

### Changed
- Change overflow to auto on styleguide sidenav [styleguide-only]
- Update footer text to be consistent with 18F policy [styleguide-only]
- Change link values to use hashes
- Update memorable dates inputs
- Change link to ./go script in README.md
- Ensure focus shadow on sidenav is above hover fill in `assets/_scss/components/_sidenav.scss`

### Removed
- Remove duplicate selectors in buttons
- Remove `tabindex="0"` on inputs
- Remove Omnigraffle mention in README.md
- Remove link to golang site from README.md
- Remove unnecessary function wrapping in `assets/js/components.js`

### Fixed
- Fix markdown spacing issue on colors page [styleguide-only]
- Fix `$color-gray-lightest` label to correct hex code [styleguide-only]
- Fix title for Forgot username in Sign in form
- Fix accessibility citation [styleguide-only]
- Fix incorrect hex code labels [styleguide-only]
- Fix typo of encompasses [styleguide-only]
- Fix WCAG name [styleguide-only]
- Fix typos in `_layout-system/grids.md` [styleguide-only]
- Fix alertdialog spelling in `_components/alerts.md` documentation [styleguide-only]
- Fix aria-hidden note in documentation in `_components/accordions.md` [styleguide-only]
- Fix visual bug in va-appeals-screenshot.png [styleguide-only]

## [0.8.0] - 2015-09-25
### Added
- Initial alpha release

[Unreleased]: https://github.com/18F/web-design-standards/compare/v0.8.1...HEAD
[0.8.1]: https://github.com/18F/web-design-standards/compare/v0.8...v0.8.1
