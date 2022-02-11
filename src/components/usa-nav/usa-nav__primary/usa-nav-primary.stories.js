import Component from "./usa-nav__primary.twig";
import Data from "./usa-nav__primary.json";

export default {
  title: "Components/Page Layout/Header/Partials/Primary",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const Megamenu = Template.bind({});
Megamenu.args = {
  ...Data,
  megamenu: true,
};
