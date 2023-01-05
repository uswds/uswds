import Component from "./usa-checkbox.twig";
import Tile from "./usa-checkbox--tile.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
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
Disabled.argTypes ={
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabled = Template.bind({});
AriaDisabled.argTypes ={
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}

export const CheckboxTile = TileTemplate.bind({});

export const DisabledTile = TileTemplate.bind({});
DisabledTile.argTypes ={
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabledTile = TileTemplate.bind({});
AriaDisabledTile.argTypes ={
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}
