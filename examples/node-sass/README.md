# Using the Design System with [node-sass]

This example illustrates how to install both the USWDS and [node-sass]
with [npm], and automate the compilation of CSS files from the source
files.

All of the "logic" for this example lives in [package.json](package.json).
Before compiling the CSS, you have to install the Node dependencies with
[npm]:

```sh
npm install
```

Once you've done this, you can modify [src/css/main.scss](src/css/main.scss)
(or any `.scss` file in `src/css`) and run the following command to build
the CSS once:

```sh
npm run build:css
```

Or run the following to watch the source files and rebuild the CSS whenever
they're changed:

```sh
npm run watch:css
```

See the [node-sass CLI docs](https://github.com/sass/node-sass#usage-1) for
more information.

[node-sass]: https://github.com/sass/node-sass
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
