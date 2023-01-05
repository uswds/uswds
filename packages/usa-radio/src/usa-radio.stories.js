import Component from "./usa-radio.twig";
import Tile from "./usa-radio--tile.twig";

export default {
  title: "Components/Form Inputs/Radio",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
      defaultValue: "none"
    },
  }
};

const Template = (args) => Component(args);
const TileTemplate = (args) => Tile(args);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabled = Template.bind({});
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}


export const RadioTile = TileTemplate.bind({});

export const TileDisabled = TileTemplate.bind({});
TileDisabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const TileAriaDisabled = TileTemplate.bind({});
TileAriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}
