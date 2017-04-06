'use strict';

const path = require('path');
const fractal = require('@frctl/fractal').create();
const dir = __dirname;

const context = {
  title: 'U.S. Web Design Standards',
  uswds: {
    path: '../../dist',
  },
};

fractal.set('project.title', context.title);

const components = fractal.components;
components.set('ext', '.njk');
components.set('path', 'src/components');
components.set('default.preview', '@uswds');
components.set('default.context', context);

// use Nunjucks as the templating engine
components.engine(require('@frctl/nunjucks')({
  filters: {
    jsonify: d => JSON.stringify(d, null, '  '),
  },
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

const theme = require('@frctl/mandelbrot')({
  lang: 'en-US',
  skin: 'white',
  // display context data in YAML
  format: 'yaml',
  // which panels to show
  panels: [
    'html',
    'notes',
    'view',
    'context',
    'resources',
    'info',
  ],
});

web.theme(theme);

web.set('static.path', 'dist');
web.set('static.mount', 'dist');
// output files to /build
web.set('builder.dest', 'build');

module.exports = fractal;
