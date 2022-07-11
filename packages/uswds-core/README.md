# Core SASS Package for the United States Web Design System

⚠️ This package has _no style output_ and used exclusively for SASS.

To see the design system and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

## Features

- SASS
  - Functions
  - Mixins
  - Placeholders
- JS
  - Utilities
  - Start script
- Fonts
  - merriweather
  - public sans
  - roboto mono
  - source sans pro
- Favicons

See `uswds-core/package.json` for entrypoints.

## Getting started

```bash
npm install @uswds/uswds-core
```

## Running tests

```bash
npm test -w @uswds/uswds-core
```

Runs JS and SASS unit tests.

## Usage

### SASS

💡 Make sure you have SASS include paths for `node_modules/@uswds`.

```scss
// Import at the top
@use "uswds-core" as *;

// Use functions and mixins
body {
  background-color: color("violet-80v");
  color: color("white");
  @include typeset("body");
}
```

### JS

Using in javascript requires a tool like require.js, web pack, or rollup.

```js
import isIosDevice from "@uswds/uswds-core/js/utils/is-ios-device";
```

### Fonts

Import into you project. They're available in `@uswds/uswds-core/src/assets/fonts`.

### Favicons

Import into you project. They're available in `@uswds/uswds-core/src/assets/favicons`.
