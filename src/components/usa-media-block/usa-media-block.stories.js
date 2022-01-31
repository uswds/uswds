import Component from "./usa-media-block.twig";
import Data from "./usa-media-block.json";

export default {
  title: "Components/Media Block",
  argTypes: {
    img_path: { control: "" },
  },
};

const Template = (args) => Component(args);

export const MediaBlock = Template.bind({});
MediaBlock.args = Data;
