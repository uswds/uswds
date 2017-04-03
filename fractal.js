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
  paths: [dir]
}));

fractal.components.set('ext', '.njk');
fractal.components.set('path', path.join(dir, 'components'));
fractal.components.set('default.preview', '@uswds');
fractal.components.set('default.context', context);

fractal.docs.set('path', path.join(dir, 'docs'));

// mount /dist at /assets
fractal.web.set('static.path', path.join(dir, 'dist'));
fractal.web.set('static.mount', 'assets');
fractal.web.set('builder.dest', path.join(dir, 'build'));

module.exports = fractal;
