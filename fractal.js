'use strict';

const path = require('path');
const fractal = require('@frctl/fractal').create();
const dir = __dirname;

const context = {
  title: 'U.S. Web Design Standards'
};

fractal.set('project.title', context.title);

// use Nunjucks as the templating engine
fractal.components.engine(require('@frctl/nunjucks')({
  filters: {},
  paths: [
    // e.g. {% include 'meta.html' %}
    path.join(dir, 'src/templates'),
    // e.g. {% include 'nav/nav--primary.njk' %}
    path.join(dir, 'src/components'),
  ]
}));

fractal.components.set('ext', '.njk');
fractal.components.set('path', 'src/components');
fractal.components.set('default.preview', '@uswds');
fractal.components.set('default.context', context);

fractal.docs.set('path', 'docs');

// mount /dist at /assets
fractal.web.set('static.path', 'dist');
fractal.web.set('static.mount', 'assets');
// output files to /build
fractal.web.set('builder.dest', 'build');

module.exports = fractal;
