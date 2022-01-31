import Component from "./usa-combo-box.twig";

import Data from "./usa-combo-box.json";

export default {
  title: "Components/Combo Box",
  argTypes: {
    label: { control: "text" },
    default_value: { control: "text" },
  },
};

const Template = (args) => Component(args);

export const ComboBox = Template.bind({});
ComboBox.args = Data;
