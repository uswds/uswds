import Component from "./usa-checkbox.twig";
import TileComponent from "./usa-checkbox--tile.twig";
import TestComponent from "./test/test-patterns/test-usa-checkbox.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
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
const TileTemplate = (args) => TileComponent(args);
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const Tile = TileTemplate.bind({});

export const DisabledTile = TileTemplate.bind({});
DisabledTile.args = {
  disabled_state: "disabled",
};

export const AriaDisabledTile = TileTemplate.bind({});
AriaDisabledTile.args = {
  disabled_state: "aria-disabled",
};

export const Test = TestTemplate.bind({});
Test.argTypes = {
  disabled_state: {
    table: { disable: true },
  },
  indeterminate: {
    table: { disable: true },
  },
};

export const Indeterminate = Template.bind({});
Indeterminate.argTypes = {
  indeterminate_state: {
    defaultValue: true,
    table: { disable: true },
  },
};

export const IndeterminateTile = TileTemplate.bind({});
IndeterminateTile.argTypes = {
  indeterminate_state: {
    defaultValue: true,
    table: { disable: true },
  },
};
