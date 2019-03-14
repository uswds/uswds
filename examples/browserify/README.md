# Using the Design System with [browserify]

This example illustrates how to bundle the Design System JavaScript with
[browserify] and [npm].

First, install the dependencies with [npm]:

```sh
npm install
```

Once you've done this, you can modify [src/js/main.js](src/js/main.js) and run
the following command to build `js/main.js` and its complimentary [source map]:

```sh
npm run build:js
```

This example uses the following browserify plugins and transforms:

* The [babelify] transform uses [Babel] and the `babel` entry in `package.json`
  to convert the Design System JS from [ES2015] to browser-friendly ES5. **This
  is required,** and it also allows you to write your own code in ES2015
  because the transform is applied globally (rather than to each module
  individually).

* The [mapstraction] plugin, combined with browserify's `--debug` flag,
  writes a complimentary [source map] alongside the output file to enable
  debugging in supported browsers. You can disable this by removing the
  `--debug` and `-p mapstraction` arguments to `browserify`.

* The [uglifyify] transform compresses (or "minifies") the JavaScript with
  [UglifyJS], which dramatically reduces the output file size. You can
  disable this by removing `-g uglifyify` from the `browserify` arguments.

See the [browserify CLI docs](https://github.com/substack/node-browserify#usage)
for more information.

[babel]: https://babeljs.io/
[babelify]: https://github.com/babel/babelify
[browserify]: http://browserify.org/
[es2015]: https://babeljs.io/learn-es2015/
[mapstraction]: https://github.com/jiborobot/mapstraction
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[source map]: https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
[uglifyjs]: https://github.com/mishoo/UglifyJS2
[uglifyify]: https://github.com/hughsk/uglifyify

### JS bundling guidance
- You don't need to use `babelify` if you're just using `require('uswds')`, because our ["main" field](https://github.com/18F/web-design-standards/blob/develop/package.json#L5) points to the built distribution.
- If you wish to import uswds submodules directly with browserify,
 such as `require('uswds/src/js/components/accordion')`, you should use `babelify` as a global transform.
- If you're using `babelify` (or another Babel-powered browserify transform) already, you can access the ES2015 entry point directly with `require('uswds/src/js/start')`. **Note that you must either use the transform globally, or tell it _not_ to exclude scripts in `node_modules`.**
