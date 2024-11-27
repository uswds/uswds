import FormCollected from "./test/test-pattern/test-usa-form.twig";
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
  argTypes: {
    disabled_state: {
      name: "Disabled state",
      control: { type: "radio" },
      options: ["none", "disabled", "aria-disabled"],
      table: { disable: true },
    },
    error_state: {
      name: "Error state",
      control: { type: "boolean" },
      table: { disable: true },
    },
  },
};

const CollectionTemplate = (args) => FormCollected(args);
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

export const DisabledFormElements = CollectionTemplate.bind({});
DisabledFormElements.argTypes = {
  disabled_state: {
    defaultValue: "disabled",
    table: { disable: false },
  },
};

export const TestErrorFormElements = CollectionTemplate.bind({});
TestErrorFormElements.argTypes = {
  error_state: {
    defaultValue: true,
    table: { disable: false },
  },
};
TestErrorFormElements.decorators = [
  (Story) =>
    `<div class="padding-x-205">
      ${Story()}
    </div>`,
];
