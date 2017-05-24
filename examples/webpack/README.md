# Using the Standards with [webpack 2][webpack]

This example illustrates how to bundle the Standards JavaScript with
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
