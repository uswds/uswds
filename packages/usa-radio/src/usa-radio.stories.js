import Component from "./usa-radio.twig";
import Tile from "./usa-radio--tile.twig";

export default {
  title: "Components/Form Inputs/Radio",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
    },
  }
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});
export const RadioTile = TileTemplate.bind({});
