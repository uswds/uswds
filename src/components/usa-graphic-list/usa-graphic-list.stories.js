import Component from "./usa-graphic-list.twig";
import Content from "./usa-graphic-list.json";

export default {
  title: "Components/Graphic List",
};

const Template = (args) => Component(args);

export const GraphicList = Template.bind({});
GraphicList.args = Content;
