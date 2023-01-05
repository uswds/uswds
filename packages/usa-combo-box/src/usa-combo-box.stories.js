import Component from "./usa-combo-box.twig";
import TestComponent from "./test/test-patterns/test-usa-combo-box.twig";
import Content from "./usa-combo-box.json";

export default {
  title: "Components/Form Inputs/Combo Box",
  argTypes: {
    id: { table: { disable: true } },
    name: { table: { disable: true } },
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
      defaultValue: "none"
    },
  },
};

const Template = (args) => Component(args);
const TestTemplate = (args) => TestComponent(args);

export const Default = Template.bind({});
Default.args = Content;

export const Disabled = Template.bind({});
Disabled.args = Content;
Disabled.argTypes = {
  disabled_state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabled = Template.bind({});
AriaDisabled.args = Content;
AriaDisabled.argTypes = {
  disabled_state: {
    defaultValue: "aria_disabled"
  }
}

export const Test = TestTemplate.bind({});
