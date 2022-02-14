import Component from "./usa-combo-box.twig";

import Data from "./usa-combo-box.json";

export default {
  title: "Components/Main Content/Form Inputs/Combo Box",
};

const Template = (args) => Component(args);

export const ComboBox = Template.bind({});
ComboBox.args = Data;
