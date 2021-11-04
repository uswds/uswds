import Component from "./usa-site-title.twig";
import Data from "./usa-site-title.yml";

export default {
  title: "Components/Site Title",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;
