import Component from "./usa-search.twig";
import { DefaultContent } from "./content";

export default {
  title: "Components/Search",
  args: {
    search_js: false
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

