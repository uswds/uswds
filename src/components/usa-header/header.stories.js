import "../../stylesheets/uswds.scss";
import Component from "./usa-header.twig";
import ComponentExtended from "./usa-header--extended/usa-header--extended.twig";
import usaHeaderData from "./usa-header.yml";
import usaHeaderMegamenuData from "./usa-header~megamenu.yml";
import usaHeaderExtendedData from "./usa-header--extended/usa-header--extended.yml";
import usaHeaderExtendedMegamenuData from "./usa-header--extended/usa-header--extended~megamenu.yml";
import usaNavSecondaryData from "../usa-nav/usa-nav__secondary/usa-nav__secondary.yml";
import { SmallContent as SmallSearchContent } from "../usa-search/content";

export default {
  title: "Components/Header",
  args: {
    // Default search settings - Alternatively override in `usa-header.yml`
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
  ...usaNavSecondaryData,
};

export const ExtendedMegamenu = ExtendedTemplate.bind({});
ExtendedMegamenu.args = {
  ...usaHeaderExtendedMegamenuData,
  ...usaNavSecondaryData,
};
