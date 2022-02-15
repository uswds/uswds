import Component from "./usa-identifier.twig";
import {
  DefaultContent,
  EsContent,
  MultipleLogosContent,
  EsMultipleLogosContent,
  NoLogosContent,
  EsNoLogosContent,
  TaxpayerContent,
  EsTaxpayerContent,
} from "./content";

export default {
  title: "Components/Identifier",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = DefaultContent;

export const DefaultSpanish = Template.bind({});
DefaultSpanish.args = EsContent;

export const MultipleParentsAndLogos = Template.bind({});
MultipleParentsAndLogos.args = MultipleLogosContent;

export const MultipleParentsAndLogosSpanish = Template.bind({});
MultipleParentsAndLogosSpanish.args = EsMultipleLogosContent;

export const NoLogos = Template.bind({});
NoLogos.args = NoLogosContent;

export const NoLogosSpanish = Template.bind({});
NoLogosSpanish.args = EsNoLogosContent;

export const TaxpayerDisclaimer = Template.bind({});
TaxpayerDisclaimer.args = TaxpayerContent;

export const TaxpayerDisclaimerSpanish = Template.bind({});
TaxpayerDisclaimerSpanish.args = EsTaxpayerContent;
