import Component from "./usa-site-title.twig";
import Content from "./usa-site-title.json";

export default {
  title: "Components/Page Layout/Site Title",
};

const Template = (args) => Component(args);

export const SiteTitle = Template.bind({});
SiteTitle.args = Content;
