import Component from "./usa-language-selector.twig";
import Content from "./usa-language-selector.json";

export default {
  title: "Components/LanguageSelector",
};

const Template = (args) => Component(args);

export const LanguageSelector = Template.bind({});
LanguageSelector.args = Content;
