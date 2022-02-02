import "../../stylesheets/uswds.scss";
import Component from "./usa-icon.twig";
import IconsData from "./usa-icon.json";

export default {
  title: "Components/Icons",
  argTypes: {
    icons: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);

export const Icons = Template.bind({});
Icons.args = IconsData;
Icons.parameters = {
  axe: {
    skip: true
  }
}
