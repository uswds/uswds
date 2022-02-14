import FormSignIn from "../../templates/usa-sign-in/usa-sign-in-form.twig";
import FormSignInMultiple from "../../templates/usa-sign-in/includes/_usa-sign-in-multiple-inner.twig";

import {
  DefaultContent,
  EsContent,
  MultipleContent,
  EsMultipleContent,
} from "../../templates/usa-sign-in/content";

export default {
  title: "Patterns/Authentication",
};

const SignInTemplate = (args) => FormSignIn(args);
const SignInMultipleTemplate = (args) => FormSignInMultiple(args);

export const SignIn = SignInTemplate.bind({});
SignIn.args = DefaultContent;

export const SignInSpanish = SignInTemplate.bind({});
SignInSpanish.args = EsContent;

export const SignInMultiple = SignInMultipleTemplate.bind({});
SignInMultiple.args = MultipleContent;

export const SignInMultipleSpanish = SignInMultipleTemplate.bind({});
SignInMultipleSpanish.args = EsMultipleContent;
