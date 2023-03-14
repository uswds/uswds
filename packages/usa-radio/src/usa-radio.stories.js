import Component from "./usa-radio.twig";
import Tile from "./usa-radio--tile.twig";

export default {
  title: "Components/Form Inputs/Radio",
  argTypes: {
    aria_disabled: {
      control: { type: "boolean" },
      defaultValue: false,
      name: "aria-disabled",
    },
  },
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});
export const RadioTile = TileTemplate.bind({});
