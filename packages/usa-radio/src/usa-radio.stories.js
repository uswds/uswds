import Component from "./usa-radio.twig";
import Tile from "./usa-radio--tile.twig";

export default {
  title: "Components/Form Inputs/Radio",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    indeterminate_state: {
      name: "Toggle indeterminate state",
      control: { type: "boolean" },
      defaultValue: false,
    },
  },
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const RadioTile = TileTemplate.bind({});

export const TileDisabled = TileTemplate.bind({});
TileDisabled.args = {
  disabled_state: "disabled",
};

export const TileAriaDisabled = TileTemplate.bind({});
TileAriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const Indeterminate = Template.bind({});
Indeterminate.argTypes = {
  indeterminate_state: {
    defaultValue: true,
  },
};

export const IndeterminateTile = TileTemplate.bind({});
IndeterminateTile.argTypes = {
  indeterminate_state: {
    defaultValue: true,
  },
};
