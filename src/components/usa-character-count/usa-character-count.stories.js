import "../../stylesheets/uswds.scss";
import Component from "./usa-character-count.twig";

export default {
  title: "Components/Character Count",
};

const Template = (args) => Component(args);

export const CharacterCount = Template.bind({});
