import Component from "./usa-language-selector.twig";
import ComponentMultiple from "./usa-language-selector--multiple/usa-language-selector--multiple.twig";
import DefaultContent from "./usa-language-selector.json";
import MultipleContent from "./usa-language-selector--multiple/usa-language-selector--multiple.json";

export default {
  title: "Components/Language Selector",
};

const Template = (args) => Component(args);
const MultipleTemplate = (args) => ComponentMultiple(args);

export const LanguageSelector = Template.bind({});
LanguageSelector.args = DefaultContent;

export const MultipleLanguageSelector = MultipleTemplate.bind({});
MultipleLanguageSelector.args = MultipleContent;
