import FormAddress from "../../templates/usa-address-form.twig";
import FormName from "../../templates/usa-name-form.twig";
import FormPassword from "../../templates/usa-password-reset-form.twig";

export default {
  title: "Patterns/Forms",
};

const AddressTemplate = (args) => FormAddress(args);
const NameTemplate = (args) => FormName(args);
const PasswordTemplate = (args) => FormPassword(args);

export const MailingAddress = AddressTemplate.bind({});
export const Name = NameTemplate.bind({});
export const ResetPassword = PasswordTemplate.bind({});
