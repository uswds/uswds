import Component from "./usa-graphic-list.twig";
import Data from "./usa-graphic-list.json";

export default {
  title: "Components/Content/Graphic List",
};

const Template = (args) => Component(args);

export const GraphicList = Template.bind({});
GraphicList.args = Data;
