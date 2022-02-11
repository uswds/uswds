import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import { headerData, headerMegamenuData } from "./content";

import {
  headerExtendedData,
  headerExtendedMegamenuData,
} from "./usa-header--extended";

import navSecondaryData from "../usa-nav/usa-nav__secondary/usa-nav__secondary.json";
import { SmallContent as SmallSearchContent } from "../usa-search/content";
import * as TitleData from "../../components/usa-site-title/usa-site-title.json";

export default {
  title: "Components/Page Layout/Header",
  args: {
    // Default search settings - Alternatively override in `usa-header.json`
    search: {
      ...SmallSearchContent,
      search_js: true,
    },
    ...TitleData,
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
    search: true,
  },
};

export const ExtendedMegamenu = ExtendedTemplate.bind({});
ExtendedMegamenu.args = {
  ...headerExtendedMegamenuData,
  navSecondaryData: {
    ...navSecondaryData,
    search: true,
  },
};
