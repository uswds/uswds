import FormAddress from "../../templates/usa-address-form.twig";
import FormName from "../../templates/usa-name-form.twig";
import FormPassword from "../../templates/usa-password-reset-form.twig";
import FormSignIn from "../../templates/usa-sign-in/usa-sign-in-form/usa-sign-in-form.twig";
import FormSignInMultiple from "../../templates/usa-sign-in/includes/_usa-sign-in-multiple-inner.twig";

import DefaultContent from "../../templates/usa-sign-in/usa-sign-in.json";
import EsContent from "../../templates/usa-sign-in/usa-sign-in~lang-es.json";
import MultipleContent from "../../templates/usa-sign-in/usa-sign-in--multiple/usa-sign-in--multiple.json";
import EsMultipleContent from "../../templates/usa-sign-in/usa-sign-in--multiple/usa-sign-in--multiple~lang-es.json";

export default {
  title: "Patterns/Forms",
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
SignIn.args = DefaultContent;

export const SignInSpanish = SignInTemplate.bind({});
SignInSpanish.args = EsContent;

export const SignInMultiple = SignInMultipleTemplate.bind({});
SignInMultiple.args = MultipleContent;

export const SignInMultipleSpanish = SignInMultipleTemplate.bind({});
SignInMultipleSpanish.args = EsMultipleContent;
