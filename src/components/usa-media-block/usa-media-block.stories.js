import Component from "./usa-media-block.twig";
import Content from "./usa-media-block.json";

export default {
  title: "Components/Media Block",
};

const Template = (args) => Component(args);

export const MediaBlock = Template.bind({});
MediaBlock.args = Content;
