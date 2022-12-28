import Component from "./usa-character-count.twig";

export default {
  title: "Components/Form Inputs/Character Count",
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria_disabled"],
    },
  }
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});
