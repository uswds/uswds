import Component from "./usa-input.twig";
import Showcase from "./usa-input--showcase.twig"

export default {
  title: "Components/Form Inputs/Text Input",
  argTypes: {
    state: {
      name: "State",
      control: "radio",
      options: ["default", "focus", "error", "success", "disabled", "aria_disabled"],
      defaultValue: "default",
    }
  }
};

const Template = (args) => Component(args);
const ShowcaseTemplate = (args) => Showcase(args);

export const Input = Template.bind({});
Input.args = {
  state: "default"
}

export const Disabled = Template.bind({});
Disabled.args = {
  state: {
    defaultValue: "disabled"
  }
}

export const AriaDisabled = Template.bind({});
AriaDisabled.args = {
  state: {
    defaultValue: "aria_disabled"
  }
}

export const StateShowcase = ShowcaseTemplate.bind({});
StateShowcase.args = {}
