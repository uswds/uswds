import Component from "./usa-input.twig";
import Showcase from "./usa-input--showcase.twig"

export default {
  title: "Components/Form Inputs/Text Input",
};

const Template = (args) => Component(args);
const ShowcaseTemplate = (args) => Showcase(args);

export const Input = Template.bind({});
Input.argTypes = {
  state: {
    name: "State",
    control: "radio",
    options: ["default", "focus", "error", "success", "disabled", "aria_disabled"],
    defaultValue: "default",
  }
}

export const StateShowcase = ShowcaseTemplate.bind({});
StateShowcase.args = {}
