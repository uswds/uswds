import Component from "./usa-language-selector.twig";
import ComponentMultiple from "./usa-language-selector--multiple/usa-language-selector--multiple.twig";
import ComponentHeader from "./usa-language-selector--header/usa-language-selector--header.twig";
import UnstyledHeader from "./usa-language-selector--unstyled/usa-language-selector--unstyled.twig";
import DefaultContent from "./usa-language-selector.json";
import MultipleContent from "./usa-language-selector--multiple/usa-language-selector--multiple.json";
import HeaderContent from "./usa-language-selector--header/usa-language-selector--header.json";
import UnstyledContent from "./usa-language-selector--unstyled/usa-language-selector--unstyled.json";

export default {
  title: "Components/Language Selector",
};

const Template = (args) => Component(args);
const MultipleTemplate = (args) => ComponentMultiple(args);
const HeaderTemplate = (args) => ComponentHeader(args);
const UnstyledTemplate = (args) => UnstyledHeader(args);

export const TwoLanguages = Template.bind({});
TwoLanguages.args = DefaultContent;

export const ThreeOrMoreLanguages = MultipleTemplate.bind({});
ThreeOrMoreLanguages.args = MultipleContent;

export const InHeaderExample = HeaderTemplate.bind({});
InHeaderExample.args = HeaderContent;

export const UnstyledExample = UnstyledTemplate.bind({});
UnstyledExample.args = UnstyledContent;
