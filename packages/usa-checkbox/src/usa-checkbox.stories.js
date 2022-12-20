import Component from "./usa-checkbox.twig";
import Tile from "./usa-checkbox--tile.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
  args: {
    disabled: false,
    aria_disabled: false
  }
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});
export const CheckboxTile = TileTemplate.bind({});
