import FormAddress from "../../templates/usa-address-form.twig";
import FormName from "../../templates/usa-name-form.twig";
import FormPassword from "../../templates/usa-password-reset-form.twig";
import FormSignIn from "../../templates/usa-sign-in/includes/_usa-sign-in-inner.twig";
import DataSignIn from "../../templates/usa-sign-in/usa-sign-in.json";
import FormSignInMultiple from "../../templates/usa-sign-in/includes/_usa-sign-in-multiple-inner.twig";
import DataSignInMultiple from "../../templates/usa-sign-in/usa-sign-in--multiple/usa-sign-in--multiple.json";

export default {
  title: "Components/Forms",
};

const AddressTemplate = (args) => FormAddress(args);
const NameTemplate = (args) => FormName(args);
const PasswordTemplate = (args) => FormPassword(args);
const SignInTemplate = (args) => FormSignIn(args);
const SignInMultipleTemplate = (args) => FormSignInMultiple(args);


export const MailingAddress = AddressTemplate.bind({});
export const Name = NameTemplate.bind({});
export const ResetPassword = PasswordTemplate.bind({});

export const SignIn = SignInTemplate.bind({});
SignIn.args = DataSignIn;

export const SignInMultiple = SignInMultipleTemplate.bind({});
SignInMultiple.args = DataSignInMultiple;
