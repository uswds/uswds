'use strict';

var fakeLink = function (text, current) {
  return {
    text: text,
    href: 'javascript:void(0)',
    current: current || false
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
        fakeLink('Distinct from one another', true),
      ],
    },
    secondary: {
      search: {
        // truthy
      },
      links: [
        fakeLink('Secondary priority link'),
        fakeLink('Easy to comprehend', true),
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
