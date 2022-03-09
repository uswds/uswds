import Component from "./usa-breadcrumb.twig";
import { DefaultContent, WrapContent } from "./content";

export default {
  title: "Components/Breadcrumb",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const Wrap = Template.bind({});
Wrap.args = WrapContent;
