import Component from "./usa-accordion.twig";
import { DefaultContent, BorderedContent, MultiContent } from "./content";

import TestAccordionsTemplate from "./test/test-patterns/test-accordions.twig";

// Content imports
import HeaderContent from "../../usa-header/src/usa-header.json";
import HeaderExtendedContent from "../../usa-header/src/usa-header--extended/usa-header--extended.json";
import HeaderExtendedMegamenuContent from "../../usa-header/src/usa-header--extended/usa-header--extended-megamenu.json";
import HeaderMegamenuContent from "../../usa-header/src/usa-header~megamenu.json";

import BannerContent from "../../usa-banner/src/content/usa-banner.json";

// StorybookJS Setup
export default {
  title: "Components/Accordion",
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestAccordionsTemplate(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Bordered = Template.bind({});
Bordered.args = BorderedContent;

export const Multiselectable = Template.bind({});
Multiselectable.args = MultiContent;

export const Test = TestTemplate.bind({});
Test.args = {
  ...DefaultContent,
  ...BannerContent,
  header: HeaderContent,
  headerExtended: HeaderExtendedContent,
  headerMegamenu: HeaderMegamenuContent,
  headerMegamenuExtended: HeaderExtendedMegamenuContent,
};
