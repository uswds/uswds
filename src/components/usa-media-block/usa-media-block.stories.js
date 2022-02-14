import Component from "./usa-media-block.twig";
import Content from "./usa-media-block.json";

export default {
  title: "Components/Main Content/Media Block",
};

const Template = (args) => Component(args);

export const MediaBlock = Template.bind({});
MediaBlock.args = Content;
