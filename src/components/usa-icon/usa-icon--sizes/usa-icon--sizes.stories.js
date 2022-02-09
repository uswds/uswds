import "@uswds/stylesheets/uswds.scss";
import Component from "./usa-icon--sizes.twig";
import Data from "./usa-icon--sizes.json";

export default {
  title: "Components/Icon Sizes",
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
IconSizes.args = Data;
