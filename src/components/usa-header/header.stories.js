import "../../stylesheets/uswds.scss";
import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import usaHeaderData from "./usa-header.json";
import usaHeaderMegamenuData from "./usa-header~megamenu.json";
import usaHeaderExtendedData from "./usa-header--extended/usa-header--extended.json";
import usaHeaderExtendedMegamenuData from "./usa-header--extended/usa-header--extended~megamenu.json";
import {usaNavSecondaryData} from "../usa-nav/usa-nav__secondary/usa-nav__secondary.json";
import { SmallContent as SmallSearchContent } from "../usa-search/content";

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
Default.args = usaHeaderData;

export const Megamenu = Template.bind({});
Megamenu.args = usaHeaderMegamenuData;

export const Extended = ExtendedTemplate.bind({});
Extended.args = {
  ...usaHeaderExtendedData,
  usaNavSecondaryData,
};

export const ExtendedMegamenu = ExtendedTemplate.bind({});
ExtendedMegamenu.args = {
  ...usaHeaderExtendedMegamenuData,
  usaNavSecondaryData,
};
