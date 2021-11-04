import Component from "./usa-nav__secondary.twig";
import Data from "./usa-nav__secondary.yml";

export default {
  title: "Components/Navigation/Secondary",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const SearchIncluded = Template.bind({});
SearchIncluded.args = {
  ...Data,
  search: true,
};
