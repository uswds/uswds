import Component from "./usa-site-title.twig";
import Data from "./usa-site-title";

export default {
  title: "Components/Site Title",
};

const Template = (args) => Component(args);

export const SiteTitle = Template.bind({});
SiteTitle.args = Data;
