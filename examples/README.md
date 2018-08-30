# Usage examples

These directories illustrate how to use the Design System `uswds` [npm] package
with different tools:

1. Compiling CSS with [node-sass](node-sass/)
1. Bundling JavaScript with [browserify](browserify/) and [webpack](webpack/)
1. Automating CSS and JS generation with the [Grunt](grunt/) and [Gulp](gulp/)
   task runners

For each of these examples, you'll need to first install [Node.js] version 4 or
greater. Node comes with [npm], the Node Package Manager, a dependency manager
that uses the `package.json` in each directory to:

* determine what to download and install when you run `npm install`
* run repeatable tasks, or [scripts]
* publish your work to the npm registry

[Node.js]: https://nodejs.org/en/about/
[npm]: https://docs.npmjs.com/getting-started/what-is-npm
[scripts]: https://docs.npmjs.com/misc/scripts

## General

If you `require('uswds')` in your bundled JS, you will get the minified ES5 browser bundle. If you're handling ES5 conversion already or using a tool that does it automatically, you can work around this in two ways:

1. Import the specific entry point with `require('uswds/src/js/start')`.
1. Configure your bundler to read the entry point from the `jsnext:main` field instead of `main`.
