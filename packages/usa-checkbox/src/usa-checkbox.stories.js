import Component from "./usa-checkbox.twig";
import Tile from "./usa-checkbox--tile.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
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
export const CheckboxTile = TileTemplate.bind({});
