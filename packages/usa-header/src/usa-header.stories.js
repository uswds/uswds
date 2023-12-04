import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import DefaultContent from "./usa-header.json";
import MegamenuContent from "./usa-header~megamenu.json";
import ExtendedContent from "./usa-header--extended/usa-header--extended.json";
import ExtendedMegamenuContent from "./usa-header--extended/usa-header--extended-megamenu.json";
import navSecondaryContent from "../../usa-nav/src/usa-nav__secondary/usa-nav__secondary.json";
import { SmallContent as SmallSearchContent } from "../../usa-search/src/content";
import TitleContent from "../../usa-site-title/src/usa-site-title.json";

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
