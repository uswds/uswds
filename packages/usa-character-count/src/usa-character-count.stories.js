import Component from "./usa-character-count.twig";
import disabledOption from "./index.json";

export default {
  title: "Components/Form Inputs/Character Count",
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});
CharacterCount.args = disabledOption;
