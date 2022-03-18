import Component from "./usa-nav__secondary.twig";
import Content from "./usa-nav__secondary.json";

export default {
  title: "Components/Header/Partials/Secondary",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Content;

export const SearchIncluded = Template.bind({});
SearchIncluded.args = {
  ...Content,
  search: true,
};
