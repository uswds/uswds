# Migration guide

## v1.2.0
[Version 1.2.0](https://github.com/18F/web-design-standards/releases/tag/v1.2.0)
includes a complete refactor of our JavaScript to modernize our code, and provides
better compatibility with third-party frameworks, such as React and Angular. You
can read more about the rationale and techniques in [this update][] **link needed**,
but here are the notable changes:

### Event delegation
All event handlers are managed with [delegated event listeners][event delegation]
on the `<body>` element so any dynamically created elements will no longer need
to be re-initialized. For instance, if you're importing the accordion component
like so:

```js
// ES5
var Accordion = require('uswds/src/js/components/accordion');

// or, in ES2015
import Accordion from 'uswds/src/js/components/accordion';
```

And if you then use the `Accordion` constructor to re-initialize dynamically created
elements, then you can safely remove all of your accordion-related code — **unless
you're also using the `Accordion` methods, `show()`, `hide()`, or `hideAll()`**.
These methods will remain available in v1.x for backwards compatibility, but the
API will change in v2.0.0.

### API changes
For backwards compatibility with v1.x, the following JavaScript submodule APIs have been preserved, but will change in v2.0.0:

* [components/accordion](src/js/components/accordion.js) will drop support for the exported `Accordion` class and methods.
* [components/navigation](src/js/components/navigation.js) exports a function for backwards compatibility, but will export a [behavior].
* [components/search](src/js/components/search.js) exports a function for backwards compatibility, but will export a [behavior].
* [components/validator](src/js/components/validator.js) exports a function for backwards compatibility, but will export a [behavior].
* [components/toggle-field-mask](src/js/components/toggle-field-mask.js) has been demoted to a [utility function](src/js/utils/toggle-field-mask.js) with a different API. The component submodule remains as a compatibility shim, but will be removed.
* [components/toggle-form-input](src/js/components/toggle-form-input.js) has been demoted to a [utility function](src/js/utils/toggle-form-input.js) with a different API. The component submodule remains as a compatibility shim, but will be removed.
* We've replaced our `when-dom-ready` utility with [domready](https://www.npmjs.com/package/domready). The [utils/when-dom-ready](src/js/utils/when-dom-ready.js) submodule remains for backwards compatibility with v1.x, but will be removed in v2.0.0. In the meantime, you can safely `npm install --save domready` and replace all instances of `require('uswds/src/js/utils/when-dom-ready')` with `require('domready')`.
* The `dispatch` utility is no longer used internally, and will be removed in v2.0.0. Rather than create per-element dispatch objects, you can use [receptor][] (or our [behavior utility function](src/js/utils/behavior.js)) to create [reusable behaviors][behavior].

### ES2015
The Standards JavaScript now relies on several features of [ES2015][] (AKA ES6),
the next version of JavaScript. Many ES2015 features aren't yet supported
natively by some browsers, so if you're `require()`-ing the module or its submodules,
you'll need to ensure that your bundling or compiling tool supports converting
ES2015 to browser-friendly ES5. If you're using any of the following frameworks or
tools, this should require zero additional configuration:

1. React uses [Babel] under the hood, so if you're using React, you're good to go.
1. If you're using [webpack] version 2, then everything in your bundle will be
   automatically converted to ES5, because
   [webpack 2 supports ES6 natively](https://webpack.js.org/api/module-methods/#es6-recommended-).
1. If you're using [webpack] version 1, we suggest
   [migrating to version 2](https://webpack.js.org/guides/migrating/). Otherwise,
   you'll need to [use babel-loader](http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/)
   and configure it with `include: [require.resolve('uswds')]`. More generally...
1. If you're already using [Babel] to compile your JavaScript, be sure that your
   bundler also compiles third-party modules (i.e. anything in `node_modules`).
1. If you're using Angular 2 or later, you're probably already using [TypeScript],
   in which case...
1. [TypeScript]'s `tsc` compiler will automatically convert ES2015 to the target
   ECMAScript version, which defaults to `ES3`. (Unless you're targeting IE9 or
   below, you can safely use `--target ES5`.)
  

[behavior]: https://github.com/shawnbot/receptor#behavior
[Babel]: https://babeljs.io/
[ES2015]: https://babeljs.io/learn-es2015/
[event delegation]: https://davidwalsh.name/event-delegate
[receptor]: https://github.com/shawnbot/receptor
[TypeScript]: https://www.typescriptlang.org/
[webpack]: https://webpack.js.org/
