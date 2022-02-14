import Medium from "./usa-footer.twig";
import Big from "./usa-footer--big.twig";
import Slim from "./usa-footer--slim.twig";

import { DefaultContent, BigContent, SlimContent } from "./content";

export default {
  title: "Components/Page Layout/Footer",
};

const Template = (args) => Medium(args);
const BigTemplate = (args) => Big(args);
const SlimTemplate = (args) => Slim(args);

export const BigFooter = BigTemplate.bind({});
BigFooter.args = BigContent;

export const MediumFooter = Template.bind({});
MediumFooter.args = DefaultContent;

export const SlimFooter = SlimTemplate.bind({});
SlimFooter.args = SlimContent;
