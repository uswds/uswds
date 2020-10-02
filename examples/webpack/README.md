# Using the Design System with [webpack 2][webpack]

This example illustrates how to bundle the USWDS JavaScript with
[webpack] version 2 and [npm].

First, install the dependencies with [npm]:

```sh
npm install
```

Once you've done this, you can modify [src/js/main.js](src/js/main.js) and run
the following command to build `js/main.js` and its complimentary [source map]:

```sh
npm run build:js
```

Unlike [browserify](../browserify), webpack automatically converts [ES2015] to
ES5 and resolves `import` and `export` statements. The `-p` ("production") and
`--devtool sourcemap` options to the webpack CLI enable minification and
[source map] generation, respectively.

See the [browserify CLI docs](https://github.com/substack/node-browserify#usage)
for more information.

[webpack]: https://webpack.js.org/
[es2015]: https://babeljs.io/learn-es2015/
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[source map]: https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/

### JS bundling guidance
- Because webpack 2 understands ES2015 natively, it's safe to use one of the above techniques import the original sources.
- As of this writing, it's not possible to take advantage of [tree shaking](https://webpack.js.org/guides/tree-shaking/) because the Standards source JavaScript doesn't use the `import`/`export` module syntax.