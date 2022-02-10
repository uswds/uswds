import Component from "./usa-media-block.twig";
import Data from "./usa-media-block.json";

export default {
  title: "Components/Content/Media Block",
};

const Template = (args) => Component(args);

export const MediaBlock = Template.bind({});
MediaBlock.args = Data;
