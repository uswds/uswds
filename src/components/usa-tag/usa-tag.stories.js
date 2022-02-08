import Component from "./usa-tag.twig";
import { Data, BigData } from "./content";

export default {
  title: "Components/Tags",
};

const Template = (args) => Component(args);

export const Info = Template.bind({});
Info.args = Data;

export const Big = Template.bind({});
Big.args = BigData;
