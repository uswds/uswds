import Component from "./usa-range.twig";

export default {
  title: "Components/Form Inputs/Range",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
    optional_unit: {
      name: "Unit",
      control: { type: "text" },
    },
    min: {
      name: "Min",
      control: { type: "number" },
      defaultValue: 0,
    },
    max: {
      name: "Max",
      control: { type: "number" },
      defaultValue: 100,
    },
    step: {
      name: "Step",
      control: { type: "number" },
      defaultValue: 10,
    },
  },
};

const Template = (args) => Component(args);

export const Range = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const UnitTest = Template.bind({});
UnitTest.args = {
  optional_unit: "Percent",
};
