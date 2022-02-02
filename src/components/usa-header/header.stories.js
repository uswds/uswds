import "@uswds/stylesheets/uswds.scss";
import { content } from "@uswds/usa-search";
import { navSecondaryData } from "@uswds/usa-nav/usa-nav__secondary/usa-nav__secondary";
import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import headerData from "./usa-header";
import headerMegamenuData from "./usa-header~megamenu";
import headerExtendedData from "./usa-header--extended/usa-header--extended";
import headerExtendedMegamenuData from "./usa-header--extended/usa-header--extended-megamenu";

const { SmallSearchContent } = content.SmallContent

export default {
  title: "Components/Header",
  args: {
    // Default search settings - Alternatively override in `usa-header.json`
    search: {
      ...SmallSearchContent,
      search_js: true,
    },
  },
};

const Template = (args) => Component(args);
const ExtendedTemplate = (args) => ComponentExtended(args);

export const Default = Template.bind({});
Default.args = headerData;

export const Megamenu = Template.bind({});
Megamenu.args = headerMegamenuData;

export const Extended = ExtendedTemplate.bind({});
Extended.args = {
  ...headerExtendedData,
  navSecondaryData: {
    ...navSecondaryData,
    search: true
  },
};

export const ExtendedMegamenu = ExtendedTemplate.bind({});
ExtendedMegamenu.args = {
  ...headerExtendedMegamenuData,
  navSecondaryData: {
    ...navSecondaryData,
    search: true
  },
};
