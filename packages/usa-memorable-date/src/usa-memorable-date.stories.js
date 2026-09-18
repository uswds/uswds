import Component from "./usa-memorable-date.twig";

export default {
  title: "Components/Form Inputs/Memorable Date",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);

export const MemorableDate = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const Error = Template.bind({});
Error.args = {
  error_state: true,
};
Error.decorators = [(Story) => `<div class="padding-x-205">${Story()}</div>`];
