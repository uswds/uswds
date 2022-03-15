import Component from "./usa-icon.twig";
import Content from "./usa-icon.json";

export default {
  title: "Design Tokens/Icons",
  argTypes: {
    icons: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);

export const Icons = Template.bind({});
Icons.args = Content;
Icons.parameters = {
  axe: {
    skip: true,
  },
};
