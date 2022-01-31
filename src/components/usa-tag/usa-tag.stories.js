import Component from "./usa-tag.twig";
import Data from "./usa-tag.json";
import bigData from "./usa-tag~big.json";

export default {
  title: "Components/Tags",
};

const Template = (args) => Component(args);

export const Info = Template.bind({});
Info.args = Data;

export const big = Template.bind({});
big.args = bigData;
