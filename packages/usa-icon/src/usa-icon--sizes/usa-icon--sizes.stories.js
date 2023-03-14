// TODO: Why is this here and not elsewhere?
import "../../../uswds/_index.scss";
import Component from "./usa-icon--sizes.twig";
import Content from "./usa-icon--sizes.json";

export default {
  title: "Design Tokens/Icons/Icon Sizes",
  argTypes: {
    icons: {
      table: { disable: true },
    },
    img_path: {
      table: { disable: true },
    },
  },
};

const Template = (args) => Component(args);

export const IconSizes = Template.bind({});
IconSizes.args = Content;
