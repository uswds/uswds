import Component from "./usa-select.twig";
import MultipleTest from "./test/test-patterns/usa-select--multiple.twig";

export default {
  title: "Components/Form Inputs/Select",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
    },
  },
};

const Template = (args) => Component(args);
const MultipleTemplate = (args) => MultipleTest(args);

export const Select = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
  disabled_state: "disabled",
};

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  disabled_state: "aria-disabled",
};

export const Multiple = MultipleTemplate.bind({});
Multiple.args = {
  multiple: true,
  size: 0,
};

export const Error = Template.bind({});
Error.args = {
  error_state: true,
};
Error.decorators = [(Story) => `<div class="padding-x-205">${Story()}</div>`];
