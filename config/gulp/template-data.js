'use strict';

var fakeLink = function (text) {
  return {
    text: text,
    href: 'javascript:void(0)',
  };
};

var header =  {
  title: 'Department of Web Standards',
  primary: {
    links: [
      {
        text: 'Section one',
        id: 'nav-section-one',
        links: [
          fakeLink('Page one'),
          fakeLink('Page two'),
          fakeLink('Page three'),
        ],
      },
      {
        text: 'Simple terms',
        id: 'nav-section-two',
        links: [
          fakeLink('Page four'),
          fakeLink('Page five'),
          fakeLink('Page six'),
        ],
      },
      fakeLink('Distinct from one another'),
    ],
  },
  navigation: {
    secondary: {
      search: {
        // truthy
      },
      links: [
        fakeLink('Secondary priority link'),
        fakeLink('Easy to comprehend'),
      ],
    },
  },
};

module.exports = {
  package: require('../../package.json'),
  lang: 'en-US',
  uswds: {
    path: '..',
  },
  meta: {
    title: 'Page title | Department of Web Standards',
  },
  header: header,
  footer: {
  },
};
