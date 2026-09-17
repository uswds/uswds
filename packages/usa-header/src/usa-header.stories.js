import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import DefaultContent from "./usa-header.json";
import MegamenuContent from "./usa-header~megamenu.json";
import ExtendedContent from "./usa-header--extended/usa-header--extended.json";
import ExtendedMegamenuContent from "./usa-header--extended/usa-header--extended-megamenu.json";
import navSecondaryContent from "../../usa-nav/src/usa-nav__secondary/usa-nav__secondary.json";
import { SmallContent as SmallSearchContent } from "../../usa-search/src/content";
import TitleContent from "../../usa-site-title/src/usa-site-title.json";
import navigation from "./index";
import accordion from "../../usa-accordion/src/index";

export default {
  title: "Components/Header",
  args: {
    // Default search settings - Alternatively override in `usa-header.json`
    search: {
      ...SmallSearchContent,
      search_js: true,
    },
    ...TitleContent,
  },
  decorators: [
    (Story, context) => {
      accordion.off?.();
      navigation.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        accordion.on();
        navigation.on();
        if (context.parameters.uswdsTest) {
          if (context.parameters.uswdsTest.scenario === "scoped") {
            navigation.off();
            navigation.on(document.querySelector(".usa-header"));
            navigation.on(document.getElementById("test-background"));
          }
          window.uswdsTest = {
            ready: true,
            teardown: (otherRoot = false) =>
              navigation.off(
                otherRoot
                  ? document.getElementById("test-background")
                  : document.body,
              ),
          };
        }
      });

      return story;
    },
  ],
};

const Template = (args) => Component(args);
const ExtendedTemplate = (args) => ComponentExtended(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Megamenu = Template.bind({});
Megamenu.args = {
  ...MegamenuContent,
};

export const Extended = ExtendedTemplate.bind({});
Extended.args = {
  ...ExtendedContent,
  navSecondaryContent: {
    ...navSecondaryContent,
    search: true,
  },
};

export const ExtendedMegamenu = ExtendedTemplate.bind({});
ExtendedMegamenu.args = {
  ...ExtendedMegamenuContent,
  navSecondaryContent: {
    ...navSecondaryContent,
    search: true,
  },
};

const TeardownTemplate = (args) => `${Component(args)}
  <main id="test-background"><h1>Background content</h1>
    <span aria-hidden="true" id="test-authored-hidden">Authored hidden content</span>
    <button id="test-before">Previous page action</button>
    <button id="test-after">Continue on page</button>
  </main>`;

export const TestTeardown = TeardownTemplate.bind({});
TestTeardown.args = DefaultContent;
TestTeardown.parameters = {
  uswdsTest: { suite: "teardown", scenario: "header" },
};

export const TestScopedTeardown = TeardownTemplate.bind({});
TestScopedTeardown.args = DefaultContent;
TestScopedTeardown.parameters = {
  uswdsTest: { suite: "teardown", scenario: "scoped" },
};

TestTeardown.tags = ["a11y-regression"];

TestScopedTeardown.tags = ["a11y-regression"];
