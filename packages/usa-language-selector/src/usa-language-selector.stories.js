import Component from "./usa-language-selector.twig";
import ComponentThreeOrMore from "./usa-language-selector--three-or-more/usa-language-selector--three-or-more.twig";
import ComponentHeader from "./usa-language-selector--header/usa-language-selector--header.twig";
import UnstyledHeader from "./usa-language-selector--unstyled/usa-language-selector--unstyled.twig";
import DefaultContent from "./usa-language-selector.json";
import ThreeOrMoreContent from "./usa-language-selector--three-or-more/usa-language-selector--three-or-more.json";
import HeaderContent from "./usa-language-selector--header/usa-language-selector--header.json";
import UnstyledContent from "./usa-language-selector--unstyled/usa-language-selector--unstyled.json";

export default {
  title: "Components/Language Selector",
};

const Template = (args) => Component(args);
const ThreeOrMoreTemplate = (args) => ComponentThreeOrMore(args);
const HeaderTemplate = (args) => ComponentHeader(args);
const UnstyledTemplate = (args) => UnstyledHeader(args);

export const TwoLanguages = Template.bind({});
TwoLanguages.args = DefaultContent;

export const ThreeOrMoreLanguages = ThreeOrMoreTemplate.bind({});
ThreeOrMoreLanguages.args = ThreeOrMoreContent;

export const InHeaderExample = HeaderTemplate.bind({});
InHeaderExample.args = HeaderContent;

export const UnstyledExample = UnstyledTemplate.bind({});
UnstyledExample.args = UnstyledContent;
