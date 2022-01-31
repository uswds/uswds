import Component from "./usa-tooltip.twig";
import UtilityComponent from "./usa-tooltip--utilities.twig";

export default {
  title: "Components/Tooltip",
};

const Template = (args) => Component(args);
const UtilityTemplate = (args) => UtilityComponent(args);

export const Tooltip = Template.bind({});
export const TooltipUtility = UtilityTemplate.bind({});
