import Component from "./usa-nav__primary.twig";
import * as Data from "./usa-nav__primary";

export default {
  title: "Components/Navigation/Primary",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Megamenu = Template.bind({});
Megamenu.args = {
  ...Data,
  megamenu: true,
};
