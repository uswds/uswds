import Component from "./usa-skipnav.twig";
import Content from "./usa-skipnav.json";

export default {
  title: "Components/Page Layout/Skipnav",
};

const Template = (args) => Component(args);

export const Skipnav = Template.bind({});
Skipnav.args = Content;
