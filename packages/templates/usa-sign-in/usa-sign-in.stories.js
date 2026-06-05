import SignInForm from "./usa-sign-in.twig";
import SignInMultipleForm from "./usa-sign-in--multiple/usa-sign-in--multiple.twig";
import DefaultContent from "./usa-sign-in.json";
import EsContent from "./usa-sign-in~lang-es.json";
import MultipleContent from "./usa-sign-in--multiple/usa-sign-in--multiple.json";
import EsMultipleContent from "./usa-sign-in--multiple/usa-sign-in--multiple~lang-es.json";
import banner from "../../usa-banner/src/index";

export default {
  title: "Pages/Sign-In",
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => {
      banner.off?.();

      const story = Story();

      window.requestAnimationFrame(() => {
        banner.on?.();
      });

      return story;
    },
  ],
};

export const SignInPage = () =>
  SignInForm({
    ...DefaultContent,
  });

export const SignInPageSpanish = () =>
  SignInForm({
    ...EsContent,
  });

export const MultipleSignInPage = () =>
  SignInMultipleForm({
    ...MultipleContent,
  });

export const MultipleSignInPageSpanish = () =>
  SignInMultipleForm({
    ...EsMultipleContent,
  });
