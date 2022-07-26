# USWDS Fonts

The component package for USWDS fonts. See font documentation on the [typesetting tokens page](https://designsystem.digital.gov/design-tokens/typesetting/overview/).

## Features

- Fonts
  - merriweather
  - public sans
  - roboto mono
  - source sans pro

See `uswds-fonts/package.json` for entrypoints.

## Getting started

```bash
npm install @uswds/uswds-fonts
```

## Running tests

No tests available at this time.

## Usage

Use SASS to generate the font face rules.

### SASS

Make sure `node_modules/@uswds` is included in your paths.

```scss
  @forward "uswds-fonts";

  body {
  @include typeset("body");
}

  .container {
    @include grid-container;
  }

  code {
    @include typeset("mono");
  }
```
