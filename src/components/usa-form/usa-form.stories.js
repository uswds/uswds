import FormAddress from "../../templates/usa-address-form.twig";
import FormName from "../../templates/usa-name-form.twig";

export default {
  title: "Patterns/Component Patterns/Forms",
};

const AddressTemplate = (args) => FormAddress(args);
const NameTemplate = (args) => FormName(args);


export const MailingAddress = AddressTemplate.bind({});
export const Name = NameTemplate.bind({});