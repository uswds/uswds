# Using the Design System with [Gulp]

This example illustrates how to build custom CSS and JS from the
Standards JavaScript with [Gulp].

First, install the dependencies with [npm]:

```sh
npm install
```

Once you've done this, you can modify [src/js/main.js](src/js/main.js) and run
the following command to build `js/main.js` and its complimentary [source map]:

```sh
npm run build:js
```

To build CSS from [src/css/main.scss], run:

```sh
npm run build:css
```

This example uses a slight variation of [this Gulp
recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-uglify-sourcemap.md)
for the `js` task, and borrows from [the Design System's own `sass` task](../../config/gulp/sass.js)
to build CSS from the SCSS sources.

[gulp]: http://gulpjs.com/
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[source map]: https://www.html5rocks.com/en/tutorials/developertools/sourcemaps/
