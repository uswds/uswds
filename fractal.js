'use strict';
const pkg = require('./package.json');
const path = require('path');
const fractal = require('@frctl/fractal').create();

const context = {
  'package': {
    name: pkg.name,
    version: pkg.version,
  },
  uswds: {
    path: '../../dist',
  },
};

fractal.set('project.title', 'U.S. Web Design Standards');

const components = fractal.components;
components.set('ext', '.njk');
components.set('path', 'src/components');
components.set('default.preview', '@uswds');
components.set('default.context', context);

// use Nunjucks as the templating engine
components.engine(require('@frctl/nunjucks')({
  filters: {
    jsonify: d => JSON.stringify(d, null, '  '),
    dataurl: (d, type) => `data:${type},${encodeURIComponent(d)}`,
  },
  paths: [
    'src/components',
  ]
}));

const docs = fractal.docs;
docs.set('path', 'docs');

const web = fractal.web;

web.theme(require('@frctl/mandelbrot')({
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
}));

web.set('static.path', 'dist');
web.set('static.mount', 'dist');
// output files to /build
web.set('builder.dest', 'build');

module.exports = fractal;
