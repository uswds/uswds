import "../../stylesheets/uswds.scss";
import Component from "./usa-icon.twig";
import IconsData from "./usa-icon.json";

export default {
  title: "Components/Icons",
  argTypes: {
    icons: {
      sizes: {
        control: "text",
      },
      items: {
        control: "text",
      },
    },
  },
};

const Template = (args) => Component(args);

export const Icons = Template.bind({});
Icons.args = IconsData;
