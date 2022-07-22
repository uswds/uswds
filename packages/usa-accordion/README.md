# USWDS Accordion component package

To see the design system and its documentation on the web, visit [https://designsystem.digital.gov](https://designsystem.digital.gov).

## Features

- SASS
- JS
- Images

See `usa-accordion/package.json` for entrypoints.

## Getting started

```bash
npm install @uswds/usa-accordion
```

## Running tests

```bash
npm test -w @uswds/usa-accordion
```

Runs unit tests.

## Usage

### SASS

💡 Make sure you have SASS include paths for `node_modules/@uswds`.

```scss
// In SASS entrypoint
@forward "usa-accordion"
```

### JS

Using in javascript requires a tool like require.js, web pack, or rollup.

```js
import accordion from "@uswds/usa-accordion/js";
```
