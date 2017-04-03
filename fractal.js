'use strict';

const path = require('path');
const fractal = require('@frctl/fractal').create();
const dir = __dirname;

const context = {
  title: 'U.S. Web Design Standards'
};

fractal.set('project.title', context.title);

const components = fractal.components;
components.set('ext', '.njk');
components.set('path', 'src/components');
components.set('default.preview', '@uswds');
components.set('default.context', context);

// use Nunjucks as the templating engine
components.engine(require('@frctl/nunjucks')({
  filters: {},
  paths: [
    // e.g. {% include 'meta.html' %}
    path.join(dir, 'src/templates'),
    // e.g. {% include 'nav/nav--primary.njk' %}
    path.join(dir, 'src/components'),
  ]
}));

const docs = fractal.docs;
docs.set('path', 'docs');

const web = fractal.web;
// mount /dist at /assets
web.set('static.path', 'dist');
web.set('static.mount', 'assets');
// output files to /build
web.set('builder.dest', 'build');

module.exports = fractal;
