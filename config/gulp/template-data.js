'use strict';

var fakeLink = function (text) {
  return {
    text: text,
    href: 'javascript:void(0)',
  };
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
  header: {
    title: 'Department of Web Standards',
  },
  navigation: {
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
            fakeLink('Page one'),
            fakeLink('Page two'),
            fakeLink('Page three'),
          ],
        },
        {
          text: 'Distinct from one another',
          href: 'javascript:void(0)',
        },
      ],
    },
  },
  footer: {
  },
};
