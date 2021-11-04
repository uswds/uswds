import Component from "./usa-nav__primary.twig";
import Data from "./usa-nav__primary.yml";
import CloseIcon from "../../../img/usa-icons/close.svg";

export default {
  title: "Components/Navigation/Primary",
  args: {
    CloseIcon,
  },
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Megamenu = Template.bind({});
Megamenu.args = {
  ...Data,
  megamenu: true,
};
