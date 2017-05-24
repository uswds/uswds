# Using the Standards with [Grunt]

This example illustrates how to build custom CSS and JS from the
Standards JavaScript with [Grunt].

First, install the dependencies with [npm]:

```sh
npm install
```

Once you've done this, you can modify [src/js/main.js](src/js/main.js) and run
the following command to build `js/main.js` and its complimentary [source map]:

```sh
npm run build:js
```

To build CSS from [src/css/style.scss](src/css/style.scss), run:

```sh
npm run build:css
```

This example uses [grunt-sass] and [grunt-browserify] to compile the
Sass into CSS, and bundle the JavaScript, respectively. There's also
a `watch` task (`grunt watch`) and npm script (`npm run watch`) that
will rebuild the CSS and JS whenever any of the source files change.

[grunt-browserify]: https://github.com/jmreidy/grunt-browserify
[grunt-sass]: https://github.com/sindresorhus/grunt-sass
[grunt]: https://gruntjs.com/
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[source map]: https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
