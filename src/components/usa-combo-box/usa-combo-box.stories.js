import Component from "./usa-combo-box.twig";

import Content from "./usa-combo-box.json";

export default {
  title: "Components/Form Inputs/Combo Box",
};

const Template = (args) => Component(args);

export const ComboBox = Template.bind({});
ComboBox.args = Content;
