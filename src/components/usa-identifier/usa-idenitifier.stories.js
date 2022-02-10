import Component from "./usa-identifier.twig";
import {
  Data,
  EsData,
  MultipleLogosData,
  EsMultipleLogosData,
  NoLogosData,
  EsNoLogosData,
  TaxpayerData,
  EsTaxpayerData,
} from "./content";

export default {
  title: "Components/Page Layout/Identifier",
};

const Template = (args) => Component(args);

export const Default = Template.bind({});
Default.args = Data;

export const DefaultSpanish = Template.bind({});
DefaultSpanish.args = EsData;

export const MultipleParentsAndLogos = Template.bind({});
MultipleParentsAndLogos.args = MultipleLogosData;

export const MultipleParentsAndLogosSpanish = Template.bind({});
MultipleParentsAndLogosSpanish.args = EsMultipleLogosData;

export const NoLogos = Template.bind({});
NoLogos.args = NoLogosData;

export const NoLogosSpanish = Template.bind({});
NoLogosSpanish.args = EsNoLogosData;

export const TaxpayerDisclaimer = Template.bind({});
TaxpayerDisclaimer.args = TaxpayerData;

export const TaxpayerDisclaimerSpanish = Template.bind({});
TaxpayerDisclaimerSpanish.args = EsTaxpayerData;
