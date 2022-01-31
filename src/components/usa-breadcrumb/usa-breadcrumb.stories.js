import Component from "./usa-breadcrumb.twig";
import { Data, WrapData } from "./content";

export default {
  title: "Components/Breadcrumb",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Wrap = Template.bind({});
Wrap.args = WrapData;
