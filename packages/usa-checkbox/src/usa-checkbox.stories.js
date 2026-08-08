import Component from "./usa-checkbox.twig";
import TileComponent from "./usa-checkbox--tile.twig";
import TestComponent from "./test/test-patterns/test-usa-checkbox.twig";

export default {
  title: "Components/Form Inputs/Checkbox",
  args: {
    disabled_state: "none",
    indeterminate_state: false,
    state: "default",
    hint: "",
  },
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    indeterminate_state: {
      name: "Toggle indeterminate state",
      control: { type: "boolean" },
    },
    state: {
      name: "State",
      control: { type: "radio" },
      options: ["default", "error"],
    },
    hint: {
      name: "Hint text",
      control: { type: "text" },
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
  indeterminate_state: {
    table: { disable: true },
  },
};

export const Indeterminate = Template.bind({});
Indeterminate.args = {
  indeterminate_state: true,
};
Indeterminate.argTypes = {
  indeterminate_state: {
    table: { disable: true },
  },
};

export const IndeterminateTile = TileTemplate.bind({});
IndeterminateTile.args = {
  indeterminate_state: true,
};
IndeterminateTile.argTypes = {
  indeterminate_state: {
    table: { disable: true },
  },
};

export const WithHint = Template.bind({});
WithHint.args = {
  hint: "Select all that apply",
};

export const WithError = Template.bind({});
WithError.args = {
  state: "error",
};

export const WithHintAndError = Template.bind({});
WithHintAndError.args = {
  state: "error",
  hint: "Select all that apply",
};