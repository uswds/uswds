import Component from "./usa-tag.twig";
import { DefaultContent, BigContent } from "./content";

export default {
  title: "Components/Tags",
};

const Template = (args) => Component(args);

export const Info = Template.bind({});
Info.args = DefaultContent;

export const Big = Template.bind({});
Big.args = BigContent;
