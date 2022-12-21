import Component from "./usa-character-count.twig";

export default {
  title: "Components/Form Inputs/Character Count",
  args: {
    disabled: false,
    aria_disabled: false,
  },
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});
