import Component from "./usa-in-page-navigation.twig";
import Content from "./usa-in-page-navigation.json";

export default {
  title: "Components/In-Page Navigation",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Content;
